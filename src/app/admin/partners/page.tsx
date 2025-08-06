'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Award,
  Medal,
  Shield,
  ExternalLink
} from 'lucide-react';

// Tipizācija partneru
interface Partner {
  id: number;
  name: string;
  tier: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  active: boolean;
  order: number;
}

// Partneru tipi un kategorijas
const partnerTiers = [
  { value: 'GOLD', label: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Trophy },
  { value: 'SILVER', label: 'Silver', color: 'from-gray-300 to-gray-500', icon: Medal },
  { value: 'BRONZE', label: 'Bronze', color: 'from-orange-400 to-orange-600', icon: Award },
  { value: 'PARTNER', label: 'Partner', color: 'from-blue-400 to-blue-600', icon: Shield }
];

const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Ielādējam partnerus no API
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      } else {
        console.error('Kļūda ielādējot partnerus');
      }
    } catch (error) {
      console.error('Kļūda:', error);
    } finally {
      setLoading(false);
    }
  };

  // Jauna partnera template
  const newPartnerTemplate: Omit<Partner, 'id'> = {
    name: '',
    tier: 'PARTNER',
    description: '',
    logo: null,
    website: null,
    active: true,
    order: 0
  };

  const getTierIcon = (tier: string) => {
    const tierData = partnerTiers.find(t => t.value === tier);
    if (!tierData) return <Shield className="w-4 h-4" />;
    const Icon = tierData.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getTierColor = (tier: string) => {
    const tierData = partnerTiers.find(t => t.value === tier);
    return tierData?.color || 'from-blue-400 to-blue-600';
  };

  const formatPartnerType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddPartner = () => {
    const newId = Date.now(); // Temporary ID
    const newPartner: Partner = {
      id: newId,
      ...newPartnerTemplate
    };
    setEditingPartner(newPartner);
    setIsAddingNew(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setIsAddingNew(false);
  };

  const handleSavePartner = async () => {
    if (!editingPartner || !editingPartner.name.trim()) return;
    
    setSaveStatus('saving');
    
    try {
      const url = isAddingNew ? '/api/admin/partners' : `/api/admin/partners/${editingPartner.id}`;
      const method = isAddingNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPartner),
      });

      if (response.ok) {
        const savedPartner = await response.json();
        
        if (isAddingNew) {
          setPartners([...partners, savedPartner]);
        } else {
          setPartners(partners.map(p => 
            p.id === editingPartner.id ? savedPartner : p
          ));
        }
        
        setSaveStatus('saved');
        setEditingPartner(null);
        setIsAddingNew(false);
        
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Kļūda saglabājot partneri');
      }
    } catch (error) {
      console.error('Kļūda:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingPartner(null);
    setIsAddingNew(false);
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo partneri?')) return;
    
    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPartners(partners.filter(p => p.id !== id));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Kļūda dzēšot partneri');
      }
    } catch (error) {
      console.error('Kļūda:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPartner) return;

    if (!file.type.startsWith('image/')) {
      alert('Lūdzu, izvēlieties attēla failu.');
      return;
    }

    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'sdkthunder/partners');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Kļūda augšupielādējot attēlu');
      }

      const result = await response.json();
      setEditingPartner({
        ...editingPartner,
        logo: result.url
      });
    } catch (error) {
      console.error('Kļūda:', error);
      alert('Kļūda augšupielādējot attēlu');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleToggleActive = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...partner, active: !partner.active }),
      });

      if (response.ok) {
        const updatedPartner = await response.json();
        setPartners(partners.map(p => 
          p.id === partner.id ? updatedPartner : p
        ));
      }
    } catch (error) {
      console.error('Kļūda:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Galvene */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Trophy className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partneri</h1>
            <p className="text-gray-600">Pārvaldīt sadarbības partnerus un sponsorus</p>
          </div>
        </div>
        
        <button
          onClick={handleAddPartner}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Pievienot partneri
        </button>
      </div>

      {/* Status ziņojumi */}
      {saveStatus === 'saved' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Izmaiņas veiksmīgi saglabātas!
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Kļūda saglabājot izmaiņas.
        </div>
      )}

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {partnerTiers.map((tier) => {
          const count = partners.filter(p => p.tier === tier.value && p.active).length;
          return (
            <div key={tier.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{tier.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.color}`}>
                  <tier.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Partneru saraksts */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Visi partneri ({partners.length})
          </h2>
        </div>
        
        <div className="p-6">
          {partners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nav pievienoti partneri</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div 
                  key={partner.id} 
                  className={`bg-gray-50 rounded-lg border p-4 transition-all ${
                    partner.active ? 'border-gray-200' : 'border-gray-300 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getTierColor(partner.tier)}`}>
                      {getTierIcon(partner.tier)}
                      <span className="ml-1">{partner.tier}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(partner)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          partner.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {partner.active ? 'Aktīvs' : 'Neaktīvs'}
                      </button>
                      <button
                        onClick={() => handleEditPartner(partner)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="h-20 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-16 max-w-full object-contain" 
                      />
                    ) : (
                      <div className="text-gray-400 text-sm text-center">
                        <div>{partner.name}</div>
                        <div className="text-xs">LOGO</div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {partner.name}
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h3>
                    {partner.description && (
                      <p className="text-sm text-gray-600">{partner.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {isAddingNew ? 'Pievienot partneri' : 'Rediģēt partneri'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Nosaukums */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partnera nosaukums *
                </label>
                <input
                  type="text"
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ievadiet partnera nosaukumu"
                />
              </div>

              {/* Tips */}
              <div style={{ display: 'none' }}>
                {/* Type removed - hidden for backward compatibility */}
              </div>

              {/* Līmenis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partnera līmenis *
                </label>
                <select
                  value={editingPartner.tier}
                  onChange={(e) => setEditingPartner({...editingPartner, tier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {partnerTiers.map(tier => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </select>
              </div>

              {/* Apraksts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apraksts
                </label>
                <textarea
                  value={editingPartner.description || ''}
                  onChange={(e) => setEditingPartner({...editingPartner, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ievadiet partnera aprakstu"
                />
              </div>

              {/* Mājas lapa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mājas lapa
                </label>
                <input
                  type="url"
                  value={editingPartner.website || ''}
                  onChange={(e) => setEditingPartner({...editingPartner, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="space-y-3">
                  {editingPartner.logo && (
                    <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <img 
                        src={editingPartner.logo} 
                        alt="Logo preview" 
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                        uploadingLogo 
                          ? 'bg-gray-100 cursor-not-allowed' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingLogo ? 'Augšupielādē...' : 'Augšupielādēt logo'}
                    </label>
                    {editingPartner.logo && (
                      <button
                        onClick={() => setEditingPartner({...editingPartner, logo: null})}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Noņemt
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Aktīvs */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingPartner.active}
                  onChange={(e) => setEditingPartner({...editingPartner, active: e.target.checked})}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Aktīvs (rādīt publiskajā lapā)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Atcelt
              </button>
              <button
                onClick={handleSavePartner}
                disabled={!editingPartner.name.trim() || saveStatus === 'saving'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {saveStatus === 'saving' 
                  ? 'Saglabā...' 
                  : isAddingNew 
                    ? 'Pievienot' 
                    : 'Saglabāt'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;