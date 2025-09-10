import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { ShoppingCart, Heart, Search, ArrowLeft, Plus, Minus, Package, Truck, CheckCircle, User, Home } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  featured?: boolean;
  new?: boolean;
  outOfStock?: boolean;
}

type Category = { id: string; name: string };

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

type AppContextType = {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  cart: (Product & { quantity: number })[];
  setCart: React.Dispatch<React.SetStateAction<(Product & { quantity: number })[]>>;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  favorites: Set<number>;
  setFavorites: React.Dispatch<React.SetStateAction<Set<number>>>;
  trackingOrder: any | null;
  setTrackingOrder: React.Dispatch<React.SetStateAction<any | null>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  products: Product[];
  categories: Category[];
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Moroccan Black Soap',
    category: 'cosmetics',
    price: 5.0,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    description:
      'The Moroccan black soap is made from natural rich ingredients that help to radiate the skin, soften pores and make the skin glow',
    featured: true,
    new: true
  },
  {
    id: 2,
    name: 'Rose Water',
    category: 'cosmetics',
    price: 10.0,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop',
    description: 'Pure rose water for natural skin hydration and refreshing',
    featured: true,
    new: true
  },
  {
    id: 3,
    name: 'Lime Water Plant',
    category: 'food',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    description: 'Fresh lime water plant for natural refreshment',
    featured: false,
    new: false
  },
  {
    id: 9,
    name: 'Jamaican Black Castor Oil 118ml',
    category: 'cosmetics',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
    description: 'Original pure Jamaican black castor oil for hair and skin',
    featured: true,
    new: true
  },
  {
    id: 10,
    name: 'Caro Wite Lightening Cream',
    category: 'cosmetics',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1580861282670-7d4d9b1c1b7f?w=300&h=300&fit=crop',
    description: 'Caro Wite Lightening Cream — 30ml',
    featured: false,
    new: true
  },
  {
    id: 11,
    name: 'Caro Lightening Cream',
    category: 'cosmetics',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1588621933523-7f2f4f1a8b0a?w=300&h=300&fit=crop',
    description: 'Caro Lightening Cream — 450ml',
    featured: false,
    new: true
  },
  {
    id: 12,
    name: 'Caro Light Soap',
    category: 'cosmetics',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b36?w=300&h=300&fit=crop',
    description: 'Caro Light Soap — 200g',
    featured: false,
    new: true
  },
  {
    id: 13,
    name: 'Mango Classic Shower',
    category: 'cosmetics',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1503342452485-86f7b6a9f1b2?w=300&h=300&fit=crop',
    description: 'Mango Classic Shower (Body Wash) — 550ml',
    featured: false,
    new: true
  },
  {
    id: 14,
    name: 'Kids Original Shea Butter',
    category: 'cosmetics',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1585238342028-7a6d6b1b0f6b?w=300&h=300&fit=crop',
    description: 'Kids Original Shea Butter — 355ml',
    featured: false,
    new: true
  },
  {
    id: 15,
    name: "Johnson's Baby Shampoo",
    category: 'cosmetics',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1587500151456-7b6b9d0f6f8a?w=300&h=300&fit=crop',
    description: "Johnson's Baby Shampoo — 330ml",
    featured: false,
    new: true
  },
  {
    id: 16,
    name: "Johnson's Baby Powder",
    category: 'cosmetics',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1571687949921-5f8e6d8b4c2b?w=300&h=300&fit=crop',
    description: "Johnson's Baby Powder — 400g",
    featured: false,
    new: true
  },
  {
    id: 17,
    name: 'Cantu Natural Hair',
    category: 'cosmetics',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1592878807129-79f0f6e4f5f1?w=300&h=300&fit=crop',
    description: 'Cantu natural hair care product',
    featured: false,
    new: true
  },
  {
    id: 18,
    name: 'Jamaican Black Castor Oil',
    category: 'cosmetics',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
    description: 'Pure Jamaican black castor oil',
    featured: false,
    new: true
  },
  {
    id: 19,
    name: 'Eco Styling Gel',
    category: 'cosmetics',
    price: 4.29,
    image: 'https://images.unsplash.com/photo-1589987603740-1c2f0f5d7f3b?w=300&h=300&fit=crop',
    description: 'Eco styling gel for hair',
    featured: false,
    new: true
  },
  {
    id: 20,
    name: 'Rubber Bands',
    category: 'cosmetics',
    price: 1.29,
    image: 'https://images.unsplash.com/photo-1524487943050-0d07d3b7f6a6?w=300&h=300&fit=crop',
    description: 'Pack of hair rubber bands',
    featured: false,
    new: true
  },
  {
    id: 21,
    name: 'Hair Bands',
    category: 'cosmetics',
    price: 0.9,
    image: 'https://images.unsplash.com/photo-1520975912596-8b3b8e2b8b6a?w=300&h=300&fit=crop',
    description: 'Elastic hair bands',
    featured: false,
    new: true
  },
  {
    id: 22,
    name: 'Relaxer Kit (Normal)',
    category: 'cosmetics',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1582719478175-1813bba83b7c?w=300&h=300&fit=crop',
    description: 'Relaxer kit for normal hair',
    featured: false,
    new: true
  },
  {
    id: 23,
    name: 'Dark and Lovely Relaxer',
    category: 'cosmetics',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1596464716122-5b0b22a7e2c4?w=300&h=300&fit=crop',
    description: 'Dark and Lovely relaxer',
    featured: false,
    new: true
  },
  {
    id: 24,
    name: 'Just For Me Relaxer',
    category: 'cosmetics',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1582719478175-1813bba83b7c?w=300&h=300&fit=crop',
    description: 'Just For Me relaxer',
    featured: false,
    new: true
  },
  {
    id: 25,
    name: 'Noble Kinky Bulk',
    category: 'cosmetics',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    description: 'Noble kinky bulk hair',
    featured: false,
    new: true
  },
  {
    id: 26,
    name: 'Xpression Ultra Braid (2T1B/VIO)',
    category: 'cosmetics',
    price: 4.19,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    description: 'Xpression ultra braid in colour 2T1B/VIO',
    featured: false,
    new: true
  },
  {
    id: 27,
    name: 'Fair & White Aloe Vera',
    category: 'cosmetics',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1588371312124-8b1f0cff5a0f?w=300&h=300&fit=crop',
    description: 'Fair & White aloe vera product',
    featured: false,
    new: true
  }
];

