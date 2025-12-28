'use client';

import { BarChart3, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">
              <BarChart3 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div className="navbar-title">
              <h1>Mixo Ads</h1>
              <p>Campaign Monitor</p>
            </div>
          </div>

          <div className="navbar-actions">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-refresh"
            >
              <RefreshCcw 
                style={{ width: '16px', height: '16px' }}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}