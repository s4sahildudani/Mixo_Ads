import { fetchCampaigns, fetchAggregateMetrics } from '@/lib/api';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  let campaigns = [];
  let metrics = null;
  let error = null;

  try {
    campaigns = await fetchCampaigns();
    
    try {
      metrics = await fetchAggregateMetrics();
    } catch (metricsError) {
      console.warn('Failed to fetch aggregate metrics:', metricsError);
    }
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    error = err.message;
  }

  return <DashboardClient campaigns={campaigns} metrics={metrics} error={error} />;
}

export const metadata = {
  title: 'Campaign Dashboard | Mixo Ads',
  description: 'Monitor and manage your advertising campaigns',
};