const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'new', name: 'New Listed' },
  { id: 'cosmetics', name: 'Cosmetics' },
  { id: 'food', name: 'Food' },
  { id: 'household', name: 'Household' },
  { id: 'top', name: 'Top Items' },
  { id: 'favorites', name: 'Favourites' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>(() => {
    try {
      const raw = localStorage.getItem('tokio_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem('tokio_favorites');
      return raw ? new Set(JSON.parse(raw)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('tokio_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tokio_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('tokio_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tokio_favorites', JSON.stringify(Array.from(favorites)));
    } catch {}
  }, [favorites]);

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    selectedProduct,
    setSelectedProduct,
    cart,
    setCart,
    orders,
    setOrders,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    favorites,
    setFavorites,
    trackingOrder,
    setTrackingOrder,
    currentUser,
    setCurrentUser,
    products: mockProducts,
    categories
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const useCart = () => {
  const { cart, setCart } = useAppContext();

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev => prev.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(item => item.id !== productId));

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const clearCart = () => setCart([]);

  return { cart, addToCart, updateCartQuantity, removeFromCart, getCartTotal, getCartItemCount, clearCart };
};

const useFavorites = () => {
  const { favorites, setFavorites } = useAppContext();

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const isFavorite = (productId: number) => favorites.has(productId);

  return { favorites, toggleFavorite, isFavorite };
};

const useProducts = () => {
  const { products, selectedCategory, searchQuery, favorites } = useAppContext();

  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategory === 'new') filtered = filtered.filter(p => p.new);
    else if (selectedCategory === 'top') filtered = filtered.filter(p => p.featured);
    else if (selectedCategory === 'favorites') filtered = filtered.filter(p => favorites.has(p.id));
    else if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);

    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return filtered;
  };

  return { products, filteredProducts: getFilteredProducts() };
};

