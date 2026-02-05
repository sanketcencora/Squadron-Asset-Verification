import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { api, VerificationRecord } from '@/services/api';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  User,
  Calendar,
  MessageSquare,
  ZoomIn,
  RefreshCw,
  Loader2
} from 'lucide-react';

// Extended type with parsed arrays
interface VerificationRecordWithArrays extends VerificationRecord {
  peripheralsConfirmed: string[];
  peripheralsNotWithMe: string[];
}

// Helper function to parse JSON strings to arrays
const parsePeripherals = (record: VerificationRecord): VerificationRecordWithArrays => {
  let peripheralsConfirmed: string[] = [];
  let peripheralsNotWithMe: string[] = [];
  
  try {
    if (record.peripheralsConfirmedJson) {
      peripheralsConfirmed = JSON.parse(record.peripheralsConfirmedJson);
    }
  } catch (e) {
    console.warn('Failed to parse peripheralsConfirmedJson:', e);
  }
  
  try {
    if (record.peripheralsNotWithMeJson) {
      peripheralsNotWithMe = JSON.parse(record.peripheralsNotWithMeJson);
    }
  } catch (e) {
    console.warn('Failed to parse peripheralsNotWithMeJson:', e);
  }
  
  return {
    ...record,
    peripheralsConfirmed,
    peripheralsNotWithMe
  };
};

export function VerificationReviewPage() {
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecordWithArrays | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [records, setRecords] = useState<VerificationRecordWithArrays[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({ total: 0, verified: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const [recordsData, statsData] = await Promise.all([
        api.verifications.getAll(),
        api.verifications.getStats()
      ]);
      // Parse the JSON strings to arrays
      const parsedRecords = recordsData.map(parsePeripherals);
      setRecords(parsedRecords);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
      setError('Failed to load verification records');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReviewLog = () => {
    if (records.length === 0) {
      alert('No verification records to export');
      return;
    }

    // Prepare data for CSV export
    const exportData = records.map(record => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Service Tag': record.serviceTag,
      'Asset Type': record.assetType,
      'Status': record.status,
      'Submitted Date': record.submittedDate || 'Not Submitted',
      'Recorded Service Tag': record.recordedServiceTag || 'N/A',
      'Exception Type': record.exceptionType || 'None',
      'Reviewed By': record.reviewedBy || 'Pending',
      'Comment': record.comment || 'No comment',
      'Has Image': record.uploadedImage ? 'Yes' : 'No',
      'Peripherals Confirmed': record.peripheralsConfirmed.join(', ') || 'N/A',
      'Peripherals Not With Me': record.peripheralsNotWithMe.join(', ') || 'N/A'
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          const stringValue = value?.toString() || '';
          // Escape quotes and wrap in quotes if contains comma
          return stringValue.includes(',') || stringValue.includes('"') 
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Verification_Review_Log_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.serviceTag.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAccept = (recordId: number) => {
    alert(`Verification ${recordId} accepted`);
    setSelectedRecord(null);
  };

  const handleReject = (recordId: number) => {
    alert(`Verification ${recordId} marked as exception`);
    setSelectedRecord(null);
  };

  const handleReassign = (recordId: number) => {
    alert(`Asset reassignment initiated for ${recordId}`);
    setSelectedRecord(null);
  };

  const handleMarkLost = (recordId: number) => {
    alert(`Asset ${recordId} marked as lost/missing`);
    setSelectedRecord(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Review</h1>
            <p className="text-gray-600 mt-1">Review and approve employee asset verifications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchVerifications}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={handleExportReviewLog}
              disabled={loading || records.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export Review Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading verification records...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={fetchVerifications} className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards - Removed Exceptions */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Submissions</p>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Verified</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">{stats.verified || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending Review</p>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">{stats.pending || 0}</p>
          </div>
        </div>
      )}

      {!loading && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List View */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Verification Records</h2>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by employee or service tag..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="overflow-y-auto max-h-[600px]">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No records found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedRecord?.id === record.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{record.employeeName}</p>
                        <p className="text-sm text-gray-600">{record.employeeId}</p>
                      </div>
                      <StatusBadge status={record.status} size="sm" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        {record.assetType}
                      </span>
                      <span className="font-mono text-xs">{record.serviceTag}</span>
                    </div>

                    {record.submittedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted {new Date(record.submittedDate).toLocaleDateString()}
                      </p>
                    )}

                    {record.exceptionType && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-orange-700">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{record.exceptionType}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="bg-white rounded-lg border border-gray-200">
          {selectedRecord ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-gray-900">Verification Details</h2>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Employee Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Employee Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{selectedRecord.employeeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium text-gray-900">{selectedRecord.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Campaign:</span>
                      <span className="font-medium text-gray-900">{selectedRecord.campaignId}</span>
                    </div>
                  </div>
                </div>

                {/* Asset Details */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Asset Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Asset Type:</span>
                      <span className="font-medium text-gray-900">{selectedRecord.assetType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Tag:</span>
                      <span className="font-mono font-medium text-gray-900">{selectedRecord.serviceTag}</span>
                    </div>
                    {selectedRecord.recordedServiceTag && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recorded Tag:</span>
                        <span className={`font-mono font-medium ${
                          selectedRecord.recordedServiceTag === selectedRecord.serviceTag
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          {selectedRecord.recordedServiceTag}
                          {selectedRecord.recordedServiceTag !== selectedRecord.serviceTag && ' ⚠️ Mismatch'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={selectedRecord.status} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Uploaded Image */}
                {selectedRecord.uploadedImage && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Verification Image
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={selectedRecord.uploadedImage}
                        alt="Verification"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click to view full size • Verify service tag is visible and matches
                    </p>
                  </div>
                )}

                {/* Peripherals */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Peripheral Confirmation</h3>
                  <div className="space-y-2">
                    {selectedRecord.peripheralsConfirmed.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-sm font-medium text-green-900 mb-2">Confirmed ({selectedRecord.peripheralsConfirmed.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.peripheralsConfirmed.map(p => (
                            <span key={p} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRecord.peripheralsNotWithMe.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <p className="text-sm font-medium text-orange-900 mb-2">Not With Employee ({selectedRecord.peripheralsNotWithMe.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecord.peripheralsNotWithMe.map(p => (
                            <span key={p} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments */}
                {selectedRecord.comment && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Employee Comment
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-900">{selectedRecord.comment}</p>
                    </div>
                  </div>
                )}

                {/* Exception Type */}
                {selectedRecord.exceptionType && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">Exception Type</p>
                    <p className="text-sm text-red-800">{selectedRecord.exceptionType}</p>
                  </div>
                )}

                {/* Submission Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Submission Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    {selectedRecord.submittedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedRecord.submittedDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedRecord.reviewedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reviewed By:</span>
                        <span className="font-medium text-gray-900">{selectedRecord.reviewedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
                {selectedRecord.status === 'Pending' || selectedRecord.status === 'Exception' ? (
                  <>
                    <button
                      onClick={() => handleAccept(selectedRecord.id)}
                      className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Accept Verification</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleReject(selectedRecord.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Mark Exception</span>
                      </button>
                      <button
                        onClick={() => handleReassign(selectedRecord.id)}
                        className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reassign Asset</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleMarkLost(selectedRecord.id)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 flex items-center justify-center space-x-2 text-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Mark as Lost/Missing</span>
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-900">Verification Completed</p>
                    <p className="text-sm text-green-700">This record has been reviewed and approved</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center">
              <div>
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-1">No Record Selected</p>
                <p className="text-sm text-gray-500">Select a verification record to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
