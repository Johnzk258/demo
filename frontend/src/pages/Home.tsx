import React, { useState, useEffect } from 'react';
import { products, categories, Product } from '../App';

export default function Home({ onProductClick }: { onProductClick: (p: Product) => void }) {
  const [seckillTime, setSeckillTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(end.getHours() + 1, 0, 0, 0);
      const diff = end.getTime() - now.getTime();
      setSeckillTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Search Bar */}
      <div className="search-bar">
        <input className="search-input" placeholder="🔍 Search Product" />
      </div>

      {/* Banner */}
      <div className="banner">
        <div>
          <h2>🛍️ Welcome 314Pi Mall</h2>
          <p>All products payable with Pi</p>
        </div>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map(cat => (
          <div className="category-item" key={cat.name}>
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Seckill */}
      <div className="seckill">
        <div className="seckill-header">
          <span className="seckill-title">⚡ Seckill</span>
          <span className="seckill-timer">
            {String(seckillTime.h).padStart(2,'0')}:{String(seckillTime.m).padStart(2,'0')}:{String(seckillTime.s).padStart(2,'0')}
          </span>
          <span className="seckill-more">More ›</span>
        </div>
        <div className="seckill-products">
          {products.slice(0, 4).map(p => (
            <div className="seckill-product" key={p.id} onClick={() => onProductClick(p)}>
              <img src={p.image} alt={p.name} onError={(e: any) => e.target.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect fill="%23f0f0f0" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23ccc" font-size="12">No Image</text></svg>'} />
              <div className="seckill-price">π{p.piPrice}</div>
              <div className="seckill-original">¥{p.originalPrice}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-section">
        <div className="product-section-title">🔥 Recommend</div>
        <div className="product-grid">
          {products.map(p => (
            <div className="product-card" key={p.id} onClick={() => onProductClick(p)}>
              <img src={p.image} alt={p.name} onError={(e: any) => e.target.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180"><rect fill="%23f0f0f0" width="200" height="180"/><text x="100" y="95" text-anchor="middle" fill="%23ccc" font-size="14">No Image</text></svg>'} />
              <div className="product-card-info">
                <div className="product-card-name">{p.name}</div>
                <div className="product-card-prices">
                  <span className="pi-price">{p.piPrice}</span>
                  <span className="original-price">¥{p.originalPrice}</span>
                </div>
                {p.coupon && <div className="product-card-coupon">{p.coupon}</div>}
                {p.sales && <div className="product-card-sales">{p.sales > 1000 ? (p.sales/1000).toFixed(1)+'k' : p.sales} sold</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