const useOrders = () => {
  const { orders, setOrders } = useAppContext();
  const { clearCart } = useCart();

  const createOrder = (customerInfo: any, items: (Product & { quantity: number })[]) => {
    const itemsCopy = items.map(i => ({ ...i }));
    const total = itemsCopy.reduce((s, it) => s + it.price * it.quantity, 0);

    const newOrder = {
      id: `ORD${Date.now()}`,
      items: itemsCopy,
      customerInfo,
      total,
      status: 'packaging',
      date: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId: string) => orders.find(o => o.id === orderId);

  return { orders, createOrder, getOrderById };
};

const Header: React.FC<{ title: string; showBack?: boolean; showCart?: boolean }> = ({ title, showBack = false, showCart = true }) => {
  const { setCurrentPage } = useAppContext();
  const { getCartItemCount } = useCart();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {showBack && (
          <button onClick={() => setCurrentPage('home')} className="mr-3 p-1" aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        {showCart && (
          <button onClick={() => setCurrentPage('cart')} className="relative p-2" aria-label="Open cart">
            <ShoppingCart size={24} />
            {getCartItemCount() > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getCartItemCount()}</span>}
          </button>
        )}
      </div>
    </div>
  );
};

const SearchBar = () => {
  const { searchQuery, setSearchQuery, products, setSelectedProduct, setCurrentPage } = useAppContext();
  const [localQuery, setLocalQuery] = useState<string>(searchQuery);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [localQuery, setSearchQuery]);

  const normalize = (s: string) => s.trim().toLowerCase();

  const levenshtein = (a: string, b: string) => {
    const al = a.length;
    const bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;
    const dp: number[][] = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
    for (let i = 0; i <= al; i++) dp[i][0] = i;
    for (let j = 0; j <= bl; j++) dp[0][j] = j;
    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[al][bl];
  };

  const q = normalize(localQuery);

  const matched = q
    ? products
        .map(p => ({
          product: p,
          score: (() => {
            const name = normalize(p.name);
            const category = normalize(p.category);
            const desc = normalize(p.description || '');
            if (name.includes(q) || category.includes(q) || desc.includes(q)) return 0;
            const distName = levenshtein(name, q);
            const distDesc = levenshtein(desc, q);
            const distCat = levenshtein(category, q);
            return Math.min(distName, distDesc, distCat);
          })()
        }))
        .filter(x => x.score <= Math.max(1, Math.floor(q.length / 4)))
        .sort((a, b) => a.score - b.score)
        .map(x => x.product)
        .slice(0, 6)
    : [];

  useEffect(() => {
    setShowResults(Boolean(q && matched.length > 0));
  }, [q, matched.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (matched.length === 1) {
        setSelectedProduct(matched[0]);
        setCurrentPage('product');
        setShowResults(false);
      } else {
        setCurrentPage('productList');
      }
    }
  };

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    setShowResults(false);
  };

  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const t = text.toString();
    const index = t.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {t.slice(0, index)}
        <mark className="bg-yellow-100">{t.slice(index, index + term.length)}</mark>
        {t.slice(index + term.length)}
      </>
    );
  };

  return (
    <div className="p-4 bg-gray-50 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="What Are You Buying Today?"
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(Boolean(q && matched.length > 0))}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Search products"
        />
      </div>

      {showResults && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          {matched.map(product => (
            <button key={product.id} onClick={() => handleSelect(product)} className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center space-x-3">
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{highlight(product.name, localQuery)}</div>
                <div className="text-xs text-gray-500">€{product.price.toFixed(2)} • {highlight(product.category, localQuery)}</div>
                {product.description && <div className="text-xs text-gray-400 mt-1">{highlight(product.description, localQuery)}</div>}
              </div>
            </button>
          ))}

          <button onClick={() => { setCurrentPage('productList'); setShowResults(false); }} className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-center">
            View all results →
          </button>
        </div>
      )}
    </div>
  );
};

