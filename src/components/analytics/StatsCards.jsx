import React from 'react';
import '../../styles/StatsCards.css';

const StatsCards = ({ keyMetrics }) => {
  const renderIcon = (iconName) => {
    const icons = {
      investors: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      // roi: (
      //   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      //     <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      //   </svg>
      // ),
      clock: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      trending: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  }; 

  const stats = [
    { 
      label: 'Total Investors', 
      value: keyMetrics?.total_investors || 0, 
      icon: 'investors', 
      color: '#3B82F6' 
    },
    // { 
    //   label: 'Average ROI', 
    //   value: `${(keyMetrics?.avg_roi || 0).toFixed(1)}%`, 
    //   icon: 'roi', 
    //   color: '#10B981' 
    // },
    { 
      label: 'Days Live', 
      value: keyMetrics?.time_since_launch_days || 0, 
      icon: 'clock', 
      color: '#F59E0B' 
    },
    { 
      label: 'Price Appreciation', 
      value: `${(keyMetrics?.price_appreciation || 0).toFixed(1)}%`, 
      icon: 'trending', 
      color: '#EF4444' 
    },
  ];

  return (
    <div className="stats-cards-grid">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card-analytics"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div 
            className="stat-icon-box"
            style={{ background: `${stat.color}15`, color: stat.color }}
          >
            {renderIcon(stat.icon)}
          </div>
          <div className="stat-content-box">
            <div className="stat-value-analytics">{stat.value}</div>
            <div className="stat-label-analytics">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;