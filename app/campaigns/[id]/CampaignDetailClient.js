'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, Activity } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber, getPlatformIcon } from '@/utils/formatters';

export default function CampaignDetailClient({ campaign, insights, error }) {
  const router = useRouter();

  const getStatusClass = (status) => {
    const statusMap = {
      active: 'status-active',
      paused: 'status-paused',
      completed: 'status-completed',
    };
    return `status-badge ${statusMap[status?.toLowerCase()] || 'status-completed'}`;
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '32rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Failed to Load Campaign</h2>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Campaign Not Found
          </h2>
          <button onClick={() => router.push('/')} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div className="detail-header">
        <div className="detail-header-content">
          <button onClick={() => router.push('/')} className="back-button">
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="detail-container">
        <div className="campaign-header-card">
          <div className="campaign-header-top">
            <div>
              <h1 className="campaign-title">{campaign.name}</h1>
              <p className="campaign-id">Campaign ID: {campaign.id}</p>
            </div>
            <span className={getStatusClass(campaign.status)}>
              {campaign.status.toUpperCase()}
            </span>
          </div>

          <div className="budget-grid">
            <div className="budget-card budget-card-blue">
              <div className="budget-label" style={{ color: '#1e40af' }}>
                <DollarSign style={{ width: '20px', height: '20px' }} />
                <span>Total Budget</span>
              </div>
              <p className="budget-value" style={{ color: '#1e3a8a' }}>
                {formatCurrency(campaign.budget)}
              </p>
            </div>

            <div className="budget-card budget-card-green">
              <div className="budget-label" style={{ color: '#166534' }}>
                <Activity style={{ width: '20px', height: '20px' }} />
                <span>Daily Budget</span>
              </div>
              <p className="budget-value" style={{ color: '#14532d' }}>
                {formatCurrency(campaign.daily_budget)}
              </p>
            </div>

            <div className="budget-card budget-card-purple">
              <div className="budget-label" style={{ color: '#6b21a8' }}>
                <Calendar style={{ width: '20px', height: '20px' }} />
                <span>Created</span>
              </div>
              <p className="budget-value" style={{ color: '#581c87' }}>
                {formatDate(campaign.created_at)}
              </p>
            </div>
          </div>

          <div className="platforms-section">
            <p className="platforms-label">Platforms</p>
            <div className="platforms-list">
              {campaign.platforms.map((platform, idx) => (
                <span key={idx} className="platform-badge">
                  <span>{getPlatformIcon(platform)}</span>
                  <span>{platform}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {insights ? (
          <div>
            <h2 className="metrics-title">Performance Metrics</h2>
            <div className="metrics-grid">
              {[
                { label: 'Impressions', value: formatNumber(insights.impressions) },
                { label: 'Clicks', value: formatNumber(insights.clicks) },
                { label: 'Conversions', value: formatNumber(insights.conversions) },
                { label: 'Total Spend', value: formatCurrency(insights.spend) },
                { label: 'CTR', value: `${insights.ctr.toFixed(2)}%` },
                { label: 'CPC', value: `$${insights.cpc.toFixed(2)}` },
                { label: 'Conversion Rate', value: `${insights.conversion_rate.toFixed(2)}%` },
              ].map((metric) => (
                <div key={metric.label} className="metric-card">
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            <p>⚠️ Performance insights are temporarily unavailable. This may be due to API timeout or data processing.</p>
          </div>
        )}
      </div>
    </div>
  );
}