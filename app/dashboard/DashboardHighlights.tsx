import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Zap, Users, Briefcase, PhoneCall, CalendarCheck, FilePlus } from 'lucide-react';
import styles from './Dashboard.module.css';

interface KPIData {
  daily: { calls: number; offers: number; leads: number; appointments: number; conversations: number };
  monthly: { revenue: number; contracts: number };
  goals: { calls: number; offers: number; leads: number; revenue: number; contracts: number; conversations: number };
}

interface DashboardHighlightsProps {
  totalRevenue: number;
  activeDeals: number;
  totalClients: number;
  dealsWon: number;
  kpiData?: KPIData | null;
}

export default function DashboardHighlights({ totalRevenue, activeDeals, totalClients, dealsWon, kpiData }: DashboardHighlightsProps) {
  const pipelineTotal = activeDeals + dealsWon;
  const winRate = pipelineTotal > 0 ? Math.round((dealsWon / pipelineTotal) * 100) : 0;

  const dailyCalls = kpiData?.daily.calls ?? 0;
  const dailyOffers = kpiData?.daily.offers ?? 0;
  const dailyConvos = kpiData?.daily.conversations ?? 0;
  const dailyLeads = kpiData?.daily.leads ?? 0;

  const actions = [
    {
      label: 'Add new client',
      href: '/clients/new',
      icon: Users,
      caption: 'Start a new relationship',
      color: '#3b82f6',
      background: '#dbeafe'
    },
    {
      label: 'Schedule task',
      href: '/tasks',
      icon: CalendarCheck,
      caption: 'Keep the day organized',
      color: '#14b8a6',
      background: '#ccfbf1'
    },
  ];

  const focusItems = [
    { label: 'Follow up top 5 leads', tag: 'Priority', color: '#f59e0b', background: '#fef3c7' },
    { label: 'Review hot deals', tag: 'Pipeline', color: '#8b5cf6', background: '#ede9fe' },
    { label: 'Confirm today meetings', tag: 'Calendar', color: '#3b82f6', background: '#dbeafe' },
  ];

  return (
    <section className={styles.highlightsGrid}>
      <div className={`${styles.card} ${styles.highlightCard}`}>
        <div className={styles.highlightHeader}>
          <div>
            <p className={styles.highlightEyebrow}>Today in motion</p>
            <h2 className={styles.highlightTitle}>Your pipeline pulse</h2>
          </div>
          <div className={styles.highlightBadge}>
            <Sparkles size={16} />
            +{Math.max(activeDeals, 0)} active
          </div>
        </div>

        <div className={styles.highlightStats}>
          <div className={styles.highlightStat}>
            <span className={styles.statLabel}>Revenue</span>
            <strong className={styles.statValue}>${totalRevenue.toLocaleString()}</strong>
            <span className={styles.statHint}>Closed won</span>
          </div>
          <div className={styles.highlightStat}>
            <span className={styles.statLabel}>Deals won</span>
            <strong className={styles.statValue}>{dealsWon}</strong>
            <span className={styles.statHint}>This cycle</span>
          </div>
          <div className={styles.highlightStat}>
            <span className={styles.statLabel}>Clients</span>
            <strong className={styles.statValue}>{totalClients}</strong>
            <span className={styles.statHint}>Total accounts</span>
          </div>
        </div>

        <div className={styles.highlightProgress}>
          <div>
            <span className={styles.progressLabel}>Win rate</span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${winRate}%` }} />
            </div>
          </div>
          <p className={styles.progressHint}>Closing {winRate}% of active opportunities.</p>
        </div>

        <div className={styles.dailySignals}>
          <div className={styles.signalCard} style={{ '--signal-color': '#22c55e' } as CSSProperties}>
            <PhoneCall size={18} />
            <div>
              <span className={styles.signalValue}>{dailyCalls}</span>
              <span className={styles.signalLabel}>Calls</span>
            </div>
          </div>
          <div className={styles.signalCard} style={{ '--signal-color': '#f59e0b' } as CSSProperties}>
            <Zap size={18} />
            <div>
              <span className={styles.signalValue}>{dailyOffers}</span>
              <span className={styles.signalLabel}>Offers</span>
            </div>
          </div>
          <div className={styles.signalCard} style={{ '--signal-color': '#14b8a6' } as CSSProperties}>
            <ArrowUpRight size={18} />
            <div>
              <span className={styles.signalValue}>{dailyConvos}</span>
              <span className={styles.signalLabel}>Conversations</span>
            </div>
          </div>
          <div className={styles.signalCard} style={{ '--signal-color': '#3b82f6' } as CSSProperties}>
            <Users size={18} />
            <div>
              <span className={styles.signalValue}>{dailyLeads}</span>
              <span className={styles.signalLabel}>Leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.highlightSide}>
        <div className={`${styles.card} ${styles.quickActionsCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick actions</h3>
            <span className={styles.cardMeta}>Fast track</span>
          </div>
          <div className={styles.quickActionsGrid}>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href} className={styles.quickAction}>
                  <span
                    className={styles.quickActionIcon}
                    style={{ background: action.background, color: action.color }}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <span className={styles.quickActionTitle}>{action.label}</span>
                    <span className={styles.quickActionCaption}>{action.caption}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className={`${styles.card} ${styles.focusCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Focus today</h3>
            <span className={styles.cardMeta}>Momentum</span>
          </div>
          <div className={styles.focusList}>
            {focusItems.map((item) => (
              <div key={item.tag} className={styles.focusItem}>
                <span>{item.label}</span>
                <span
                  className={styles.focusTag}
                  style={{ background: item.background, color: item.color }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
