import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  MoreVertical,
  ChevronRight,
  UserPlus,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Image as ImageIcon,
  Download,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  login, 
  logout, 
  getCurrentUser, 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  fetchAdmins,
  addAdmin,
  deleteAdmin
} from '@/api/admin';
import { AdminUser, Product, EventItem, Lead, InquiryStatus } from '@/types';

// ── Components ──

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-display font-medium text-sm">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-10 -mr-8 -mt-8 ${color}`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-body text-muted-foreground mb-1">{label}</p>
        <h3 className="text-3xl font-display font-bold text-foreground">{value}</h3>
        {trend && (
          <p className="text-xs font-body text-green-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color.replace('bg-', 'bg-')}/10 border border-white/5`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

// ── Main Admin Component ──

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'events' | 'inquiries' | 'admins'>('dashboard');
  const [user, setUser] = useState<AdminUser | null>(getCurrentUser());
  const [isAuth, setIsAuth] = useState(!!user);
  
  // Auth State
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [inquiries, setInquiries] = useState<Lead[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // UI States
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Handlers ──

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(loginForm.username, loginForm.password);
      setUser(res.user);
      setIsAuth(true);
      toast({ title: 'Welcome back!', description: `Logged in as ${res.user.name}` });
    } catch (err) {
      toast({ title: 'Error', description: 'Invalid username or password', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUser(null);
    navigate('/admin');
  };

  const loadData = async () => {
    if (!isAuth) return;
    try {
      const [p, e, i, a] = await Promise.all([
        fetchProducts(),
        fetchEvents(),
        fetchInquiries(),
        fetchAdmins()
      ]);
      setProducts(p);
      setEvents(e);
      setInquiries(i);
      setAdmins(a);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuth]);

  // ── Render Helpers ──

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-night-deep flex items-center justify-center p-6">
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ember rounded-full blur-[100px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="boom-logo-text text-4xl mb-4">
                <span className="boom-B">B</span><span className="boom-O1">O</span><span className="boom-O2">O</span><span className="boom-M">M</span>
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">Admin Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to manage Boom Industries</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">Username</label>
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  className="boom-input w-full" 
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">Password</label>
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="boom-input w-full" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-boom-primary py-4 text-base mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : 'Sign In to Dashboard'}
              </button>
            </form>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-base flex">
      {/* ── Mobile Sidebar Overlay ── */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-night-deep border-r border-white/5 flex flex-col p-6 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="boom-logo-text text-3xl">
            <span className="boom-B">B</span><span className="boom-O1">O</span><span className="boom-O2">O</span><span className="boom-M">M</span>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setMobileSidebarOpen(false)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }} />
          <SidebarItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }} />
          <SidebarItem icon={Calendar} label="Events" active={activeTab === 'events'} onClick={() => { setActiveTab('events'); setMobileSidebarOpen(false); }} />
          <SidebarItem icon={MessageSquare} label="Inquiries" active={activeTab === 'inquiries'} onClick={() => { setActiveTab('inquiries'); setMobileSidebarOpen(false); }} />
          {user?.role === 'superadmin' && (
            <SidebarItem icon={Users} label="Admins" active={activeTab === 'admins'} onClick={() => { setActiveTab('admins'); setMobileSidebarOpen(false); }} />
          )}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-sm font-display font-bold text-foreground">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-display font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-night-base w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-night-base/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 rounded-xl bg-white/5 text-foreground hover:bg-white/10"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-display font-bold text-foreground capitalize">
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="boom-input pl-10 py-2 w-64 text-sm"
                />
              </div>
              <button className="p-2 hidden md:block rounded-xl bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                <Clock className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardView products={products} events={events} inquiries={inquiries} />}
          {activeTab === 'products' && (
            <GenericManager 
              title="Product" 
              items={products} 
              onAdd={addProduct} 
              onUpdate={updateProduct} 
              onDelete={deleteProduct} 
              refresh={loadData}
              fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'category', label: 'Category', type: 'select', options: ['Factory', 'Bomb', 'Flower Pot', 'Chakkar', '9 cm'] },
                { name: 'price', label: 'Price', type: 'text' },
                { name: 'image', label: 'Image URL', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' }
              ]}
            />
          )}
          {activeTab === 'events' && (
            <GenericManager 
              title="Event" 
              items={events} 
              onAdd={addEvent} 
              onUpdate={updateEvent} 
              onDelete={deleteEvent} 
              refresh={loadData}
              fields={[
                { name: 'name', label: 'Event Name', type: 'text' },
                { name: 'date', label: 'Date', type: 'date' },
                { name: 'location', label: 'Location', type: 'text' },
                { name: 'status', label: 'Status', type: 'select', options: ['upcoming', 'completed', 'cancelled'] },
                { name: 'description', label: 'Description', type: 'textarea' }
              ]}
            />
          )}
          {activeTab === 'inquiries' && <InquiryManager inquiries={inquiries} refresh={loadData} />}
          {activeTab === 'admins' && (
            <GenericManager 
              title="Admin" 
              items={admins} 
              onAdd={addAdmin} 
              onDelete={deleteAdmin} 
              refresh={loadData}
              fields={[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'username', label: 'Username', type: 'text' },
                { name: 'role', label: 'Role', type: 'select', options: ['admin', 'superadmin'] }
              ]}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── Dashboard View ──

function DashboardView({ products, events, inquiries }: any) {
  const newInquiries = inquiries.filter((i: Lead) => i.status === 'new').length;
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ShoppingBag} label="Total Products" value={products.length} color="bg-primary" trend="+4 this week" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={newInquiries} color="bg-blue-500" trend={`${inquiries.length} total`} />
        <StatCard icon={Calendar} label="Total Events" value={events.length} color="bg-ember" trend="+2 upcoming" />
        <StatCard icon={ShieldCheck} label="Admin Users" value="2" color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold">Recent Inquiries</h3>
            <button className="text-xs text-primary font-semibold uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {inquiries.slice(0, 5).map((inquiry: Lead) => (
              <div key={inquiry.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                    {inquiry.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.requirement}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  inquiry.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 
                  inquiry.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {inquiry.status}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-center text-muted-foreground py-10">No inquiries yet</p>}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-bold">Category Distribution</h3>
            <button className="text-xs text-primary font-semibold uppercase tracking-widest hover:underline">Manage</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Factory', 'Bomb', 'Flower Pot', 'Chakkar', '9 cm'].map(cat => (
              <div key={cat} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-display font-bold text-foreground">
                  {products.filter((p: Product) => p.category === cat).length}
                </p>
                <p className="text-xs text-muted-foreground">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Generic Manager (CRUD) ──

function GenericManager({ title, items, onAdd, onUpdate, onDelete, refresh, fields }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await onUpdate(editingItem.id, formData);
        toast({ title: 'Updated', description: `${title} updated successfully` });
      } else {
        await onAdd(formData);
        toast({ title: 'Success', description: `${title} added successfully` });
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      refresh();
    } catch (err) {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;
    try {
      await onDelete(id);
      toast({ title: 'Deleted', description: 'Item removed successfully' });
      refresh();
    } catch (err) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}s...`} 
            className="boom-input pl-10 py-2 w-64 text-sm"
          />
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingItem(null); setFormData({}); }}
          className="btn-boom-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New {title}
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-display font-bold uppercase tracking-wider text-xs">Name</th>
              <th className="px-6 py-4 font-display font-bold uppercase tracking-wider text-xs">Details</th>
              <th className="px-6 py-4 font-display font-bold uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-semibold text-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.category || item.date || item.username}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">No {title.toLowerCase()}s found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-display font-bold mb-6">{editingItem ? 'Edit' : 'Add'} {title}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f: any) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea 
                        className="boom-input w-full min-h-[100px]" 
                        value={formData[f.name] || ''}
                        onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                        required
                      />
                    ) : f.type === 'select' ? (
                      <select 
                        className="boom-select w-full"
                        value={formData[f.name] || ''}
                        onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                        required
                      >
                        <option value="">Select Option</option>
                        {f.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <div className="space-y-2">
                        <input 
                          type={f.type} 
                          className="boom-input w-full" 
                          value={formData[f.name] || ''}
                          onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                          required={f.name !== 'image' && f.name !== 'price'}
                        />
                        {f.name === 'image' && formData.image && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 h-32 relative group">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs font-semibold uppercase tracking-widest">Preview</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-boom-primary py-3">Save {title}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Inquiry Manager ──

function InquiryManager({ inquiries, refresh }: any) {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [typeTab, setTypeTab] = useState<'all' | 'product' | 'event'>('all');

  const filtered = inquiries.filter((i: Lead) => {
    const statusMatch = filter === 'all' || i.status === filter;
    const typeMatch = typeTab === 'all' || 
                     (typeTab === 'product' && i.requirement.includes('Product')) || 
                     (typeTab === 'event' && i.requirement.includes('Event'));
    return statusMatch && typeMatch;
  });

  const handleStatus = async (id: string, status: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, status);
      toast({ title: 'Status Updated', description: `Inquiry is now ${status}` });
      refresh();
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast({ title: 'No data', description: 'Nothing to export' });
      return;
    }
    const headers = ['Name', 'Phone', 'Requirement', 'Status', 'Date', 'Message'];
    const csv = [
      headers.join(','),
      ...filtered.map((i: Lead) => [
        `"${i.name}"`, 
        `"${i.phone}"`, 
        `"${i.requirement}"`, 
        `"${i.status}"`, 
        `"${new Date(i.createdAt).toLocaleString()}"`,
        `"${(i as any).message || (i as any).requirements || ''}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${typeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: 'Exported', description: 'Data saved to CSV' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl self-start">
          {(['all', 'product', 'event'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                typeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="boom-select pl-10 py-2 w-48 text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <button onClick={handleExport} className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 text-sm px-4 whitespace-nowrap">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((i: Lead) => (
          <div key={i.id} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-xl">
                  {i.name[0]}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-foreground">{i.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {new Date(i.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={i.status} 
                  onChange={e => handleStatus(i.id, e.target.value as any)}
                  className={`boom-select text-xs py-1.5 px-3 rounded-lg border-0 ${
                    i.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 
                    i.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-green-500/10 text-green-400'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button onClick={() => { if(confirm('Delete inquiry?')) deleteInquiry(i.id).then(refresh) }} className="p-2 rounded-lg bg-red-400/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Contact</p>
                <p className="text-sm text-foreground">{i.phone}</p>
                <p className="text-xs text-muted-foreground">{i.email || 'No email'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Requirement</p>
                <p className="text-sm text-primary font-semibold">{i.requirement}</p>
                <p className="text-xs text-muted-foreground">{i.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Details</p>
                <p className="text-sm text-foreground">
                  {(i as any).budget ? `Budget: ${(i as any).budget}` : (i as any).quantity ? `Quantity: ${(i as any).quantity}` : `${i.items?.length || 0} cart items`}
                </p>
              </div>
            </div>
            {(i.message || (i as any).requirements) && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 text-sm text-muted-foreground italic border border-white/5">
                "{i.message || (i as any).requirements}"
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">No inquiries found for this filter</p>}
      </div>
    </div>
  );
}
