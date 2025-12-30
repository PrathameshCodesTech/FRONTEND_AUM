import React from 'react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import '../../styles/AnalyticsCharts.css';

const AnalyticsCharts = ({ analytics, chartType }) => {
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderIcon = (iconName) => {
    const icons = {
      pie: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.0451 20.7824 15.5448 21.4874 13.9423 21.8048C12.3397 22.1221 10.6839 22.0421 9.12016 21.5718C7.55645 21.1015 6.13101 20.2551 4.96904 19.1067C3.80707 17.9582 2.94485 16.5428 2.45667 14.9848C1.96849 13.4268 1.86954 11.7724 2.16832 10.1673C2.46711 8.56215 3.15571 7.05376 4.17202 5.77635C5.18834 4.49894 6.50227 3.4891 8.00002 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      line: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bar: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      donut: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  // Custom tooltip for better styling
  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {formatter ? formatter(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

const fundingBreakdown = analytics
  ? [
      {
        name: 'Funded',
        value: Number(analytics.funding_percentage),
        color: '#10B981',
      },
      {
        name: 'Available',
        value: 100 - Number(analytics.funding_percentage),
        color: '#F59E0B',
      },
    ]
  : [];


  // Render specific chart based on chartType prop
  const renderChart = () => {
    switch(chartType) {
      case 'payout':
        return (
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={analytics?.payout_history || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#999" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#999" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={formatCurrency} />}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                >
                  {analytics?.payout_history?.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`}
                      fill={entry.type === 'actual' ? '#10B981' : '#F59E0B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#10B981' }} />
                <span className="legend-text">Actual Payout</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#F59E0B' }} />
                <span className="legend-text">Projected</span>
              </div>
            </div>
          </div>
        );

      // case 'roi':
      //   return (
      //     <div className="chart-content">
      //       <ResponsiveContainer width="100%" height={280}>
      //         <PieChart>
      //           <Pie
      //             data={analytics?.roi_breakdown || []}
      //             dataKey="value"
      //             nameKey="name"
      //             cx="50%"
      //             cy="50%"
      //             innerRadius={55}
      //             outerRadius={90}
      //             label={({ value }) => `${value}%`}
      //             labelLine={false}
      //           >
      //             {analytics?.roi_breakdown?.map((entry, index) => (
      //               <Cell 
      //                 key={`roi-${index}`} 
      //                 fill={entry.color || COLORS[index % COLORS.length]}
      //               />
      //             ))}
      //           </Pie>
      //           <Tooltip content={<CustomTooltip formatter={(value) => `${value}%`} />} />
      //         </PieChart>
      //       </ResponsiveContainer>
      //       <div className="chart-legend">
      //         {analytics?.roi_breakdown?.map((item, index) => (
      //           <div key={index} className="legend-item">
      //             <span 
      //               className="legend-color" 
      //               style={{ background: item.color || COLORS[index % COLORS.length] }}
      //             />
      //             <span className="legend-text">{item.name}</span>
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //   );

      case 'funding':
        return (
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={fundingBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {analytics?.fundingBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {analytics?.fundingBreakdown.map((item, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ background: item.color || COLORS[index % COLORS.length] }}
                  />
                  <span className="legend-text">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'priceGrowth':
        return (
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={analytics?.portfolio_growth || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#999" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#999" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={formatCurrency} />}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        // If no chartType specified, render all charts in grid (backward compatibility)
        return (
          <div className="charts-grid-container">
            {/* Pie Chart - Funding Breakdown */}
            <div className="chart-card-box">
              <div className="chart-card-header">
                <div className="chart-title-section">
                  <div className="chart-icon" style={{ background: '#10B98115', color: '#10B981' }}>
                    {renderIcon('pie')}
                  </div>
                  <h4 className="chart-title-text">Funding Sources</h4>
                </div>
              </div> 
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={analytics?.fundingBreakdown || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {analytics?.fundingBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {analytics?.fundingBreakdown?.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{ background: item.color || COLORS[index % COLORS.length] }}
                    />
                    <span className="legend-text">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Line Chart - Price History */}
            <div className="chart-card-box chart-full-width">
              <div className="chart-card-header">
                <div className="chart-title-section">
                  <div className="chart-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
                    {renderIcon('line')}
                  </div>
                  <h4 className="chart-title-text">Price Growth Over Time</h4>
                </div>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={analytics?.price_history || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#999" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#999" 
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    />
                    <Tooltip 
                      content={<CustomTooltip formatter={formatCurrency} />}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Payout History */}
            <div className="chart-card-box">
              <div className="chart-card-header">
                <div className="chart-title-section">
                  <div className="chart-icon" style={{ background: '#F59E0B15', color: '#F59E0B' }}>
                    {renderIcon('bar')}
                  </div>
                  <h4 className="chart-title-text">Payout History</h4>
                </div>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart 
                    data={analytics?.payout_history || []}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="quarter" 
                      stroke="#999" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#999" 
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      content={<CustomTooltip formatter={formatCurrency} />}
                    />
                    <Bar 
                      dataKey="amount" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    >
                      {analytics?.payout_history?.map((entry, index) => (
                        <Cell 
                          key={`bar-${index}`}
                          fill={entry.type === 'actual' ? '#10B981' : '#F59E0B'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#10B981' }} />
                  <span className="legend-text">Actual Payout</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#F59E0B' }} />
                  <span className="legend-text">Projected</span>
                </div>
              </div>
            </div>

            {/* ROI Donut Chart */}
            {/* <div className="chart-card-box">
              <div className="chart-card-header">
                <div className="chart-title-section">
                  <div className="chart-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
                    {renderIcon('donut')}
                  </div>
                  <h4 className="chart-title-text">ROI Breakdown</h4>
                </div>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={analytics?.roi_breakdown || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {analytics?.roi_breakdown?.map((entry, index) => (
                        <Cell 
                          key={`roi-${index}`} 
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip formatter={(value) => `${value}%`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {analytics?.roi_breakdown?.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{ background: item.color || COLORS[index % COLORS.length] }}
                    />
                    <span className="legend-text">{item.name}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        );
    }
  };

  return renderChart();
};

export default AnalyticsCharts;