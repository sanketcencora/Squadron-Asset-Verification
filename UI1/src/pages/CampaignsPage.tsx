import { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Package, CheckCircle, Clock, AlertTriangle, XCircle, Search, Filter, X, Mail, FileText, RefreshCw, Trash2, Loader2, Send } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { api, Campaign } from '@/services/api';

interface CampaignsPageProps {
  onCreateCampaign: () => void;
}

export function CampaignsPage({ onCreateCampaign }: CampaignsPageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Active' | 'Draft' | 'Completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [launchingId, setLaunchingId] = useState<number | null>(null);
  const [launchResult, setLaunchResult] = useState<{
    campaignId: number; 
    emailsSent: number; 
    total: number;
    verificationLinks?: Array<{employeeName: string; employeeEmail: string; verificationUrl: string}>;
  } | null>(null);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [reminderResult, setReminderResult] = useState<{sent: number; total: number} | null>(null);

  // Launch campaign and send emails
  const handleLaunchWithEmails = async (campaignId: number) => {
    setLaunchingId(campaignId);
    try {
      const response = await fetch(`http://localhost:8080/api/campaigns/${campaignId}/launch-with-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to launch campaign');
      }
      
      const result = await response.json();
      setLaunchResult({
        campaignId,
        emailsSent: result.emailsSent,
        total: result.totalEmployees,
        verificationLinks: result.verificationLinks || [],
      });
      
      // Refresh campaigns to get updated status
      fetchCampaigns();
      
    } catch (err: any) {
      console.error('Failed to launch campaign:', err);
      alert(`Failed to launch campaign: ${err.message}`);
    } finally {
      setLaunchingId(null);
    }
  };

  // Send reminders handler
  const handleSendReminders = async (campaignId: number) => {
    setSendingReminders(true);
    try {
      const response = await fetch(`http://localhost:8080/api/campaigns/${campaignId}/send-reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reminders');
      }
      
      const result = await response.json();
      setReminderResult({
        sent: result.remindersSent || 0,
        total: result.totalPending || 0,
      });
      
    } catch (err: any) {
      console.error('Failed to send reminders:', err);
      alert(`Failed to send reminders: ${err.message}`);
    } finally {
      setSendingReminders(false);
    }
  };

  // Export campaign report handler
  const handleExportReport = (campaign: Campaign) => {
    // Build CSV content
    const headers = ['Campaign Name', 'Status', 'Start Date', 'Deadline', 'Total Employees', 'Total Assets', 'Verified', 'Pending', 'Exceptions'];
    const row = [
      campaign.name,
      getEffectiveStatus(campaign),
      campaign.startDate,
      campaign.deadline,
      campaign.totalEmployees || 0,
      campaign.totalAssets || 0,
      campaign.verifiedCount || 0,
      campaign.pendingCount || 0,
      campaign.exceptionCount || 0,
    ];
    
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${campaign.name.replace(/\s+/g, '_')}_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete campaign handler
  const handleDeleteCampaign = async (campaignId: number, campaignName: string) => {
    if (!confirm(`Are you sure you want to delete "${campaignName}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingId(campaignId);
    try {
      await api.campaigns.delete(campaignId);
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      alert('Failed to delete campaign. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to check if deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  // Helper function to get effective status (considering deadline)
  const getEffectiveStatus = (campaign: Campaign): string => {
    if (campaign.status === 'Completed') return 'Completed';
    if (isDeadlinePassed(campaign.deadline)) return 'Completed';
    return campaign.status;
  };

  // Helper function to get days until/since deadline
  const getDeadlineInfo = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false };
    } else if (diffDays === 1) {
      return { text: '1 day remaining', isOverdue: false };
    } else {
      return { text: `${diffDays} days remaining`, isOverdue: false };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await api.campaigns.getAll();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch campaigns from backend:', err);
      setError('Failed to load campaigns. Please check if the backend server is running.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const effectiveStatus = getEffectiveStatus(campaign);
    const matchesFilter = filter === 'all' || effectiveStatus === filter;
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getProgressPercentage = (campaign: Campaign) => {
    if (campaign.totalAssets === 0) return 0;
    return Math.round((campaign.verifiedCount / campaign.totalAssets) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Campaigns</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCampaigns}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600 mt-1">View and manage all verification campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCampaigns}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            title="Refresh campaigns"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={onCreateCampaign}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{campaigns.filter(c => getEffectiveStatus(c) === 'Active').length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{campaigns.filter(c => getEffectiveStatus(c) === 'Draft').length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{campaigns.filter(c => getEffectiveStatus(c) === 'Completed').length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        </div>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600 mb-4">
            {filter !== 'all' 
              ? `No ${filter.toLowerCase()} campaigns match your search.`
              : 'Get started by creating your first verification campaign.'}
          </p>
          <button
            onClick={onCreateCampaign}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const effectiveStatus = getEffectiveStatus(campaign);
            const deadlineInfo = getDeadlineInfo(campaign.deadline);
            
            return (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(effectiveStatus)}`}>
                      {effectiveStatus}
                    </span>
                    {deadlineInfo.isOverdue && effectiveStatus === 'Completed' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        Deadline Passed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{campaign.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${deadlineInfo.isOverdue ? 'text-red-600' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>End: {new Date(campaign.deadline).toLocaleDateString()} ({deadlineInfo.text})</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{campaign.totalEmployees} Employees</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{campaign.totalAssets} Assets</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCampaign(campaign.id, campaign.name);
                    }}
                    disabled={deletingId === campaign.id}
                    className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center space-x-1 disabled:opacity-50"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === campaign.id ? <span>Deleting...</span> : <span>Delete</span>}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Verification Progress</span>
                  <span className="font-medium text-gray-900">{getProgressPercentage(campaign)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(campaign)}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-semibold text-gray-900">{campaign.totalEmployees}</p>
                  <p className="text-xs text-gray-600">Employees</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-xl font-semibold text-green-700">{campaign.verifiedCount}</p>
                  </div>
                  <p className="text-xs text-green-700">Verified</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <p className="text-xl font-semibold text-yellow-700">{campaign.pendingCount}</p>
                  </div>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getEffectiveStatus(selectedCampaign))}`}>
                    {getEffectiveStatus(selectedCampaign)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{selectedCampaign.description}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Campaign Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created By</label>
                    <p className="text-gray-900">{selectedCampaign.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-gray-900">{new Date(selectedCampaign.createdDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Campaign Start Date</label>
                    <p className="text-gray-900">{selectedCampaign.startDate ? new Date(selectedCampaign.startDate).toLocaleDateString() : 'Not set'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Campaign End Date</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{new Date(selectedCampaign.deadline).toLocaleDateString()}</p>
                      {(() => {
                        const info = getDeadlineInfo(selectedCampaign.deadline);
                        return (
                          <span className={`text-sm ${info.isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            ({info.text})
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Peripherals</label>
                    <p className="text-gray-900">{selectedCampaign.totalPeripherals}</p>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Verification Progress</h3>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Completion</span>
                    <span className="font-medium text-gray-900">{getProgressPercentage(selectedCampaign)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(selectedCampaign)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedCampaign.totalEmployees}</p>
                  <p className="text-sm text-gray-600">Employees</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">{selectedCampaign.verifiedCount}</p>
                  <p className="text-sm text-green-700">Verified</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700">{selectedCampaign.pendingCount}</p>
                  <p className="text-sm text-yellow-700">Pending</p>
                </div>
              </div>

              {/* Filters Applied */}
              {selectedCampaign.filtersJson && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Campaign Filters</span>
                  </h3>
                  <pre className="text-sm text-gray-700 bg-white rounded p-3 overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedCampaign.filtersJson), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getEffectiveStatus(selectedCampaign) === 'Draft' && (
                  <button 
                    onClick={() => handleLaunchWithEmails(selectedCampaign.id)}
                    disabled={launchingId === selectedCampaign.id}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {launchingId === selectedCampaign.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Launching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Launch & Send Emails</span>
                      </>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => handleSendReminders(selectedCampaign.id)}
                  disabled={sendingReminders || selectedCampaign.status === 'Draft'}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingReminders ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Reminders</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleExportReport(selectedCampaign)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button 
                  onClick={() => {
                    handleDeleteCampaign(selectedCampaign.id, selectedCampaign.name);
                  }}
                  disabled={deletingId === selectedCampaign.id}
                  className="flex items-center space-x-2 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deletingId === selectedCampaign.id ? 'Deleting...' : 'Delete Campaign'}</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launch Success Modal */}
      {launchResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Campaign Launched!</h3>
              <p className="text-gray-600 mb-4">
                Verification requests created for {launchResult.emailsSent} of {launchResult.total} employees.
              </p>
            </div>
            
            {/* Verification Links */}
            {launchResult.verificationLinks && launchResult.verificationLinks.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">📧 Verification Links (click to test):</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {launchResult.verificationLinks.map((link, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 text-left">
                      <p className="text-sm font-medium text-gray-800">{link.employeeName}</p>
                      <p className="text-xs text-gray-500 mb-2">{link.employeeEmail}</p>
                      <a 
                        href={link.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        Open Verification Form →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setLaunchResult(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Success Modal */}
      {reminderResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reminders Sent!</h3>
            <p className="text-gray-600 mb-4">
              {reminderResult.total > 0
                ? `Reminder emails have been sent to ${reminderResult.sent} employees with pending verifications.`
                : reminderResult.sent > 0
                  ? `Invitations have been sent to ${reminderResult.sent} employees with pending verification records for this campaign.`
                  : 'No pending verifications found for this campaign.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {reminderResult.sent === 0
                ? 'No pending verifications found for this campaign.'
                : 'Employees will receive a reminder to complete their asset verification.'}
            </p>
            <button
              onClick={() => setReminderResult(null)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
