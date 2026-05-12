import React, { useState } from 'react';
import axios from 'axios';

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

type User = AuthResult['user'];

interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string,
    sandbox: "true" | "false",
  }
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;
const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true });

export default function Mine({ user, onSignIn, onSignOut }: { user: User | null, onSignIn: (user: User) => void, onSignOut: () => void }) {
  const signIn = async () => {
    const scopes = ['username', 'payments'];
    const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    axiosClient.post('/user/signin', { authResult });
    onSignIn(authResult.user);
  }

  const onIncompletePaymentFound = (payment: any) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post('/payments/incomplete', { payment });
  }

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
        <div className="mine-name">{user ? user.username : 'Pi User'}</div>
        <div className="mine-uid" onClick={user ? onSignOut : signIn} style={{ cursor: 'pointer', color: '#6C5CE7' }}>
          {user ? 'Sign out' : 'Sign in to view your profile'}
        </div>
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
