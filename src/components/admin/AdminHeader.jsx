import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import '../../styles/admin/AdminHeader.css';

const AdminHeader = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Fetch notification counts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch pending CP applications count
        const cpResult = await adminService.getCPApplicationsPendingCount();

           // Fetch pending investments count
        const investmentResult = await adminService.getInvestmentsPendingCount();
        
        // Fetch pending KYC count
        const kycResult = await adminService.getPendingKYC();
        
        const cpCount = cpResult.success ? cpResult.count : 0;
         const investmentCount = investmentResult.success ? investmentResult.count : 0;
        const kycCount = kycResult.success ? kycResult.count : 0;
        
        const totalCount = cpCount + investmentCount + kycCount;
        setNotificationCount(totalCount);
        
        // Build notifications array
        const notifs = [];
        if (cpCount > 0) {
          notifs.push({
            id: 'cp-applications',
            type: 'CP Applications',
            count: cpCount,
            message: `${cpCount} pending CP application${cpCount > 1 ? 's' : ''}`,
            link: '/admin/cp/applications',
            icon: '📋'
          });
        }

        if (investmentCount  > 0) {
          notifs.push({
            id: 'investments',
            type: 'Investments',
            count: investmentCount ,
            message: `${investmentCount } pending investment${investmentCount  > 1 ? 's' : ''}`,
            link: '/admin/investments',
            icon: '💰'
          });
        }

        if (kycCount > 0) {
          notifs.push({
            id: 'kyc',
            type: 'KYC',
            count: kycCount,
            message: `${kycCount} pending KYC verification${kycCount > 1 ? 's' : ''}`,
            link: '/admin/kyc',
            icon: '✓'
          });
        }
        
        setNotifications(notifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement global search logic
    console.log('Searching for:', searchQuery);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <form className="header-search" onSubmit={handleSearch}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search users, properties, investments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right">
        <button 
          className="header-notification" 
          onClick={handleNotificationClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              <span className="notification-count">{notificationCount} new</span>
            </div>
            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <a 
                    key={notif.id} 
                    href={notif.link} 
                    className="notification-item"
                    onClick={() => setShowNotifications(false)}
                  >
                    <span className="notification-icon">{notif.icon}</span>
                    <div className="notification-content">
                      <div className="notification-type">{notif.type}</div>
                      <div className="notification-message">{notif.message}</div>
                    </div>
                    <span className="notification-badge-small">{notif.count}</span>
                  </a>
                ))
              ) : (
                <div className="notification-empty">
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="header-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name">{user?.username}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-item">Profile Settings</div>
              <div className="profile-menu-item" onClick={onLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;