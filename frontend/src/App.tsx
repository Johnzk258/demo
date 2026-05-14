
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

export const products: Product[] = [
  { id: '1', name: 'Apple iPhone 15 Pro Max', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/IPhone_15_Pro_Max_Natural_Titanium.png/440px-IPhone_15