const CategoryFilter = () => {
  const { categories, selectedCategory, setSelectedCategory, setCurrentPage } = useAppContext();
  return (
    <div className="px-4 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentPage('productList'); }}
            className={`px-3 py-1 rounded-full border ${selectedCategory === cat.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            <span className="text-sm">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { setSelectedProduct, setCurrentPage } = useAppContext();
  const { toggleFavorite, isFavorite } = useFavorites();
  const handleProductSelect = () => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
        <button onClick={() => toggleFavorite(product.id)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm" aria-label="Toggle favorite">
          <Heart size={16} className={isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'} />
        </button>
        {product.outOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 capitalize">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">€{product.price.toFixed(2)}</span>
          <button onClick={handleProductSelect} disabled={product.outOfStock} className={`p-1 rounded ${product.outOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`} aria-label={`View ${product.name}`}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid: React.FC<{ products: Product[]; title: string }> = ({ products, title }) => {
  const { setCurrentPage } = useAppContext();
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={() => setCurrentPage('productList')} className="text-orange-500 text-sm font-medium">View All →</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

const BottomNavigation = () => {
  const { currentPage, setCurrentPage } = useAppContext();
  const { getCartItemCount } = useCart();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: getCartItemCount() },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-around">
        {navItems.map(item => {
          const Icon = item.icon as any;
          return (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex flex-col items-center relative ${currentPage === item.id ? 'text-orange-500' : 'text-gray-400'}`} aria-label={item.label}>
              <Icon size={24} />
              {item.badge && item.badge > 0 && <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { products, favorites } = useAppContext();

  const newProducts = products.filter(p => p.new);
  const topProducts = products.filter(p => p.featured);
  const favoriteProducts = products.filter(p => favorites.has(p.id));

  return (
    <div className="pb-20">
      <Header title="Tokio Express" showBack={false} />
      <SearchBar />
      <CategoryFilter />
      <ProductGrid products={newProducts.slice(0, 6)} title="New Listed" />
      <ProductGrid products={topProducts.slice(0, 6)} title="Top Items" />
      <ProductGrid products={favoriteProducts.slice(0, 6)} title="Favorites" />
      <BottomNavigation />
    </div>
  );
};

const ProductPage = () => {
  const { selectedProduct } = useAppContext();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setCurrentPage } = useAppContext();
  const [quantity, setQuantity] = useState<number>(1);

  if (!selectedProduct) return (
    <div className="flex items-center justify-center min-h-screen"><p>Product not found</p></div>
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setCurrentPage('checkout');
  };

  return (
    <div className="pb-20">
      <Header title={selectedProduct.name} showBack={true} />

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800">{selectedProduct.name}</h1>
              <button onClick={() => toggleFavorite(selectedProduct.id)} className="p-2" aria-label="Toggle favorite">
                <Heart size={24} className={isFavorite(selectedProduct.id) ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Minus size={16} /></button>
                <span className="text-lg font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Plus size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Total Price</span>
          <span className="text-xl font-semibold text-gray-800">€{(selectedProduct.price * quantity).toFixed(2)}</span>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleAddToCart} className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium">Add to Cart</button>
          <button onClick={handleBuyNow} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { setCurrentPage } = useAppContext();
  const { cart, updateCartQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pb-20">
        <Header title="Your Cart" showBack={true} />
        <div className="p-4">
          <div className="text-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button onClick={() => setCurrentPage('home')} className="bg-orange-500 text-white px-6 py-2 rounded-lg">Start Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="Your Cart" showBack={true} />

      <div className="p-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Minus size={14} /></button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Plus size={14} /></button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button onClick={() => updateCartQuantity(item.id, 0)} className="text-orange-500 text-sm">Remove</button>
              <span className="font-semibold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total: €{getCartTotal().toFixed(2)}</span>
            <button onClick={() => setCurrentPage('checkout')} className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoriesPage = () => {
  const { categories, setSelectedCategory, setCurrentPage } = useAppContext();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage('home');
  };

  return (
    <div className="pb-20">
      <Header title="Categories" showBack={true} />
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 aspect-square"
            >
              <span className="font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

const CheckoutPage = () => {
  const { getCartTotal, cart } = useCart();
  const { createOrder } = useOrders();
  const { setCurrentPage, setTrackingOrder } = useAppContext();
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert('Please fill in all fields');
      return;
    }
    const newOrder = createOrder(customerInfo, cart);
    setTrackingOrder(newOrder);
    setCurrentPage('orderTracking');
  };

  return (
    <div className="pb-20">
      <Header title="Checkout" showBack={true} />
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <h3 className="font-semibold mb-2">Shipping Information</h3>
          <input name="name" value={customerInfo.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded mb-2" />
          <input name="address" value={customerInfo.address} onChange={handleInputChange} placeholder="Address" className="w-full p-2 border rounded mb-2" />
          <input name="phone" value={customerInfo.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded" />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>€{getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button onClick={handlePlaceOrder} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">Place Order</button>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { orders } = useOrders();
  const { setCurrentPage, setTrackingOrder } = useAppContext();

  const viewOrderDetails = (order: any) => {
    setTrackingOrder(order);
    setCurrentPage('orderTracking');
  };

  return (
    <div className="pb-20">
      <Header title="My Orders" showBack={true} />
      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">You have no orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-medium capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{order.status}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{order.items.length} items</span>
                <span className="font-semibold">€{order.total.toFixed(2)}</span>
              </div>
              <button onClick={() => viewOrderDetails(order)} className="w-full mt-3 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium text-sm">Track Order</button>
            </div>
          ))
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

const ProfilePage = () => {
  const { setCurrentPage, currentUser, setCurrentUser } = useAppContext();
  const [form, setForm] = useState<User>({ id: '', name: '', email: '', phone: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm(currentUser);
      setIsEditing(true);
    } else {
      setForm({ id: '', name: '', email: '', phone: '', address: '' });
      setIsEditing(false);
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = () => {
    if (!form.name || !form.email) {
      alert('Please provide name and email');
      return;
    }
    const newUser: User = { ...form, id: `USER_${Date.now()}` };
    setCurrentUser(newUser);
    setIsEditing(true);
    setCurrentPage('home');
  };

  const handleUpdate = () => {
    if (!form.name || !form.email) {
      alert('Please provide name and email');
      return;
    }
    setCurrentUser(form);
    alert('Profile updated');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsEditing(false);
    setForm({ id: '', name: '', email: '', phone: '', address: '' });
    setCurrentPage('home');
  };

  return (
    <div className="pb-20">
      <Header title="Profile" showBack={true} />
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-4">{currentUser ? 'Account Details' : 'Create Account'}</h3>

          <div className="grid grid-cols-1 gap-3">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
          </div>

          <div className="mt-4 flex space-x-3">
            {currentUser ? (
              <>
                <button onClick={handleUpdate} className="flex-1 bg-orange-500 text-white py-2 rounded-lg">Save Changes</button>
                <button onClick={handleSignOut} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg">Sign Out</button>
              </>
            ) : (
              <button onClick={handleSignUp} className="w-full bg-orange-500 text-white py-2 rounded-lg">Sign Up</button>
            )}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

const ProductListPage = () => {
  const { selectedCategory, categories } = useAppContext();
  const { filteredProducts } = useProducts();

  const sectionTitle = categories.find(c => c.id === selectedCategory)?.name || 'All Products';

  return (
    <div className="pb-20">
      <Header title={sectionTitle} showBack={true} />
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => <ProductCard product={product} key={product.id} />)}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

const OrderTrackingPage = () => {
  const { trackingOrder } = useAppContext();

  if (!trackingOrder) return (
    <div>
      <Header title="Track Order" showBack={true} />
      <p className="p-4 text-center">No order selected for tracking.</p>
    </div>
  );

  const trackingSteps = [
    { status: 'packaging', label: 'Packaging', icon: Package },
    { status: 'shipping', label: 'Shipping', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.status === trackingOrder.status);

  return (
    <div>
      <Header title={`Order ${trackingOrder.id}`} showBack={true} />
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <p className="mb-2"><strong>Estimated Delivery:</strong> {new Date(trackingOrder.estimatedDelivery).toLocaleDateString()}</p>
          <div className="flex justify-between items-center">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon as any;
              const isActive = index <= currentStepIndex;
              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Icon size={24} />
                  </div>
                  <span className={`mt-2 text-sm ${isActive ? 'font-semibold' : ''}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold mb-2">Items</h3>
          {trackingOrder.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TokioExpressApp: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

const AppContent = () => {
  const { currentPage } = useAppContext();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'product':
        return <ProductPage />;
      case 'cart':
        return <CartPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <OrdersPage />;
      case 'profile':
        return <ProfilePage />;
      case 'orderTracking':
        return <OrderTrackingPage />;
      case 'productList':
        return <ProductListPage />;
      default:
        return <HomePage />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentPage()}</div>;
};

export default TokioExpressApp;
