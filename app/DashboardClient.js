'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import CampaignTable from '@/components/CampaignTable';

export default function DashboardClient({ campaigns: initialCampaigns, metrics: initialMetrics, error: initialError }) {
  const [campaigns] = useState(initialCampaigns);
  const [metrics] = useState(initialMetrics);
  const [error] = useState(initialError);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Navbar onRefresh={handleRefresh} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="alert alert-error" style={{ maxWidth: '32rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Failed to Load Dashboard</h2>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={handleRefresh}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar onRefresh={handleRefresh} />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Campaign Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>
            Monitor and manage your advertising campaigns across all platforms
          </p>
        </div>

        <DashboardStats metrics={metrics} loading={isRefreshing} />
        <CampaignTable campaigns={campaigns} loading={isRefreshing} />
      </div>
    </div>
  );
}