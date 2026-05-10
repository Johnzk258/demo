import React from 'react';
import { Product } from '../App';

export default function ProductDetail({ product, onBack, onAddToCart }: { product: Product; onBack: () => void; onAddToCart: (p: Product) => void }) {
  return (
    <div>
      <div className="detail-header">
        <span className="detail-back" onClick={onBack}>←</span>
        <span className="detail-title">Product Detail</span>
        <span style={{width:36}}></span>
      </div>

      <img className="detail-image" src={product.image} alt={product.name} onError={(e: any) => e.target.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360"><rect fill="%23f0f0f0" width="400" height="360"/><text x="200" y="185" text-anchor="middle" fill="%23ccc" font-size="16">No Image</text></svg>'} />

      <div className="detail-info">
        <div className="detail-price-row">
          <span className="detail-pi-price">{product.piPrice}</span>
          <span className="detail-original-price">¥{product.originalPrice}</span>
        </div>
        <div className="detail-name">{product.name}</div>
        {product.sales && <div className="detail-sales">{product.sales} sold</div>}
        {product.coupon && (
          <div style={{marginTop:8}}>
            <span className="product-card-coupon">{product.coupon}</span>
          </div>
        )}
      </div>

      <div className="detail-desc">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>

      <div style={{height:80}}></div>

      <div className="detail-bottom">
        <button className="btn-cart" onClick={() => onAddToCart(product)}>Add to Cart</button>
        <button className="btn-buy" onClick={() => onAddToCart(product)}>Buy Now</button>
      </div>
    </div>
  );
}
