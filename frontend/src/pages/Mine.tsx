import React from 'react';

export default function Mine() {
  const menuItems = [
    { icon: '📦', text: 'My Orders' },
    { icon: '💰', text: 'Pi Wallet' },
    { icon: '🎫', text: 'My Coupons' },
    { icon: '📍', text: 'Shipping Address' },
    { icon: '❤️', text: 'Favorites' },
    { icon: '📜', text: 'Transaction History' },
    { icon: '⚙️', text: 'Settings' },
    { icon: '💬', text: 'Customer Service' },
  ];

  return (
    <div>
      <div className="mine-header">
        <div className="mine-avatar">👤</div>
        <div className="mine-name">Pi User</div>
        <div className="mine-uid">Sign in to view your profile</div>
      </div>

      <div className="mine-orders">
        <div className="mine-order-item">
          <div className="mine-order-icon">💰</div>
          <div className="mine-order-label">Pending</div>
        </div>
        <div className="mine-order-item">
          <div className="mine-order-icon">📦</div>
          <div className="mine-order-label">Shipping</div>
        </div>
        <div className="mine-order-item">
          <div className="mine-order-icon">✅</div>
          <div className="mine-order-label">Completed</div>
        </div>
        <div className="mine-order-item">
          <div className="mine-order-icon">↩️</div>
          <div className="mine-order-label">Returns</div>
        </div>
      </div>

      <div className="mine-menu">
        {menuItems.map(item => (
          <div className="mine-menu-item" key={item.text}>
            <span className="mine-menu-icon">{item.icon}</span>
            <span className="mine-menu-text">{item.text}</span>
            <span className="mine-menu-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
