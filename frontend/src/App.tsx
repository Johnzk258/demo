
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ClassPage from './pages/Class';
import Cart from './pages/Cart';
import Mine from './pages/Mine';
import ProductDetail from './pages/ProductDetail';
import './App.css';

type Page = 'home' | 'class' | 'cart' | 'mine' | 'detail';
type User = {
  uid: string,
  username: string
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
const config = { headers: { 'Content-Type': 'application/json' } };

export type Product = {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  piPrice: number;
  category: string;
  description: string;
  sales?: number;
  coupon?: string;
};


export const products: Product[] = [
  { id: '1', name: 'Apple iPhone 15 Pro Max', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/IPhone_15_Pro_Max_Natural_Titanium.png/440px-IPhone_15_Pro_Max_Natural_Titanium.png', originalPrice: 9800, piPrice: 1, category: '数码家电', description: 'Apple最新旗舰手机' },
  { id: '2', name: '华硕ROG玩家国度笔记本', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/ASUS_ROG_Strix_G16_G614JIR.jpg/440px-ASUS_ROG_Strix_G16_G614JIR.jpg', originalPrice: 966, piPrice: 1, category: '数码家电', description: '顶级游戏笔记本' },
  { id: '3', name: '飞利浦智能灯具套装', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Philips_Hue_Light_Bulb.jpg/440px-Philips_Hue_Light_Bulb.jpg', originalPrice: 399, piPrice: 1, category: '智能家居', description: '智能家居一站式体验' },
  { id: '4', name: '日本进口TaoT精品', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Apple_pie.jpg/440px-Apple_pie.jpg', originalPrice: 522, piPrice: 1, category: '食品', description: '日本进口精选商品' },
  { id: '5', name: '奥迪 RS e-tron GT', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Audi_RS_e-tron_GT_%28GE2%29_IMG_3886.jpg/440px-Audi_RS_e-tron_GT_%28GE2%29_IMG_3886.jpg', originalPrice: 1460000, piPrice: 1, category: '数码家电', description: '纯电动豪华轿跑' },
  { id: '6', name: '时尚高跟鞋', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/High-heeled_shoe.jpg/440px-High-heeled_shoe.jpg', originalPrice: 125, piPrice: 1, category: '时尚', description: '优雅时尚设计' },
];

export const categories = [
  { name: '数码家电', icon: '📱', desc: '智能家居一站式体验' },
  { name: '智能家居', icon: '🏠', desc: '智慧生活从这里开始' },
  { name: '食品', icon: '🍜', desc: '全球美食精选' },
  { name: '时尚', icon: '👗', desc: '潮流前线' },
];

declare global {
  interface Window {
    Pi: any;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
  if (window.Pi) {
    window.Pi.init({ version: "2.0", sandbox: false });
    console.log("Pi SDK initialized");
  }
}, []);
  
const handleSignIn = (user: User) => { setUser(user); };
const handleSignOut = () => { setUser(null); axiosClient.get('/user/signout'); };

const onReadyForServerApproval = (paymentId: string) => {
  axiosClient.post('/payments/approve', { paymentId }, config);
};
const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  axiosClient.post('/payments/complete', { paymentId, txid }, config);
};
const onCancel = (paymentId: string) => {
  axiosClient.post('/payments/cancelled_payment', { paymentId });
};
const onError = (error: Error, payment?: any) => {
  console.log("onError", error);
};

const buyWithPi = async (product: Product) => {
  if (!user) { setPage('mine'); return; }
  try {
    console.log("Starting payment for:", product.name);
    const paymentData = { amount: product.piPrice, memo: `Order ${product.name}`, metadata: { productId: product.id } };
    const callbacks = { onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log("Payment result:", payment);
  } catch (error) {
    console.log("Payment error:", error);
  }
};


const addToCart = (product: Product) => {
  setCartItems(prev => {
    const existing = prev.find(item => item.product.id === product.id);
    if (existing) {
      return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
    }
    return [...prev, { product, quantity: 1 }];
  });
};

const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const goToDetail = (product: Product) => {
    setSelectedProduct(product);
    setPage('detail');
  };

  const goBack = () => {
    setPage('home');
    setSelectedProduct(null);
  };

  return (
    <div className="app">
      <div className="page-content">
        {page === 'home' && <Home onProductClick={goToDetail} />}
        {page === 'class' && <ClassPage onProductClick={goToDetail} />}
        {page === 'cart' && <Cart items={cartItems} setItems={setCartItems} />}
        {page === 'mine' && <Mine user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />}
        {page === 'detail' && selectedProduct && <ProductDetail product={selectedProduct} onBack={goBack} onAddToCart={addToCart} onBuyWithPi={buyWithPi} />}
      </div>
      {page !== 'detail' && (
        <nav className="bottom-nav">
          <div className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </div>
          <div className={`nav-item ${page === 'class' ? 'active' : ''}`} onClick={() => setPage('class')}>
            <span className="nav-icon">📂</span>
            <span className="nav-label">Class</span>
          </div>
          <div className={`nav-item ${page === 'cart' ? 'active' : ''}`} onClick={() => setPage('cart')}>
           <span className="nav-icon">🛒</span>
           {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
           <span className="nav-label">Cart</span>

          </div>
          <div className={`nav-item ${page === 'mine' ? 'active' : ''}`} onClick={() => setPage('mine')}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Mine</span>
          </div>
        </nav>
      )}
    </div>
  );
}
