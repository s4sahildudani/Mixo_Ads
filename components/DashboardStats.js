'use client';

import { DollarSign, TrendingUp, MousePointer, Target } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';

export default function DashboardStats({ metrics, loading }) {
  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '140px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
        <p>⚠️ Unable to load aggregate metrics. Individual campaign data is available below.</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Spend',
      value: formatCurrency(metrics.totalSpend),
      icon: DollarSign,
      iconColor: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      label: 'Impressions',
      value: formatNumber(metrics.totalImpressions),
      icon: TrendingUp,
      iconColor: '#9333ea',
      bgColor: '#faf5ff',
    },
    {
      label: 'Clicks',
      value: formatNumber(metrics.totalClicks),
      icon: MousePointer,
      iconColor: '#22c55e',
      bgColor: '#f0fdf4',
    },
    {
      label: 'Conversions',
      value: formatNumber(metrics.totalConversions),
      icon: Target,
      iconColor: '#f97316',
      bgColor: '#fff7ed',
    },
  ];

  const avgStats = [
    {
      label: 'Avg. CTR',
      value: formatPercentage(metrics.avgCTR),
    },
    {
      label: 'Avg. CPC',
      value: formatCurrency(metrics.avgCPC),
    },
    {
      label: 'Avg. Conversion Rate',
      value: formatPercentage(metrics.avgConversionRate),
    },
  ];

  return (
    <div className="stats-container">
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">{stat.label}</span>
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon style={{ width: '20px', height: '20px', color: stat.iconColor }} />
                </div>
              </div>
              <p className="stat-value">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="avg-stats-grid">
        {avgStats.map((stat) => (
          <div key={stat.label} className="avg-stat-card">
            <p className="avg-stat-label">{stat.label}</p>
            <p className="avg-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}