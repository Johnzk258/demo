import React, { useState } from 'react';
import { products, categories, Product } from '../App';

export default function ClassPage({ onProductClick }: { onProductClick: (p: Product) => void }) {
  const [activeCat, setActiveCat] = useState(categories[0].name);
  const filtered = products.filter(p => p.category === activeCat);

  return (
    <div>
      <div className="search-bar">
        <input className="search-input" placeholder="🔍 Search Product" />
      </div>
      <div className="class-page">
        <div className="class-sidebar">
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`class-sidebar-item ${activeCat === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.name)}
            >
              {cat.icon} {cat.name}
            </div>
          ))}
        </div>
        <div className="class-products">
          <div className="class-products-title">{activeCat}</div>
          {filtered.length === 0 ? (
            <div style={{textAlign:'center',color:'#999',padding:40}}>No products</div>
          ) : (
            <div className="product-grid">
              {filtered.map(p => (
                <div className="product-card" key={p.id} onClick={() => onProductClick(p)}>
                  <img src={p.image} alt={p.name} onError={(e: any) => e.target.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180"><rect fill="%23f0f0f0" width="200" height="180"/><text x="100" y="95" text-anchor="middle" fill="%23ccc" font-size="14">No Image</text></svg>'} />
                  <div className="product-card-info">
                    <div className="product-card-name">{p.name}</div>
                    <div className="product-card-prices">
                      <span className="pi-price">{p.piPrice}</span>
                      <span className="original-price">¥{p.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
