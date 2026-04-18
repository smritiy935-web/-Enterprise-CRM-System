import { PieChart, BarChart, TrendingUp, Download } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="analytics-container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Enterprise Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Deep dive into your sales performance</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-mint" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Sync Data
          </button>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <PieChart size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3>Market Share Distribution</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Data visualization currently in preparation...</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <BarChart size={48} color="#4ade80" style={{ marginBottom: '1rem' }} />
          <h3>Conversion Velocity</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Processing real-time metrics...</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '20px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <h3>Predictive Insights</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Based on current trends, revenue is projected to grow by 12% next month.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
