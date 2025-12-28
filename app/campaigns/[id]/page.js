import { fetchCampaignById, fetchCampaignInsights } from '@/lib/api';
import CampaignDetailClient from './CampaignDetailClient';
import { notFound } from 'next/navigation';

export default async function CampaignDetailPage({ params }) {
  let campaign = null;
  let insights = null;
  let error = null;

  try {
    const resolvedParams = await params;
    const campaignId = resolvedParams.id;

    campaign = await fetchCampaignById(campaignId);
    
    if (!campaign) {
      notFound();
    }

    try {
      insights = await fetchCampaignInsights(campaignId);
    } catch (insightsError) {
      console.warn('Failed to fetch insights:', insightsError);
    }
  } catch (err) {
    console.error('Failed to fetch campaign:', err);
    
    if (err.status === 404 || err.message.includes('404')) {
      notFound();
    }
    
    error = err.message || 'Failed to load campaign';
  }

  if (error && !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">
            Failed to Load Campaign
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <a
            href="/campaigns"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <CampaignDetailClient campaign={campaign} insights={insights} error={error} />;
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const campaign = await fetchCampaignById(resolvedParams.id);
    
    if (!campaign) {
      return {
        title: 'Campaign Not Found',
      };
    }
    
    return {
      title: `${campaign.name} | Campaign Details`,
      description: `View performance metrics and details for ${campaign.name}`,
    };
  } catch {
    return {
      title: 'Campaign Details',
    };
  }
}