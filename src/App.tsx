import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  Package, 
  User, 
  PlusCircle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Settings,
  ShieldCheck,
  TrendingUp,
  Box,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// --- Types ---
type View = 'market' | 'cart' | 'tracking' | 'seller' | 'profile' | 'details' | 'checkout';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered';
  date: string;
  trackingId: string;
}

// --- Data ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'JayTech Pro Phone 15',
    price: 999,
    category: 'Phones',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/product-smartphone-14d392a2-1777742310109.webp',
    description: 'The ultimate smartphone with AI-driven photography and lightning-fast processor.',
    seller: 'Global Wholesale Tech',
    rating: 4.8
  },
  {
    id: '2',
    name: 'SmartHome Hub v2',
    price: 249,
    category: 'Home',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/product-smarthome-9dc02b4a-1777742308996.webp',
    description: 'Control your entire home with voice commands and automated routines.',
    seller: 'Smart Life Investors',
    rating: 4.5
  },
  {
    id: '3',
    name: 'JayBook Ultra M3',
    price: 1499,
    category: 'Laptops',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/product-laptop-b51721b5-1777742309118.webp',
    description: 'A powerful laptop for professionals who need performance on the go.',
    seller: 'Tech Elite Wholesale',
    rating: 4.9
  },
  {
    id: '4',
    name: 'SonicWave Headphones',
    price: 199,
    category: 'Audio',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/product-headphones-4eb8eba6-1777742309098.webp',
    description: 'Pure sound, zero noise. Perfect for music lovers and frequent travelers.',
    seller: 'SoundMasters Group',
    rating: 4.7
  },
  {
    id: '5',
    name: 'JayWatch Series X',
    price: 349,
    category: 'Wearables',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/product-smartwatch-5472d795-1777742309302.webp',
    description: 'Stay connected and track your health with the most advanced wearable tech.',
    seller: 'HealthTech Wholesalers',
    rating: 4.6
  }
];

// --- Components ---

const Navbar = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between px-4">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onViewChange('market')}
      >
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4fa23df0-239a-4de4-b41a-0356d8efd136/app-logo-daa2a9ff-1777742309341.webp" 
          alt="JAYTECH" 
          className="h-8 w-8 rounded-md"
        />
        <span className="font-bold text-lg tracking-tight">JAYTECH <span className="text-primary">SMART</span></span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => toast.info("Search feature coming soon!")}>
        <Search className="h-5 w-5" />
      </Button>
    </div>
  </header>
);

