import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, MessageCircle, Link2, Search, X, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuoteRequest {
  id: string;
  industry: string;
  email: string;
  phone: string;
  country_code: string;
  country: string;
  company_name: string;
  additional_enquiry: string;
  created_at: string;
  status: string;
  order_number: string;
  notes: Note[];
}

interface Note {
  content: string;
  created_at: string;
  created_by: string;
}

interface QuoteConfiguration {
  id: string;
  quote_request_id: string;
  selected_products: any[];
  total_hardware_cost: number;
  total_subscription_cost: number;
  created_at: string;
}

type QuoteStatus = 'new' | 'demo' | 'quoted' | 'waiting' | 'start_work' | 'declined' | 'mia';

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string }> = {
  new: { label: 'NEW', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  demo: { label: 'DEMO', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  quoted: { label: 'QUOTED', color: 'bg-green-100 text-green-800 border-green-200' },
  waiting: { label: 'WAITING', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  start_work: { label: 'START WORK', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  declined: { label: 'DECLINED', color: 'bg-red-100 text-red-800 border-red-200' },
  mia: { label: 'MIA', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [configurations, setConfigurations] = useState<Map<string, QuoteConfiguration>>(new Map());
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, searchTerm, statusFilter]);

  const loadQuotes = async () => {
    try {
      setLoading(true);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          industries:industry_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders = (ordersData || []).map((order: any) => ({
        id: order.id,
        industry: order.industries?.name || order.industry_id,
        industry_id: order.industry_id,
        email: order.contact_email,
        phone: order.contact_mobile,
        country_code: order.contact_country_code || '',
        country: order.country,
        company_name: order.company_name,
        additional_enquiry: order.notes || '',
        created_at: order.created_at,
        status: order.status || 'new',
        order_number: order.reference_number,
        notes: Array.isArray(order.admin_notes) ? order.admin_notes : [],
        ...order
      }));

      setQuotes(formattedOrders);
      setConfigurations(new Map());
    } catch (error) {
      console.error('Error loading quotes:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = quotes;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.company_name?.toLowerCase().includes(term) ||
          q.email?.toLowerCase().includes(term) ||
          q.phone?.includes(term) ||
          q.order_number?.toLowerCase().includes(term) ||
          q.industry?.toLowerCase().includes(term)
      );
    }

    setFilteredQuotes(filtered);
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', quoteId);

      if (error) throw error;

      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );

      if (selectedQuote?.id === quoteId) {
        setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleWhatsApp = (countryCode: string, phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanCode = countryCode.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanCode}${cleanPhone}`, '_blank');
  };

  const handleCopyPermalink = (quoteId: string) => {
    const url = `${window.location.origin}/admin/quote/${quoteId}`;
    navigator.clipboard.writeText(url);
    alert('Permalink copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: quotes.length };
    quotes.forEach((q) => {
      counts[q.status] = (counts[q.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <div className="text-center py-12 font-bold uppercase">Loading quotes...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-black uppercase mb-1">Quote Requests</h2>
        <p className="text-xs font-bold text-gray-600 uppercase">
          {quotes.length} Total Request{quotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, email, phone, order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 text-sm font-bold focus:outline-none focus:border-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 text-xs font-black uppercase border transition-colors ${
            statusFilter === 'all'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-gray-400'
          }`}
        >
          ALL ({statusCounts.all || 0})
        </button>
        {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-xs font-black uppercase border transition-colors ${
              statusFilter === status
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-gray-400'
            }`}
          >
            {STATUS_CONFIG[status].label} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-gray-300 bg-gray-50">
          <p className="text-sm font-bold text-gray-600 uppercase">
            {searchTerm || statusFilter !== 'all' ? 'No quotes match your filters' : 'No quote requests yet'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto border border-gray-300">
          <table className="w-full bg-white text-xs">
            <thead className="bg-gray-100 border-b border-gray-300 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-black uppercase">#</th>
                <th className="px-3 py-2 text-left font-black uppercase">Date/Time</th>
                <th className="px-3 py-2 text-left font-black uppercase">Order No</th>
                <th className="px-3 py-2 text-left font-black uppercase">Industry</th>
                <th className="px-3 py-2 text-left font-black uppercase">From</th>
                <th className="px-3 py-2 text-left font-black uppercase">Status</th>
                <th className="px-3 py-2 text-center font-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote, index) => {
                const config = configurations.get(quote.id);
                const statusConfig = STATUS_CONFIG[quote.status as QuoteStatus] || STATUS_CONFIG.new;

                return (
                  <tr
                    key={quote.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-3 py-3 font-bold">{index + 1}</td>
                    <td className="px-3 py-3 font-bold whitespace-nowrap">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-3 py-3 font-black">{quote.order_number}</td>
                    <td className="px-3 py-3 font-bold">{quote.industry}</td>
                    <td className="px-3 py-3">
                      <div className="font-black">{quote.company_name || 'N/A'}</div>
                      <div className="font-bold text-gray-600">{quote.email}</div>
                      <div className="font-bold text-gray-600">{quote.phone}</div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={quote.status}
                        onChange={(e) => updateQuoteStatus(quote.id, e.target.value as QuoteStatus)}
                        className={`px-2 py-1 font-black text-xs uppercase border ${statusConfig.color} focus:outline-none cursor-pointer`}
                      >
                        {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {STATUS_CONFIG[status].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleWhatsApp(quote.country_code, quote.phone)}
                          className="p-2 border border-gray-300 hover:bg-green-50 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={14} strokeWidth={2.5} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => handleCopyPermalink(quote.id)}
                          className="p-2 border border-gray-300 hover:bg-blue-50 transition-colors"
                          title="Copy Permalink"
                        >
                          <Link2 size={14} strokeWidth={2.5} className="text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          configuration={configurations.get(selectedQuote.id)}
          onClose={() => setSelectedQuote(null)}
          onUpdate={loadQuotes}
          onStatusChange={(status) => updateQuoteStatus(selectedQuote.id, status)}
        />
      )}
    </div>
  );
}

interface QuoteDetailModalProps {
  quote: QuoteRequest;
  configuration?: QuoteConfiguration;
  onClose: () => void;
  onUpdate: () => void;
  onStatusChange: (status: QuoteStatus) => void;
}

function QuoteDetailModal({ quote, configuration, onClose, onUpdate, onStatusChange }: QuoteDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setSaving(true);

      const currentNotes = Array.isArray(quote.notes) ? quote.notes : [];
      const updatedNotes = [
        ...currentNotes,
        {
          content: newNote.trim(),
          created_at: new Date().toISOString(),
          created_by: 'admin',
        },
      ];

      const { error } = await supabase
        .from('orders')
        .update({ admin_notes: updatedNotes })
        .eq('id', quote.id);

      if (error) throw error;

      setNewNote('');
      onUpdate();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = quote.phone.replace(/\D/g, '');
    const cleanCode = quote.country_code.replace(/\D/g, '');
    const fullNumber = cleanCode ? `${cleanCode}${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullNumber}`, '_blank');
  };

  const formatNoteDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = STATUS_CONFIG[quote.status as QuoteStatus] || STATUS_CONFIG.new;
  const notes = Array.isArray(quote.notes) ? quote.notes : [];

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white border border-gray-300 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase">{quote.order_number}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase">{quote.industry}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase transition-colors flex items-center gap-2"
              title="Message on WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
              <ExternalLink size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <label className="block text-xs font-black uppercase text-gray-600 mb-2">Status</label>
            <select
              value={quote.status}
              onChange={(e) => onStatusChange(e.target.value as QuoteStatus)}
              className={`px-4 py-2 font-black text-sm uppercase border ${statusConfig.color} focus:outline-none cursor-pointer`}
            >
              {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-black uppercase mb-3 pb-2 border-b border-gray-300">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Name</p>
                <p className="text-sm font-bold">{(quote as any).contact_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Email</p>
                <p className="text-sm font-bold">{quote.email}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Mobile</p>
                <p className="text-sm font-bold">{quote.phone}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Payment Method</p>
                <p className="text-sm font-bold uppercase">{(quote as any).payment_method === 'onetime' ? 'One-time Payment' : '0% Interest 12 Months Installment'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-black uppercase mb-3 pb-2 border-b border-gray-300">
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Company Name</p>
                <p className="text-sm font-bold">{quote.company_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Brand Name</p>
                <p className="text-sm font-bold">{(quote as any).brand_name || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Address</p>
                <p className="text-sm font-bold">{(quote as any).address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Zipcode</p>
                <p className="text-sm font-bold">{(quote as any).zipcode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">State</p>
                <p className="text-sm font-bold">{(quote as any).state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Country</p>
                <p className="text-sm font-bold">{quote.country}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-black uppercase mb-3 pb-2 border-b border-gray-300">
              Order Timestamps
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Created</p>
                <p className="text-sm font-bold">{formatNoteDate(quote.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-bold">{(quote as any).updated_at ? formatNoteDate((quote as any).updated_at) : 'N/A'}</p>
              </div>
            </div>
          </div>

          {quote.additional_enquiry && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
              <p className="text-xs font-black uppercase text-gray-600 mb-2">Additional Enquiry</p>
              <p className="text-sm font-bold leading-relaxed">{quote.additional_enquiry}</p>
            </div>
          )}

          {(quote as any).selected_products && Array.isArray((quote as any).selected_products) && (quote as any).selected_products.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase mb-3 pb-2 border-b border-gray-300">
                Order Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <p className="text-xs font-black uppercase text-blue-800 mb-1">Total Hardware Cost</p>
                  <p className="text-2xl font-black text-blue-900">
                    RM {((quote as any).total_price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200">
                  <p className="text-xs font-black uppercase text-green-800 mb-1">Monthly Subscription</p>
                  <p className="text-2xl font-black text-green-900">
                    RM {(quote as any).selected_products.reduce((sum: number, item: any) => sum + (item.total_subscription || 0), 0).toFixed(2)}/mo
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {(quote as any).selected_products.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300">
                    <div>
                      <p className="font-black text-sm uppercase">{item.product_name}</p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-xs font-bold text-gray-600">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.total_price && item.total_price > 0 && (
                        <p className="text-sm font-black">RM {item.total_price.toFixed(2)}</p>
                      )}
                      {item.total_subscription && item.total_subscription > 0 && (
                        <p className="text-xs font-bold text-gray-600">
                          +RM {item.total_subscription.toFixed(2)}/mo
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-300 pt-6">
            <h3 className="text-sm font-black uppercase mb-3">
              Notes ({notes.length})
            </h3>

            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400 resize-none"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={saving || !newNote.trim()}
                className="mt-2 px-4 py-2 bg-black text-white font-black text-xs uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Adding...' : 'Add Note'}
              </button>
            </div>

            <div className="space-y-3">
              {notes.slice().reverse().map((note, index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-300">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-black uppercase text-gray-600">{note.created_by}</p>
                    <p className="text-xs font-bold text-gray-500">{formatNoteDate(note.created_at)}</p>
                  </div>
                  <p className="text-sm font-bold leading-relaxed">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-sm font-bold text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
