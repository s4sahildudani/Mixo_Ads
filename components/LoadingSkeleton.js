'use client';

export default function LoadingSkeleton() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }} className="animate-pulse">
          <div className="skeleton" style={{ height: '2rem', width: '16rem', marginBottom: '0.5rem' }}></div>
          <div className="skeleton" style={{ height: '1rem', width: '24rem' }}></div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="skeleton" style={{ height: '1rem', width: '6rem' }}></div>
                <div className="skeleton" style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.5rem' }}></div>
              </div>
              <div className="skeleton" style={{ height: '2rem', width: '8rem' }}></div>
            </div>
          ))}
        </div>

        <div className="table-container animate-pulse">
          <div style={{ padding: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: '3rem', marginBottom: '1rem' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}