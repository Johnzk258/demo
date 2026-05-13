import React, { useState, useEffect } from 'react';
import axios from 'axios';

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

type User = AuthResult['user'];

type Order = {
  id: number,
  product_id: string,
  amount: number,
  memo: string,
  status: string,
  created_at: string,
  txid: string | null,
};

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
  const [subPage, setSubPage] = useState<string>('main');
  const [orders, setOrders] = useState<Order[]>([]);

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

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/orders');
      setOrders(res.data.orders || []);
    } catch (e) {
      console.log("fetchOrders error", e);
    }
  };

  useEffect(() => {
    if (subPage === 'orders' && user) {
      fetchOrders();
    }
  }, [subPage]);

  const getStatusText = (order: any) => {
    if (order.cancelled === 1) return '❌ Cancelled';
    if (order.paid === 1) return '✅ Completed';
    return '⏳ Pending';
  };


  const menuItems = [
    { icon: '📦', text: 'My Orders', page: 'orders' },
    { icon: '💰', text: 'Pi Wallet', page: 'wallet' },
    { icon: '🎫', text: 'My Coupons', page: 'coupons' },
    { icon: '📍', text: 'Shipping Address', page: 'address' },
    { icon: '❤️', text: 'Favorites', page: 'favorites' },
    { icon: '📜', text: 'Transaction History', page: 'history' },
    { icon: '⚙️', text: 'Settings', page: 'settings' },
    { icon: '💬', text: 'Customer Service', page: 'service' },
  ];

  if (subPage === 'orders') {
    return (
      <div>
        <div className="detail-header">
          <span className="detail-back" onClick={() => setSubPage('main')}>←</span>
          <span className="detail-title">My Orders</span>
          <span style={{width:36}}></span>
        </div>
        {orders.length === 0 ? (
          <div style={{textAlign:'center', padding:'40px 20px', color:'#999'}}>
            <div style={{fontSize:48}}>📦</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div style={{padding:'12px'}}>
            {orders.map((order) => (
              <div key={order.id} style={{background:'#fff', borderRadius:'12px', padding:'16px', marginBottom:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                  <span style={{fontWeight:'bold'}}>{order.memo || order.product_id}</span>
                  <span>{getStatusText(order.status)}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', color:'#666', fontSize:'14px'}}>
                  <span>{order.amount} Pi</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                {order.txid && (
                  <div style={{fontSize:'12px', color:'#999', marginTop:'4px', wordBreak:'break-all'}}>
                    TX: {order.txid.substring(0, 20)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (subPage === 'history') {
    return (
      <div>
        <div className="detail-header">
          <span className="detail-back" onClick={() => setSubPage('main')}>←</span>
          <span className="detail-title">Transaction History</span>
          <span style={{width:36}}></span>
        </div>
        {orders.length === 0 ? (
          <div style={{textAlign:'center', padding:'40px 20px', color:'#999'}}>
            <div style={{fontSize:48}}>📜</div>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div style={{padding:'12px'}}>
            {orders.filter(o => o.status === 'completed').map((order) => (
              <div key={order.id} style={{background:'#fff', borderRadius:'12px', padding:'16px', marginBottom:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                  <span style={{fontWeight:'bold'}}>{order.memo || order.product_id}</span>
                  <span style={{color:'#27ae60'}}>✅ {order.amount} Pi</span>
                </div>
                <div style={{color:'#666', fontSize:'14px'}}>
                  {new Date(order.created_at).toLocaleString()}
                </div>
                {order.txid && (
                  <div style={{fontSize:'12px', color:'#999', marginTop:'4px', wordBreak:'break-all'}}>
                    TX: {order.txid.substring(0, 20)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (subPage === 'wallet') {
    return (
      <div>
        <div className="detail-header">
          <span className="detail-back" onClick={() => setSubPage('main')}>←</span>
          <span className="detail-title">Pi Wallet</span>
          <span style={{width:36}}></span>
        </div>
        <div style={{textAlign:'center', padding:'40px 20px', color:'#999'}}>
          <div style={{fontSize:48}}>💰</div>
          <p>Please check your Pi Wallet in the Pi Browser</p>
        </div>
      </div>
    );
  }

  const handleMenuClick = (page: string) => {
    if (!user) {
      return;
    }
    setSubPage(page);
  };

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
        <div className="mine-order-item" onClick={() => user && fetchOrders().then(() => setSubPage('orders'))} style={{cursor: user ? 'pointer' : 'default'}}>
          <div className="mine-order-icon">💰</div>
          <div className="mine-order-label">Pending</div>
        </div>
        <div className="mine-order-item" onClick={() => user && fetchOrders().then(() => setSubPage('orders'))} style={{cursor: user ? 'pointer' : 'default'}}>
          <div className="mine-order-icon">📦</div>
          <div className="mine-order-label">Shipping</div>
        </div>
        <div className="mine-order-item" onClick={() => user && fetchOrders().then(() => setSubPage('history'))} style={{cursor: user ? 'pointer' : 'default'}}>
          <div className="mine-order-icon">✅</div>
          <div className="mine-order-label">Completed</div>
        </div>
        <div className="mine-order-item" onClick={() => user && fetchOrders().then(() => setSubPage('orders'))} style={{cursor: user ? 'pointer' : 'default'}}>
          <div className="mine-order-icon">↩️</div>
          <div className="mine-order-label">Returns</div>
        </div>
      </div>

      <div className="mine-menu">
        {menuItems.map(item => (
          <div className="mine-menu-item" key={item.text} onClick={() => handleMenuClick(item.page)} style={{cursor: user ? 'pointer' : 'default'}}>
            <span className="mine-menu-icon">{item.icon}</span>
            <span className="mine-menu-text">{item.text}</span>
            <span className="mine-menu-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

