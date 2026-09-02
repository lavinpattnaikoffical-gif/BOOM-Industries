import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  X, 
  ExternalLink,
  Save,
  Tag,
  IndianRupee,
  Star,
  FileCode,
  Download,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  Globe,
  Send,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { formatGoogleDriveUrl, isGoogleDriveUrl } from '@/utils/imageHelper';
import { publishProductsToGitHub, getStoredGitHubToken } from '@/utils/githubSync';
import { getCategoryMeta, KNOWN_CATEGORY_METADATA } from '@/utils/categoryHelper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SparkCursor from '@/components/SparkCursor';
import EmberParticles from '@/components/EmberParticles';

// SHA-256 hash of 'boom5373' for secure client-side verification
const AUTH_HASH = 'd13237a62a91e79c06da4b3a88320afa34847cf94d7a3fc656268377fda15f2d';
const AUTH_SESSION_KEY = 'boom_edit_auth_v1';

const CATEGORY_PRESETS = [
  'Rockets',
  'Sparklers',
  'Fountains',
  'Crackers',
  'Aerial Shells',
  'Chakkar',
  'Combo Packs',
  'Gift Boxes',
];

const PRESET_SAMPLE_IMAGES = [
  { label: 'Rocket', url: 'https://images.unsplash.com/photo-1533230408703-a2321476c827?auto=format&fit=crop&q=80' },
  { label: 'Sparklers', url: 'https://images.unsplash.com/photo-1467810563316-b54765359382?auto=format&fit=crop&q=80' },
  { label: 'Fountain', url: 'https://images.unsplash.com/photo-1533230119143-d10ee7b00951?auto=format&fit=crop&q=80' },
  { label: 'Aerial Burst', url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80' },
  { label: 'Golden Night', url: 'https://images.unsplash.com/photo-1518617330791-e5e2b7f1ee3b?auto=format&fit=crop&q=80' },
  { label: 'Crackers', url: 'https://images.unsplash.com/photo-1576018455938-e1e11e1a72f0?auto=format&fit=crop&q=80' },
];

// Helper to compute SHA-256 in browser
async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function EditPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults, exportProductsAsCode } = useProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [renamedCategoryName, setRenamedCategoryName] = useState('');

  // Modal / Form state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Rockets');
  const [customCategory, setCustomCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formRating, setFormRating] = useState('4.8');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');

  // Code Export Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // GitHub Publish Modal (Global deployment)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [githubToken, setGithubToken] = useState(() => getStoredGitHubToken());
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle password submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const hashed = await computeSha256(passwordInput.trim());
      if (hashed === AUTH_HASH) {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        setPasswordInput('');
        toast({
          title: 'Access Granted 🔓',
          description: 'Welcome to the Product Manager.',
        });
      } else {
        setAuthError(true);
        toast({
          title: 'Access Denied',
          description: 'Incorrect admin password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Auth error', err);
      // Fallback verification
      if (passwordInput.trim() === 'boom5373') {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } else {
        setAuthError(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    toast({
      title: 'Session Locked',
      description: 'You have logged out of the product manager.',
    });
  };

  // Open modal to add product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Rockets');
    setCustomCategory('');
    setFormPrice('₹');
    setFormRating('4.8');
    setFormDescription('');
    setFormImage(PRESET_SAMPLE_IMAGES[0].url);
    setIsModalOpen(true);
  };

  // Open modal to edit existing product
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    if (CATEGORY_PRESETS.includes(product.category)) {
      setFormCategory(product.category);
      setCustomCategory('');
    } else {
      setFormCategory('Custom');
      setCustomCategory(product.category);
    }
    setFormPrice(product.price);
    setFormRating(product.rating || '4.5');
    setFormDescription(product.description || '');
    setFormImage(product.image);
    setIsModalOpen(true);
  };

  // Handle local image file upload (converts to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      toast({
        title: 'Image size warning',
        description: 'Please upload an image smaller than 2.5MB for fast loading.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setFormImage(result);
        toast({
          title: 'Image loaded',
          description: 'Image has been converted and previewed successfully.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Add / Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast({ title: 'Validation Error', description: 'Product Name is required', variant: 'destructive' });
      return;
    }

    const finalCategory = formCategory === 'Custom' ? (customCategory.trim() || 'General') : formCategory;
    const finalPrice = formPrice.trim().startsWith('₹') ? formPrice.trim() : `₹${formPrice.trim()}`;
    const finalImage = formatGoogleDriveUrl(formImage.trim()) || PRESET_SAMPLE_IMAGES[0].url;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim(),
        category: finalCategory,
        price: finalPrice,
        rating: formRating.trim() || '4.5',
        description: formDescription.trim(),
        image: finalImage,
      });
      toast({ title: 'Product Updated!', description: `${formName} has been updated successfully.` });
    } else {
      addProduct({
        name: formName.trim(),
        category: finalCategory,
        price: finalPrice,
        rating: formRating.trim() || '4.8',
        description: formDescription.trim(),
        image: finalImage,
      });
      toast({ title: 'Product Added!', description: `${formName} added to catalog.` });
    }

    setIsModalOpen(false);
  };

  // Category Management Handlers
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (categoriesList.some((c) => c.toLowerCase() === name.toLowerCase())) {
      toast({
        title: 'Category Exists',
        description: `"${name}" category already exists.`,
        variant: 'destructive',
      });
      return;
    }
    // Pre-select new custom category and open add product modal
    setFormName('');
    setFormPrice('');
    setFormRating('4.8');
    setFormDescription('');
    setFormImage('');
    setEditingProduct(null);
    setFormCategory('Custom');
    setCustomCategory(name);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
    setIsModalOpen(true);
    toast({
      title: 'Category Created!',
      description: `Category "${name}" created. Add your first product under this category.`,
    });
  };

  const handleRenameCategory = (oldCategory: string, newCategory: string) => {
    const trimmedNew = newCategory.trim();
    if (!trimmedNew || oldCategory.toLowerCase() === trimmedNew.toLowerCase()) {
      setEditingCategory(null);
      return;
    }
    let updatedCount = 0;
    products.forEach((p) => {
      if (p.category.toLowerCase() === oldCategory.toLowerCase()) {
        updateProduct(p.id, { category: trimmedNew });
        updatedCount++;
      }
    });
    setEditingCategory(null);
    setRenamedCategoryName('');
    toast({
      title: 'Category Renamed!',
      description: `Updated ${updatedCount} products from "${oldCategory}" to "${trimmedNew}".`,
    });
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const affectedProducts = products.filter(
      (p) => p.category.toLowerCase() === categoryToDelete.toLowerCase()
    );
    if (affectedProducts.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete category "${categoryToDelete}"? This will move its ${affectedProducts.length} products to "General".`
      )
    ) {
      affectedProducts.forEach((p) => {
        updateProduct(p.id, { category: 'General' });
      });
      toast({
        title: 'Category Removed',
        description: `Moved ${affectedProducts.length} items from "${categoryToDelete}" to "General".`,
      });
    }
  };

  // Delete product with confirmation
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the product list?`)) {
      deleteProduct(id);
      toast({
        title: 'Product Deleted',
        description: `"${name}" was removed.`,
        variant: 'destructive',
      });
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    const code = exportProductsAsCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast({
      title: 'Code Copied!',
      description: 'Copied TypeScript code to clipboard. You can paste it into src/data/products.ts!',
    });
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Download Code File
  const handleDownloadFile = () => {
    const code = exportProductsAsCode();
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'File Downloaded', description: 'products.ts saved to your downloads.' });
  };

  // Publish to GitHub & trigger global Vercel live deployment
  const handlePublishToGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubToken.trim()) {
      toast({
        title: 'Token Required',
        description: 'Please provide your GitHub Personal Access Token.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    const result = await publishProductsToGitHub(products, githubToken.trim());
    setIsPublishing(false);

    if (result.success) {
      toast({
        title: '🚀 Published Globally to Website!',
        description: result.message,
        duration: 8000,
      });
      setIsPublishModalOpen(false);
    } else {
      toast({
        title: 'Publish Failed',
        description: result.message,
        variant: 'destructive',
        duration: 7000,
      });
    }
  };

  // Filter products list
  const categoriesList = ['All', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // ================= PASSWORD LOCK SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-night-deep">
        <SparkCursor />
        <EmberParticles />
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-4 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: authError ? [-8, 8, -6, 6, -3, 3, 0] : 0
            }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl border border-primary/25 shadow-2xl relative overflow-hidden"
          >
            {/* Background glow orb */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 blur-[80px] -mr-20 -mt-20 pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary shadow-lg shadow-primary/10">
                <KeyRound className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Protected Area
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-3 mb-1">
                Admin Authentication
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Enter your security password to access the Product Manager.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Manager Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(false);
                    }}
                    autoFocus
                    className={`boom-input w-full pr-11 text-sm ${
                      authError ? 'border-red-500 bg-red-500/10 focus:border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    ✕ Incorrect password. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full btn-boom-primary py-3.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                {isVerifying ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Product Manager</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  // ================= MAIN EDIT PAGE (AUTHENTICATED) =================
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-night-deep">
      <SparkCursor />
      <EmberParticles />
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-white/5 border border-white/10"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
                </button>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Authorized
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Edit & Manage <span className="glow-text-multi">Products</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Add new fireworks, adjust prices, upload Google Drive images, or delete items in real-time.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-night-deep flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                title="Publish changes globally to GitHub & Vercel"
              >
                <Globe className="w-4 h-4" />
                Publish Live Globally 🚀
              </button>

              <button
                onClick={handleOpenAdd}
                className="btn-boom-primary px-4 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary flex items-center justify-center gap-1.5 transition-all"
                title="Manage product categories"
              >
                <Tag className="w-3.5 h-3.5" />
                Manage Categories
              </button>

              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-foreground flex items-center justify-center gap-1.5 transition-all"
                title="Export updated products as code"
              >
                <FileCode className="w-3.5 h-3.5 text-primary" />
                Export
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset catalog back to original default fireworks? Any custom additions will be cleared.')) {
                    resetToDefaults();
                    toast({ title: 'Reset Successful', description: 'Restored original default product catalog.' });
                  }
                }}
                className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-display font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center gap-1.5 transition-all"
                title="Restore default catalog"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                onClick={handleLogout}
                className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 border border-white/10 flex items-center justify-center gap-1.5 text-xs transition-all"
                title="Lock session & Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="sm:hidden">Lock & Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/5 flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{products.length}</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground">Total Products</div>
              </div>
            </div>

            <div 
              onClick={() => setIsCategoryModalOpen(true)}
              className="glass-card p-3 sm:p-4 rounded-2xl border border-white/5 hover:border-amber-500/40 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{categoriesList.length - 1}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground group-hover:text-amber-400 transition-colors">Categories (Edit)</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/5 flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold font-display text-foreground">Live Synced</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Browser Storage</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/products')}
              className="glass-card p-3 sm:p-4 rounded-2xl border border-primary/20 hover:border-primary/50 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div>
                <div className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider">Storefront</div>
                <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  View Catalog <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Category Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="boom-input pl-10 w-full text-xs sm:text-sm py-2.5"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills + Manage Button */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categoriesList.map((cat) => {
                const count = cat === 'All' ? products.length : products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-primary text-night-deep font-bold shadow-md shadow-primary/30'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5'
                    }`}
                  >
                    <span>{cat === 'All' ? '✨' : getCategoryMeta(cat).icon}</span>
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat ? 'bg-black/30 text-white' : 'bg-white/10 text-muted-foreground'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-display font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap flex items-center gap-1"
                title="Add or Rename Categories"
              >
                <Plus className="w-3.5 h-3.5" /> New Category
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/5 my-8">
              <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-display font-bold text-foreground">No products found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                {searchTerm ? `No results matching "${searchTerm}".` : 'No products in this category.'}
              </p>
              <button onClick={handleOpenAdd} className="btn-boom-primary px-4 py-2 text-sm inline-flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Product Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-44 bg-night-surface overflow-hidden">
                    <img
                      src={formatGoogleDriveUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_SAMPLE_IMAGES[0].url;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent opacity-70" />

                    {/* Category badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-primary border border-primary/30">
                      {product.category}
                    </span>

                    {/* Rating badge */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-400/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {product.rating || '4.5'}
                    </span>

                    {/* Price banner overlay */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="font-display font-extrabold text-xl text-primary drop-shadow-md">
                        {product.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description || 'Quality handcrafted firework for memorable celebrations.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 mt-3 border-t border-white/5">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-display font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="py-2 px-3 rounded-xl text-xs font-display font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-xl w-full max-h-[92vh] overflow-y-auto bg-night-deep border border-primary/25 rounded-3xl shadow-2xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    {editingProduct ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {editingProduct ? 'Update product details and price' : 'Fill in the information to add a firework'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Golden Sparklers"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="boom-input w-full text-sm"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category *
                    </label>
                    <span className="text-[11px] text-primary font-medium">
                      Selected: <strong>{formCategory === 'Custom' ? (customCategory || 'Custom Category') : formCategory}</strong>
                    </span>
                  </div>

                  {/* Category Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-32 overflow-y-auto p-1 bg-white/5 rounded-xl border border-white/10">
                    {Array.from(new Set([...CATEGORY_PRESETS, ...products.map((p) => p.category).filter(Boolean)])).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFormCategory(cat);
                          setCustomCategory('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-all flex items-center gap-1 ${
                          formCategory === cat
                            ? 'bg-primary text-night-deep font-bold shadow-md shadow-primary/30 ring-1 ring-primary'
                            : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                        }`}
                      >
                        <span>{getCategoryMeta(cat).icon}</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormCategory('Custom')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-all flex items-center gap-1 ${
                        formCategory === 'Custom'
                          ? 'bg-amber-400 text-night-deep font-bold ring-1 ring-amber-400'
                          : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                      }`}
                    >
                      <span>+</span> Custom Category
                    </button>
                  </div>

                  {formCategory === 'Custom' && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="text"
                        placeholder="Type new category name (e.g. Ground Spinners, Sky Bombs)..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="boom-input w-full text-xs sm:text-sm border-amber-500/50 focus:border-amber-400"
                        autoFocus
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Price *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="₹450"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="boom-input w-full text-sm"
                    />
                  </div>
                </div>

                {/* Rating & In-Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Star Rating
                    </label>
                    <input
                      type="text"
                      placeholder="4.8"
                      value={formRating}
                      onChange={(e) => setFormRating(e.target.value)}
                      className="boom-input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Per Unit Label
                    </label>
                    <input
                      type="text"
                      placeholder="per pack"
                      disabled
                      value="per pack / box"
                      className="boom-input w-full text-sm opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of visual effect, colors, or safety instructions..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="boom-input w-full text-sm resize-none"
                  />
                </div>

                {/* Image Section */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
                      Product Image (Google Drive / Web URL / File)
                    </label>
                    {isGoogleDriveUrl(formImage) && (
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 font-medium">
                        ✓ Google Drive Linked
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Paste Google Drive link or Image URL (https://...)"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="boom-input flex-1 text-xs"
                    />

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 flex items-center gap-1.5 transition-all whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                  </div>

                  {isGoogleDriveUrl(formImage) && (
                    <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 leading-relaxed">
                      💡 <strong>Tip for Google Drive:</strong> In Google Drive, ensure the file's sharing setting is set to <em>"Anyone with the link can view"</em>.
                    </p>
                  )}

                  {/* Sample Presets */}
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-1.5">Or choose a firework preset:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SAMPLE_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormImage(preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            formImage === preset.url
                              ? 'bg-primary text-night-deep font-bold'
                              : 'bg-white/5 text-muted-foreground hover:text-foreground border border-white/5'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Live Preview */}
                  {formImage && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-night-surface border border-white/10">
                      <img
                        src={formatGoogleDriveUrl(formImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_SAMPLE_IMAGES[0].url;
                        }}
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] bg-black/70 text-white backdrop-blur">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-boom-primary py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Save Changes' : 'Add to Store'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= EXPORT CODE MODAL ================= */}
      <AnimatePresence>
        {isCodeModalOpen && (
          <div className="modal-overlay z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-night-deep border border-primary/30 rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Export `products.ts` Code</h2>
                    <p className="text-xs text-muted-foreground">
                      Deploy your edits permanently to Vercel/Git by updating <code className="text-primary">src/data/products.ts</code>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCodeModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative mb-4">
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 select-all">
                  {exportProductsAsCode()}
                </pre>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyCode}
                  className="btn-boom-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-night-deep" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? 'Copied to Clipboard!' : 'Copy Code to Clipboard'}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-4 py-3 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-foreground flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" /> Download File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= PUBLISH GLOBALLY MODAL ================= */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="modal-overlay z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-xl w-full max-h-[90vh] overflow-y-auto bg-night-deep border border-primary/30 rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Publish Live to Website</h2>
                    <p className="text-xs text-muted-foreground">
                      Deploy your catalog globally so all users across the world see it.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPublishModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePublishToGitHub} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-muted-foreground space-y-2">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>⚡ How Global 1-Click Publish Works:</span>
                  </div>
                  <p>
                    1. When you click <strong>Deploy Live</strong>, your catalog ({products.length} products) will be committed to your GitHub repo (<code>lavinpattnaikoffical-gif/BOOM-Industries</code>).
                  </p>
                  <p>
                    2. Vercel automatically detects the commit and updates the live website worldwide within ~15 seconds!
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      GitHub Personal Access Token
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=BOOM%20Industries%20Product%20Manager"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      Create Token in 1-Click <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="github_pat_... or ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="boom-input w-full text-xs sm:text-sm font-mono py-3"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Saved securely in your browser so you only enter it once. Requires <code className="text-primary">repo</code> or <code className="text-primary">contents:write</code> scope.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="flex-1 btn-boom-primary py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deploying to GitHub & Vercel...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Deploy {products.length} Products Live Globally 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MANAGE CATEGORIES MODAL ================= */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="modal-overlay z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-box max-w-xl w-full max-h-[90vh] overflow-y-auto bg-night-deep border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Manage Product Categories</h2>
                    <p className="text-xs text-muted-foreground">
                      Create, rename, or organize categories across your catalog.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Create New Category Form */}
              <form onSubmit={handleCreateCategory} className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300">
                  + Add New Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new category name (e.g. Laser Fountains)..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="boom-input flex-1 text-xs sm:text-sm py-2.5"
                  />
                  <button
                    type="submit"
                    disabled={!newCategoryName.trim()}
                    className="btn-boom-primary px-4 py-2.5 text-xs font-bold whitespace-nowrap disabled:opacity-50"
                  >
                    Add & Create
                  </button>
                </div>
              </form>

              {/* Existing Categories List */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Current Active Categories ({categoriesList.filter(c => c !== 'All').length})</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Products Count</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {categoriesList
                    .filter((c) => c !== 'All')
                    .map((cat) => {
                      const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                      const isEditing = editingCategory === cat;
                      const meta = getCategoryMeta(cat);

                      return (
                        <div
                          key={cat}
                          className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={renamedCategoryName}
                                onChange={(e) => setRenamedCategoryName(e.target.value)}
                                className="boom-input flex-1 text-xs py-1.5"
                                autoFocus
                              />
                              <button
                                onClick={() => handleRenameCategory(cat, renamedCategoryName)}
                                className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="px-2 py-1.5 rounded-lg bg-white/5 text-muted-foreground text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{meta.icon}</span>
                                <div>
                                  <div className="font-display font-bold text-sm text-foreground">{cat}</div>
                                  <div className="text-[10px] text-muted-foreground">{meta.subtitle}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-primary border border-white/10">
                                  {count} {count === 1 ? 'item' : 'items'}
                                </span>

                                <button
                                  onClick={() => {
                                    setEditingCategory(cat);
                                    setRenamedCategoryName(cat);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors text-xs"
                                  title="Rename category across all products"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-xs"
                                  title="Delete category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-foreground text-xs font-semibold"
                >
                  Close Manager
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

