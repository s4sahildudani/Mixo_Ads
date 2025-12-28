const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

async function retryRequest(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === retries - 1;
      const shouldRetry = 
        error.status === 503 || 
        error.status === 408 || 
        error.name === 'AbortError';

      if (!shouldRetry || isLastRetry) {
        throw error;
      }

      const waitTime = delay * Math.pow(2, i);
      console.log(`Retrying in ${waitTime}ms... (attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export async function fetchCampaigns() {
  return retryRequest(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data.campaigns || data;
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.name = 'AbortError';
        throw timeoutError;
      }
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  });
}

export async function fetchCampaignById(id) {
  return retryRequest(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Campaign ${id} not found`);
          return null;
        }
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data.campaign || data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.name = 'AbortError';
        throw timeoutError;
      }
      console.error(`Error fetching campaign ${id}:`, error);
      throw error;
    }
  });
}

export async function fetchCampaignInsights(id) {
  return retryRequest(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data.insights || data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`Insights request timed out for campaign ${id}`);
        return null;
      }
      console.error(`Error fetching insights for ${id}:`, error);
      return null;
    }
  }, 2);
}

export async function fetchInsights() {
  return retryRequest(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/campaigns/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data.insights || data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Aggregate insights request timed out');
        return null;
      }
      console.error('Error fetching aggregate insights:', error);
      return null;
    }
  });
}

export async function fetchAggregateMetrics() {
  try {
    const campaigns = await fetchCampaigns();
    
    if (!campaigns || campaigns.length === 0) {
      return null;
    }
    
    const insightsPromises = campaigns.map(c => 
      fetchCampaignInsights(c.id).catch(() => null)
    );
    const allInsights = await Promise.all(insightsPromises);
    
    const validInsights = allInsights.filter(i => i !== null);
    
    if (validInsights.length === 0) {
      return null;
    }
    
    const totals = validInsights.reduce((acc, insight) => {
      acc.totalSpend += insight.spend || 0;
      acc.totalImpressions += insight.impressions || 0;
      acc.totalClicks += insight.clicks || 0;
      acc.totalConversions += insight.conversions || 0;
      return acc;
    }, {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
    });
    
    const avgCTR = totals.totalImpressions > 0 
      ? (totals.totalClicks / totals.totalImpressions) * 100 
      : 0;
    
    const avgCPC = totals.totalClicks > 0 
      ? totals.totalSpend / totals.totalClicks 
      : 0;
    
    const avgConversionRate = totals.totalClicks > 0 
      ? (totals.totalConversions / totals.totalClicks) * 100 
      : 0;
    
    return {
      ...totals,
      avgCTR,
      avgCPC,
      avgConversionRate,
    };
  } catch (error) {
    console.error('Error calculating aggregate metrics:', error);
    return null;
  }
}