const BottomNav = ({ currentView, onViewChange, cartCount }: { currentView: View, onViewChange: (view: View) => void, cartCount: number }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md flex justify-around items-center h-16 px-2">
    {[
      { icon: Home, label: 'Market', view: 'market' as View },
      { icon: ShoppingCart, label: 'Cart', view: 'cart' as View, badge: cartCount },
      { icon: Package, label: 'Tracking', view: 'tracking' as View },
      { icon: PlusCircle, label: 'Sell', view: 'seller' as View },
      { icon: User, label: 'Profile', view: 'profile' as View },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => onViewChange(item.view)}
        className={`flex flex-col items-center justify-center w-full transition-colors ${
          currentView === item.view ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <div className="relative">
          <item.icon className="h-6 w-6" />
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in fade-in zoom-in">
              {item.badge}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
      </button>
    ))}
  </nav>
);

export default function App() {
  const [view, setView] = useState<View>('market');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.error("Item removed from cart");
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...cart],
      total: cartTotal,
      status: 'ordered',
      date: new Date().toLocaleDateString(),
      trackingId: `JT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('tracking');
    toast.success("Order placed successfully!");
  };

  const handleAddNewProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop', // Placeholder for user upload
      description: formData.get('description') as string,
      seller: 'Current User',
      rating: 5.0
    };
    setProducts([newProduct, ...products]);
    setView('market');
    toast.success("Product listed for wholesalers!");
  };

  // --- Views ---

  const MarketView = () => (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Hero */}
      <section className="relative h-48 rounded-xl overflow-hidden mx-4 mt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 text-white">
          <Badge className="w-fit mb-2 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">Exclusive Deals</Badge>
          <h2 className="text-2xl font-bold leading-tight">Next-Gen Tech<br />for Smart Life</h2>
          <p className="text-sm opacity-90 mt-1">Direct from Wholesalers</p>
        </div>
      </section>

      {/* Categories */}
      <div className="px-4">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Categories
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Phones', 'Laptops', 'Home', 'Audio', 'Wearables'].map(cat => (
            <Badge 
              key={cat} 
              variant="secondary" 
              className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {products.map(product => (
          <motion.div 
            key={product.id}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
          >
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div 
                className="aspect-square relative cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  setView('details');
                }}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
              <CardContent className="p-3 flex-grow">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{product.category}</p>
                <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                <p className="font-bold text-primary mt-1">${product.price}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedProduct) return null;
    return (
      <div className="pb-24 animate-in slide-in-from-right duration-300">
        <div className="relative h-80">
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-4 left-4 z-10 rounded-full bg-background/50 backdrop-blur"
            onClick={() => setView('market')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2">{selectedProduct.category}</Badge>
              <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">${selectedProduct.price}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>{selectedProduct.rating} Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <span>1 Year Warranty</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          <Card className="bg-secondary/50 border-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wholesaler</p>
                  <p className="font-medium text-sm">{selectedProduct.seller}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Contact</Button>
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-background/80 backdrop-blur">
          <Button 
            className="w-full h-12 text-lg font-bold" 
            onClick={() => addToCart(selectedProduct)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="px-4 py-6 pb-24 space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">Your cart is empty. Ready to shop?</p>
          <Button onClick={() => setView('market')}>Explore Market</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex gap-4 p-3">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-primary font-bold text-sm">${item.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 border rounded-md px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-muted-foreground">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-muted-foreground">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-destructive text-xs font-medium">Remove</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="opacity-80">Total Amount</span>
                <span className="text-2xl font-bold">${cartTotal}</span>
              </div>
              <Button 
                variant="secondary" 
                className="w-full h-12 font-bold"
                onClick={() => setView('checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const TrackingView = () => (
    <div className="px-4 py-6 pb-24 space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold">Track Deliveries</h2>
      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
              <Truck className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">No active orders to track.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-primary">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold">{order.id}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{order.date} • Tracking: {order.trackingId}</p>
              </CardHeader>
              <CardContent className="p-4 pt-4">
                <div className="relative space-y-8 before:absolute before:inset-0 before:left-2 before:h-full before:w-[2px] before:bg-muted">
                  {[
                    { status: 'ordered', label: 'Order Placed', time: '10:30 AM', icon: Clock, completed: true },
                    { status: 'processing', label: 'Processing at Warehouse', time: '02:15 PM', icon: Box, completed: true },
                    { status: 'shipped', label: 'Handed to Delivery Partner', time: 'Pending', icon: Truck, completed: false },
                    { status: 'delivered', label: 'Delivered', time: 'Pending', icon: CheckCircle2, completed: false },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-6">
                      <div className={`absolute left-0 h-4 w-4 rounded-full border-2 border-background z-10 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                      <div className="ml-2">
                        <div className="flex items-center gap-2">
                          <step.icon className={`h-4 w-4 ${step.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                          <p className={`text-sm font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const SellerView = () => (
    <div className="px-4 py-6 pb-24 space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <h2 className="text-2xl font-bold">Seller Portal</h2>
        <p className="text-muted-foreground text-sm mt-1">Investors & Wholesalers Marketplace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>List New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddNewProduct} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</label>
              <Input name="name" placeholder="e.g. Galaxy X Pro" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ($)</label>
                <Input name="price" type="number" placeholder="999" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <Input name="category" placeholder="Phones" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
              <Input name="description" placeholder="Brief details about the item..." required />
            </div>
            <Button type="submit" className="w-full">Post to Market</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-none">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <h4 className="text-xl font-bold">128</h4>
            <p className="text-[10px] text-muted-foreground">Market Reach</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 dark:bg-green-950/20 border-none">
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <h4 className="text-xl font-bold">12</h4>
            <p className="text-[10px] text-muted-foreground">Active Listings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="px-4 py-6 pb-24 space-y-6 animate-in fade-in">
      <div className="flex flex-col items-center py-6 space-y-4">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
          <User className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">JayTech Partner</h2>
          <p className="text-sm text-muted-foreground">Premium Investor Account</p>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: Settings, label: 'Account Settings' },
          { icon: ShieldCheck, label: 'Security & Privacy' },
          { icon: Package, label: 'Order History' },
          { icon: Truck, label: 'Shipping Addresses' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">Log Out</Button>
    </div>
  );

  const CheckoutView = () => (
    <div className="px-4 py-6 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setView('cart')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase">Full Name</label>
            <Input placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase">Shipping Address</label>
            <Input placeholder="123 Tech Avenue, Smart City" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase">Payment Method</label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-primary bg-primary/5">Credit Card</Button>
              <Button variant="outline" className="flex-1">Crypto Pay</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-background/80 backdrop-blur">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total to Pay</span>
          <span className="text-2xl font-bold text-primary">${cartTotal}</span>
        </div>
        <Button 
          className="w-full h-12 text-lg font-bold" 
          onClick={handleCheckout}
        >
          Complete Purchase
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-foreground">
      <Toaster position="top-center" />
      <Navbar onViewChange={setView} />
      
      <main className="max-w-md mx-auto min-h-[calc(100vh-8rem)]">
        {view === 'market' && <MarketView />}
        {view === 'details' && <DetailsView />}
        {view === 'cart' && <CartView />}
        {view === 'tracking' && <TrackingView />}
        {view === 'seller' && <SellerView />}
        {view === 'profile' && <ProfileView />}
        {view === 'checkout' && <CheckoutView />}
      </main>

      <BottomNav 
        currentView={view} 
        onViewChange={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
      />
    </div>
  );
}