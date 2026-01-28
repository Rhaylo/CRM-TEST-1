'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import styles from './Login.module.css';

// Utils function to combine class names
const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

// Custom Button Component
const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'outline' | 'ghost';
        size?: 'default' | 'sm' | 'lg';
    }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                size === 'default' && 'h-10 px-4 py-2',
                size === 'sm' && 'h-9 px-3',
                size === 'lg' && 'h-11 px-8',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Button.displayName = 'Button';

// Custom Input Component
const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <input
            className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

// DotMap Component
type RoutePoint = {
    x: number;
    y: number;
    delay: number;
};

const DotMap = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Set up routes that will animate across the map
    const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
        {
            start: { x: 100, y: 150, delay: 0 },
            end: { x: 200, y: 80, delay: 2 },
            color: '#3b82f6',
        },
        {
            start: { x: 200, y: 80, delay: 2 },
            end: { x: 260, y: 120, delay: 4 },
            color: '#3b82f6',
        },
        {
            start: { x: 50, y: 50, delay: 1 },
            end: { x: 150, y: 180, delay: 3 },
            color: '#3b82f6',
        },
        {
            start: { x: 280, y: 60, delay: 0.5 },
            end: { x: 180, y: 180, delay: 2.5 },
            color: '#3b82f6',
        },
    ];

    // Create dots for the world map
    const generateDots = (width: number, height: number) => {
        const dots = [];
        const gap = 12;
        const dotRadius = 1;

        // Create a dot grid pattern with random opacity
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                // Shape the dots to form a world map silhouette
                // This is a simplified approach - adjust to create a more accurate map
                const isInMapShape =
                    // North America
                    ((x < width * 0.25 && x > width * 0.05) &&
                        (y < height * 0.4 && y > height * 0.1)) ||
                    // South America
                    ((x < width * 0.25 && x > width * 0.15) &&
                        (y < height * 0.8 && y > height * 0.4)) ||
                    // Europe
                    ((x < width * 0.45 && x > width * 0.3) &&
                        (y < height * 0.35 && y > height * 0.15)) ||
                    // Africa
                    ((x < width * 0.5 && x > width * 0.35) &&
                        (y < height * 0.65 && y > height * 0.35)) ||
                    // Asia
                    ((x < width * 0.7 && x > width * 0.45) &&
                        (y < height * 0.5 && y > height * 0.1)) ||
                    // Australia
                    ((x < width * 0.8 && x > width * 0.65) &&
                        (y < height * 0.8 && y > height * 0.6));

                if (isInMapShape && Math.random() > 0.3) {
                    dots.push({
                        x,
                        y,
                        radius: dotRadius,
                        opacity: Math.random() * 0.5 + 0.1,
                    });
                }
            }
        }
        return dots;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
            canvas.width = width;
            canvas.height = height;
        });

        resizeObserver.observe(canvas.parentElement as Element);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dots = generateDots(dimensions.width, dimensions.height);

        let animationFrameId: number;
        let startTime = Date.now();

        // Draw background dots
        function drawDots() {
            if (!ctx) return;
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Draw the dots
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
                ctx.fill();
            });
        }

        // Draw animated routes
        function drawRoutes() {
            if (!ctx) return;
            const currentTime = (Date.now() - startTime) / 1000; // Time in seconds

            routes.forEach(route => {
                const elapsed = currentTime - route.start.delay;
                if (elapsed <= 0) return;

                const duration = 3; // Animation duration in seconds
                const progress = Math.min(elapsed / duration, 1);

                const x = route.start.x + (route.end.x - route.start.x) * progress;
                const y = route.start.y + (route.end.y - route.start.y) * progress;

                // Draw the route line
                ctx.beginPath();
                ctx.moveTo(route.start.x, route.start.y);
                ctx.lineTo(x, y);
                ctx.strokeStyle = route.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw the start point
                ctx.beginPath();
                ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = route.color;
                ctx.fill();

                // Draw the moving point
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#60a5fa';
                ctx.fill();

                // Add glow effect to the moving point
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
                ctx.fill();

                // If the route is complete, draw the end point
                if (progress === 1) {
                    ctx.beginPath();
                    ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = route.color;
                    ctx.fill();
                }
            });
        }

        // Animation loop
        function animate() {
            drawDots();
            drawRoutes();

            // If all routes are complete, restart the animation
            const currentTime = (Date.now() - startTime) / 1000;
            if (currentTime > 15) { // Reset after 15 seconds
                startTime = Date.now();
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

type BootstrapStatus = {
    hasUsers: boolean;
};

// LoginPage Component
export default function LoginPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    // Auth Logic State
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [bootstrapAllowed, setBootstrapAllowed] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Check for AUTH_DISABLED
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_AUTH_DISABLED && process.env.NEXT_PUBLIC_AUTH_DISABLED.includes('true')) {
            router.replace('/');
        }
    }, [router]);

    // Check Bootstrap Status
    useEffect(() => {
        let mounted = true;

        const loadStatus = async () => {
            try {
                const res = await fetch('/api/bootstrap/status', { cache: 'no-store' });
                if (!res.ok) return;
                const data = (await res.json()) as BootstrapStatus;
                if (mounted) {
                    setBootstrapAllowed(!data.hasUsers);
                }
            } catch (err) {
                if (mounted) {
                    setBootstrapAllowed(false);
                }
            }
        };

        loadStatus();

        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (isSignup) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        },
                    },
                });

                if (signUpError) {
                    console.error('Sign Up Error Details:', signUpError);
                    setError(signUpError.message || 'Unable to create account.');
                    return;
                }

                const user = data.user;

                if (!user) {
                    setError('Account created, but profile setup failed.');
                    return;
                }

                const claimResponse = await fetch('/api/bootstrap/claim', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || name,
                    }),
                });

                if (!claimResponse.ok) {
                    const text = await claimResponse.text();
                    setError(text || 'Account created, but CEO assignment failed.');
                    return;
                }

                router.push('/');
                router.refresh();
                return;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || JSON.stringify(err) || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.halo} />
            <div className={styles.haloBottom} />
            <div className={styles.frame}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={styles.card}
                >
                    <div className={styles.leftPanel}>
                        <div className={styles.mapLayer}>
                            <DotMap />
                        </div>
                        <div className={styles.brandOverlay}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className={styles.brandIcon}
                            >
                                <ArrowRight className="text-white" size={22} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className={styles.brandTitle}
                            >
                                XYRE CRM
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className={styles.brandSubtitle}
                            >
                                Sign in to manage leads, deals, and workflows in one place.
                            </motion.p>
                        </div>
                    </div>

                    <div className={styles.rightPanel}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={styles.content}
                        >
                            <h1 className={styles.heading}>
                                {isSignup ? 'Create Account' : 'Welcome back'}
                            </h1>
                            <p className={styles.subheading}>
                                {isSignup ? 'Enter your details to get started' : 'Sign in to your account'}
                            </p>



                            <form className={styles.form} onSubmit={handleSubmit}>
                                <AnimatePresence mode="popLayout">
                                    {isSignup && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={styles.field}
                                        >
                                            <label htmlFor="name" className={styles.label}>
                                                Full Name <span className="text-blue-500">*</span>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                required={isSignup}
                                                className={styles.input}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className={styles.field}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email <span className="text-blue-500">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password <span className="text-blue-500">*</span>
                                    </label>
                                    <div className={styles.passwordWrap}>
                                        <Input
                                            id="password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className={styles.input}
                                        />
                                        <button
                                            type="button"
                                            className={styles.passwordToggle}
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        >
                                            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`${styles.message} ${styles.messageError}`}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`${styles.message} ${styles.messageSuccess}`}
                                    >
                                        {message}
                                    </motion.div>
                                )}
                                {bootstrapAllowed && isSignup && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`${styles.message} ${styles.messageCallout}`}
                                    >
                                        Secure Registration Enabled: You will become the CEO.
                                    </motion.div>
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                >
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className={cn(styles.submitButton, isHovered ? "shadow-lg" : "")}
                                    >
                                        <span className="flex items-center justify-center relative z-10">
                                            {loading
                                                ? (isSignup ? 'Creating account...' : 'Signing in...')
                                                : (isSignup ? 'Create Account' : 'Sign in')}
                                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                        </span>
                                    </Button>
                                </motion.div>

                                <div className={styles.footer}>
                                    <a href="/login/forgot" className={styles.linkPrimary}>
                                        Forgot password?
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSignup(!isSignup);
                                            setError('');
                                            setMessage('');
                                        }}
                                        className={styles.linkSecondary}
                                    >
                                        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
