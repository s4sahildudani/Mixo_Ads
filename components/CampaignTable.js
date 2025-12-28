'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate, getPlatformIcon } from '@/utils/formatters';
import { ChevronRight, Search, Filter } from 'lucide-react';

export default function CampaignTable({ campaigns, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <div className="table-container">
        <div style={{ padding: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton skeleton-card animate-pulse" style={{ marginBottom: '1rem' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    const statusMap = {
      active: 'status-active',
      paused: 'status-paused',
      completed: 'status-completed',
    };
    return `status-badge ${statusMap[status?.toLowerCase()] || 'status-completed'}`;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-header-content">
          <h2 className="table-title">All Campaigns</h2>
          
          <div className="table-filters">
            <div className="search-input">
              <Search className="search-icon" style={{ width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-select">
              <Filter className="filter-icon" style={{ width: '16px', height: '16px' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Platform</th>
              <th>Budget</th>
              <th>Daily Budget</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No campaigns found
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <Link href={`/campaigns/${campaign.id}`} className="campaign-link">
                      {campaign.name}
                    </Link>
                  </td>
                  <td>
                    <span className={getStatusClass(campaign.status)}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <div className="platform-list">
                      {campaign.platforms.map((platform, idx) => (
                        <span key={idx}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                      <span style={{ marginLeft: '0.25rem' }}>
                        {campaign.platforms.join(', ')}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td>
                    {formatCurrency(campaign.daily_budget)}
                  </td>
                  <td style={{ color: '#6b7280' }}>
                    {formatDate(campaign.created_at)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/campaigns/${campaign.id}`} className="view-link">
                      <span style={{ marginRight: '0.25rem' }}>View</span>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing <strong>{filteredCampaigns.length}</strong> of{' '}
          <strong>{campaigns.length}</strong> campaigns
        </p>
      </div>
    </div>
  );
}