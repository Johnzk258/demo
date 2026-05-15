import axios from 'axios';
import React, { useState } from 'react';
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

declare global {
  interface Window {
    Pi: any;
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

export const categories = [
  { name: 'Phones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Audio', icon: '🎧' },
  { name: 'Watches', icon: '⌚' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Accessories', icon: '🔌' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 15 Pro Max',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/IPhone_15_Pro_Max_Natural_Titanium.png/440px-IPhone_15_Pro_Max_Natural_Titanium.png',
    originalPrice: 9999,
    piPrice: 3.14,
    category: 'Phones',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    sales: 5200,
    coupon: '10% OFF',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Samsung_Galaxy_S24_Ultra.png/440px-Samsung_Galaxy_S24_Ultra.png',
    originalPrice: 8999,
    piPrice: 2.86,
    category: 'Phones',
    description: 'Galaxy AI powered smartphone with S Pen and 200MP camera.',
    sales: 3800,
    coupon: '5% OFF',
  },
  {
    id: '3',
    name: 'MacBook Pro 16"',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Pro_16-inch.png/440px-MacBook_Pro_16-inch.png',
    originalPrice: 19999,
    piPrice: 6.28,
    category: 'Laptops',
    description: 'M3 Pro/Max chip, Liquid Retina XDR display, all-day battery.',
    sales: 2100,
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/AirPods_Pro_2nd_Gen.png/440px-AirPods_Pro_2nd_Gen.png',
    originalPrice: 1899,
    piPrice: 0.59,
    category: 'Audio',
    description: 'Active Noise Cancellation, Adaptive Transparency, USB-C charging.',
    sales: 8900,
    coupon: '15% OFF',
  },
  {
    id: '5',
    name: 'Apple Watch Ultra 2',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Apple_Watch_Ultra_2.png/440px-Apple_Watch_Ultra_2.png',
    originalPrice: 6499,
    piPrice: 2.05,
    category: 'Watches',
    description: 'The most rugged Apple Watch with precision dual-frequency GPS.',
    sales: 1500,
  },
  {
    id: '6',
    name: 'PlayStation 5',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/PlayStation_5.png/440px-PlayStation_5.png',
    originalPrice: 3899,
    piPrice: 1.23,
    category: 'Gaming',
    description: 'Next-gen gaming with ultra-high speed SSD and ray tracing.',
    sales: 6700,
    coupon: 'FREE GAME',
  },
];

const buyWithPi = async (product: Product) => {
  const Pi = window.Pi;
  if (!Pi) {
    alert('Please open in Pi Browser');
    return;
  }

  const paymentData = {
    amount: product.piPrice,
    memo: `Buy ${product.name}`,
    metadata: { productId: product.id },
  };

  const callbacks = {
    onReadyForServerApproval: (paymentId: string) => {
      axiosClient.post('/payments/approve', { paymentId });
    },
    onReadyForServerCompletion: (paymentId: string, txid: string) => {
      axiosClient.post('/payments/complete', { paymentId, txid });
    },
    onCancel: (paymentId: string) => {
      console.log('Payment cancelled', paymentId);
    },
    onError: (error: any, paymentId: string) => {
      console.log('Payment error', error, paymentId);
    },
  };

  try {
    const payment = await Pi.createPayment(paymentData, callbacks);
    console.log('Payment result', payment);
    alert('Payment successful! 🎉');
  } catch (err) {
    console.log('Payment failed', err);
    alert('Payment failed, please try again');
  }
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setPage('detail');
  };

  const handleBuyWithPi = (product: Product) => {
    buyWithPi(product);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home onProductClick={handleProductClick} />;
      case 'class':
        return <ClassPage onProductClick={handleProductClick} />;
      case 'cart':
        return <Cart />;
      case 'mine':
        return <Mine user={user} onSignIn={setUser} onSignOut={() => setUser(null)} />;
      case 'detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setPage('home')}
            onAddToCart={(p) => alert(`${p.name} added to cart!`)}
            onBuyWithPi={handleBuyWithPi}
          />
        ) : <Home onProductClick={handleProductClick} />;
      default:
        return <Home onProductClick={handleProductClick} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
      <div className="tab-bar">
        <div className={`tab-item ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          <span className="tab-icon">🏠</span>
          <span className="tab-label">Home</span>
        </div>
        <div className={`tab-item ${page === 'class' ? 'active' : ''}`} onClick={() => setPage('class')}>
          <span className="tab-icon">📂</span>
          <span className="tab-label">Class</span>
        </div>
        <div className={`tab-item ${page === 'cart' ? 'active' : ''}`} onClick={() => setPage('cart')}>
          <span className="tab-icon">🛒</span>
          <span className="tab-label">Cart</span>
        </div>
        <div className={`tab-item ${page === 'mine' ? 'active' : ''}`} onClick={() => setPage('mine')}>
          <span className="tab-icon">👤</span>
          <span className="tab-label">Mine</span>
        </div>
      </div>
    </div>
  );
}
