import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Trash2, Eye, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import EmberParticles from '@/components/EmberParticles';
import SparkCursor from '@/components/SparkCursor';

interface Lead {
  id: string;
  name: string;
  phone: string;
  city?: string;
  requirement: string;
  productsCount: number;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  totalValue: string;
}

// Mock data for demonstration
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    city: 'Mumbai',
    requirement: 'Bulk',
    productsCount: 5,
    createdAt: '2024-03-20',
    status: 'new',
    totalValue: '₹2,450',
  },
  {
    id: '2',
    name: 'Priya Singh',
    phone: '9123456789',
    city: 'Delhi',
    requirement: 'Event',
    productsCount: 3,
    createdAt: '2024-03-19',
    status: 'contacted',
    totalValue: '₹1,200',
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '8765432109',
    city: 'Bangalore',
    requirement: 'Retail',
    productsCount: 2,
    createdAt: '2024-03-18',
    status: 'converted',
    totalValue: '₹850',
  },
  {
    id: '4',
    name: 'Neha Gupta',
    phone: '9999888877',
    city: 'Pune',
    requirement: 'Corporate',
    productsCount: 8,
    createdAt: '2024-03-17',
    status: 'new',
    totalValue: '₹5,200',
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    phone: '9876123456',
    city: 'Hyderabad',
    requirement: 'Bulk',
    productsCount: 4,
    createdAt: '2024-03-16',
    status: 'closed',
    totalValue: '₹1,950',
  },
];

const STATUS_COLORS = {
  new: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'New' },
  contacted: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Contacted' },
  converted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Converted' },
  closed: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Closed' },
};

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Simple authentication
  const handleAuthenticate = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
      toast({
        title: 'Authenticated',
        description: 'Welcome to the admin dashboard!',
      });
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Invalid password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter leads
  useEffect(() => {
    let filtered = leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || lead.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    setFilteredLeads(filtered);
  }, [searchTerm, selectedStatus, leads]);

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedLead(null);
    toast({
      title: 'Lead Deleted',
      description: 'The inquiry has been removed.',
      duration: 3000,
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus as any } : lead
      )
    );
    toast({
      title: 'Status Updated',
      description: 'Lead status has been updated successfully.',
      duration: 2000,
    });
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'City', 'Requirement', 'Products', 'Value', 'Date', 'Status'];
    const csv = [
      headers.join(','),
      ...filteredLeads.map((lead) =>
        [
          lead.name,
          lead.phone,
          lead.city || 'N/A',
          lead.requirement,
          lead.productsCount,
          lead.totalValue,
          lead.createdAt,
          lead.status,
        ].join(',')
      ),
    ];

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Export Successful',
      description: `Exported ${filteredLeads.length} leads to CSV.`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-night-deep via-night-base to-night-deep flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 border border-primary/20">
            <h1 className="font-display font-bold text-3xl text-center mb-2">
              <span className="glow-text-gold">Admin Access</span>
            </h1>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Enter your password to access the dashboard
            </p>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAuthenticate();
                }}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-lg bg-night-surface border border-primary/20 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAuthenticate}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-primary via-ember to-primary font-semibold text-primary-foreground"
              >
                Enter Dashboard
              </motion.button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all"
              >
                Back to Home
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground/50 mt-6">
              Demo password: admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-8 border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </button>
              <h1 className="font-display font-bold text-4xl md:text-5xl">
                <span className="text-foreground">Inquiry</span>
                <span className="block glow-text-gold">Dashboard</span>
              </h1>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportCSV}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-semibold"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads', value: leads.length.toString(), color: 'text-blue-400' },
              {
                label: 'New',
                value: leads.filter((l) => l.status === 'new').length.toString(),
                color: 'text-blue-400',
              },
              {
                label: 'Converted',
                value: leads.filter((l) => l.status === 'converted').length.toString(),
                color: 'text-emerald-400',
              },
              {
                label: 'Total Value',
                value: leads.reduce((sum, l) => {
                  const val = parseFloat(l.totalValue.replace(/[^0-9.-]+/g, ''));
                  return sum + (isNaN(val) ? 0 : val);
                }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                color: 'text-primary',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-lg p-4 border border-primary/10"
              >
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className={`font-display font-bold text-2xl ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="relative py-8 border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or city..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-night-surface border border-border/50 text-foreground focus:border-primary/50 outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-night-surface border border-border/50 text-foreground focus:border-primary/50 outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Export Button (Mobile) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportCSV}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-semibold text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground/60 mt-4">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="relative py-8">
        <div className="container mx-auto px-6">
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Value
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-body font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-border/10 hover:bg-night-surface/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground font-medium">{lead.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{lead.phone}</td>
                      <td className="py-4 px-4 text-muted-foreground">{lead.city || 'N/A'}</td>
                      <td className="py-4 px-4 text-primary font-semibold">{lead.requirement}</td>
                      <td className="py-4 px-4 text-foreground">{lead.totalValue}</td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer transition-all ${
                            STATUS_COLORS[lead.status].bg
                          } ${STATUS_COLORS[lead.status].text}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No leads found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                }}
                className="px-6 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedLead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedLead(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full glass-card rounded-2xl p-6 border border-primary/20"
          >
            <h2 className="font-display font-bold text-2xl mb-4 text-foreground">
              {selectedLead.name}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground/60">Phone</p>
                <p className="text-foreground font-semibold">{selectedLead.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">City</p>
                <p className="text-foreground font-semibold">{selectedLead.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Requirement</p>
                <p className="text-primary font-semibold">{selectedLead.requirement}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Products</p>
                <p className="text-foreground">{selectedLead.productsCount} items</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Total Value</p>
                <p className="text-primary font-bold text-lg">{selectedLead.totalValue}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Date</p>
                <p className="text-foreground">{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              className="w-full mt-6 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-semibold"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
