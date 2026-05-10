import React from 'react';
import { Product } from '../App';

type CartItem = { product: Product; quantity: number };

export default function Cart({ items, setItems }: { items: CartItem[]; setItems: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.product.id !== id));
  };

  const totalPi = items.reduce((sum, item) => sum + item.product.piPrice * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div>
        <div className="search-bar"><div style={{color:'white',textAlign:'center',padding:'8px 0',fontWeight:600}}>🛒 Cart</div></div>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p>Cart is empty</p>
          <p style={{fontSize:12,marginTop:8}}>Go shopping now!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="search-bar"><div style={{color:'white',textAlign:'center',padding:'8px 0',fontWeight:600}}>🛒 Cart</div></div>
      <div className="cart-page">
        {items.map(item => (
          <div className="cart-item" key={item.product.id}>
            <img src={item.product.image} alt={item.product.name} onError={(e: any) => e.target.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect fill="%23f0f0f0" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23ccc" font-size="12">No Image</text></svg>'} />
            <div className="cart-item-info">
              <div className="cart-item-name">{item.product.name}</div>
              <div className="cart-item-price">π{item.product.piPrice}</div>
              <div className="cart-item-qty">
                <button className="qty-btn" onClick={() => item.quantity > 1 ? updateQty(item.product.id, -1) : removeItem(item.product.id)}>-</button>
                <span className="qty-num">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQty(item.product.id, 1)}>+</button>
              </div>
            </div>
            <span className="cart-item-delete" onClick={() => removeItem(item.product.id)}>✕</span>
          </div>
        ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">Total: <span className="pi-price">π{totalPi}</span></div>
        <button className="btn-checkout">Checkout ({items.reduce((s,i)=>s+i.quantity,0)})</button>
      </div>
    </div>
  );
}
