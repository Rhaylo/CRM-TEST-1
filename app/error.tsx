'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
            <div className="mb-6 max-w-lg rounded-lg bg-gray-100 p-4 text-left font-mono text-sm text-gray-800 border border-gray-300 overflow-auto">
                <p className="font-bold mb-2">Error Message:</p>
                <p>{error.message}</p>
                {error.digest && <p className="mt-2 text-xs text-gray-500">Digest: {error.digest}</p>}
            </div>
            <button
                onClick={() => reset()}
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition"
            >
                Try again
            </button>
        </div>
    );
}
