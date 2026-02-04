import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { mockHardwareAssets, mockPeripherals, mockUsers, HardwareAsset, Peripheral } from '@/data/mockData';
import {
  Package,
  Upload,
  UserPlus,
  Search,
  Eye,
  Edit,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { exportToExcel, formatDateForExcel, ExcelExportRow } from '@/utils/excelExport';
import { api, HardwareAssetAPI, PeripheralAPI } from '../services/api';

interface AssetManagerDashboardProps {
  onAssignAsset: () => void;
}

export function AssetManagerDashboard({ onAssignAsset }: AssetManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'instock' | 'assigned' | 'peripherals' | 'exceptions'>('instock');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // State for backend data
  const [hardwareAssets, setHardwareAssets] = useState<HardwareAssetAPI[]>([]);
  const [peripherals, setPeripherals] = useState<PeripheralAPI[]>([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, peripheralsData] = await Promise.all([
          api.assets.getAll(),
          api.peripherals.getAll()
        ]);
        setHardwareAssets(assetsData);
        setPeripherals(peripheralsData);
        setIsBackendConnected(true);
      } catch (error) {
        console.error('Failed to fetch from backend, using mock data:', error);
        setIsBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Convert backend data to match UI format, or fall back to mock data
  const displayAssets: HardwareAsset[] = isBackendConnected
    ? hardwareAssets.map(asset => ({
        id: asset.id?.toString() || '',
        serviceTag: asset.serviceTag,
        assetType: asset.assetType as 'Laptop' | 'Monitor' | 'Mobile',
        model: asset.model,
        cost: asset.cost,
        purchaseDate: asset.purchaseDate,
        status: asset.status as 'Instock' | 'Assigned',
        assignedTo: asset.assignedTo || undefined,
        assignedToName: asset.assignedToName || undefined,
        assignedDate: asset.assignedDate || undefined,
        verificationStatus: asset.verificationStatus as 'Verified' | 'Pending' | 'Exception' | 'Overdue' | undefined,
        lastVerifiedDate: asset.lastVerifiedDate || undefined
      }))
    : mockHardwareAssets;

  const displayPeripherals: Peripheral[] = isBackendConnected
    ? peripherals.map(p => ({
        id: p.id?.toString() || '',
        type: p.type as 'Charger' | 'Headphones' | 'Dock' | 'Mouse' | 'Keyboard' | 'USB-C Cable',
        serialNumber: p.serialNumber || undefined,
        assignedTo: p.assignedTo,
        assignedToName: p.assignedToName,
        assignedDate: p.assignedDate,
        verified: p.verified
      }))
    : mockPeripherals;

  const instockAssets = displayAssets.filter(a => a.status === 'Instock');
  const assignedAssets = displayAssets.filter(a => a.status === 'Assigned');
  const exceptionAssets = displayAssets.filter(a => a.verificationStatus === 'Exception' || a.verificationStatus === 'Overdue');

  const tabs = [
    { id: 'instock' as const, label: 'Instock Hardware', count: instockAssets.length, icon: Package },
    { id: 'assigned' as const, label: 'Assigned Hardware', count: assignedAssets.length, icon: CheckCircle },
    { id: 'peripherals' as const, label: 'Assigned Peripherals', count: displayPeripherals.length, icon: Package },
    { id: 'exceptions' as const, label: 'Verification Exceptions', count: exceptionAssets.length, icon: AlertCircle }
  ];

  const handleCSVUpload = () => {
    // Mock CSV upload
    alert('CSV upload functionality - In production, this would import ServiceNow asset data');
  };

  const handleExport = () => {
    let rows: ExcelExportRow[] = [];
    if (activeTab === 'instock') {
      rows = instockAssets.map(asset => ({
        'Service Tag': asset.serviceTag,
        'Asset Type': asset.assetType,
        'Model': asset.model,
        'Cost': asset.cost.toLocaleString(),
        'Purchase Date': formatDateForExcel(asset.purchaseDate),
        'Status': asset.status,
        'Note': 'Awaiting CSV assignment'
      }));
    } else if (activeTab === 'assigned') {
      rows = assignedAssets.map(asset => ({
        'Service Tag': asset.serviceTag,
        'Asset Type': asset.assetType,
        'Model': asset.model,
        'Assigned To': asset.assignedToName,
        'Verification Status': asset.verificationStatus,
        'Last Verified': asset.lastVerifiedDate ? formatDateForExcel(asset.lastVerifiedDate) : '—'
      }));
    } else if (activeTab === 'peripherals') {
      rows = displayPeripherals.map(peripheral => ({
        'Peripheral Type': peripheral.type,
        'Serial Number': peripheral.serialNumber || '—',
        'Assigned To': peripheral.assignedToName,
        'Assigned Date': formatDateForExcel(peripheral.assignedDate),
        'Verified': peripheral.verified ? 'Verified' : 'Pending'
      }));
    } else if (activeTab === 'exceptions') {
      rows = exceptionAssets.map(asset => ({
        'Service Tag': asset.serviceTag,
        'Asset Type': asset.assetType,
        'Assigned To': asset.assignedToName,
        'Issue': asset.verificationStatus,
        'Last Verified': asset.lastVerifiedDate ? formatDateForExcel(asset.lastVerifiedDate) : '—'
      }));
    }
    exportToExcel(rows, `AssetManagerDashboard_${activeTab}`);
  };

  return (
    <div className="p-8 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading data...</span>
          </div>
        </div>
      )}

      {/* Connection Status Banner */}
      <div className={`mb-4 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm ${
        isBackendConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
      }`}>
        {isBackendConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Connected to backend - Showing live data</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Using mock data - Backend not available</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-600 mt-1">Manage hardware inventory, assignments, and verification status</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCSVUpload}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV (ServiceNow)</span>
            </button>
            <button
              onClick={onAssignAsset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Assign Peripherals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Inventory</p>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{displayAssets.length}</p>
          <p className="text-sm text-gray-600 mt-1">Hardware assets</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Instock</p>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{instockAssets.length}</p>
          <p className="text-sm text-gray-600 mt-1">Available for assignment</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Assigned</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{assignedAssets.length}</p>
          <p className="text-sm text-gray-600 mt-1">To employees</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Exceptions</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{exceptionAssets.length}</p>
          <p className="text-sm text-red-600 mt-1">Require attention</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service tag, model, or employee..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          <button
            onClick={handleExport}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-x-auto">
          {/* Instock Hardware */}
          {activeTab === 'instock' && (
            <>
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm text-blue-900">
                    <p className="font-medium">Hardware Assignment via ServiceNow</p>
                    <p className="text-blue-800 mt-1">
                      Hardware assets must be assigned to employees through ServiceNow CSV import. 
                      Use "Upload CSV (ServiceNow)" to import procurement and assignment data. 
                      Peripherals can be assigned manually to employees with hardware.
                    </p>
                  </div>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Service Tag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Asset Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instockAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">{asset.serviceTag}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{asset.assetType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{asset.model}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">${asset.cost.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={asset.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500">Awaiting CSV assignment</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Assigned Hardware */}
          {activeTab === 'assigned' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Service Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Asset Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Verification Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Last Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900">{asset.serviceTag}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{asset.assetType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{asset.model}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{asset.assignedToName}</p>
                        <p className="text-xs text-gray-500">{asset.assignedTo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={asset.verificationStatus} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {asset.lastVerifiedDate ? new Date(asset.lastVerifiedDate).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mr-3">
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Peripherals */}
          {activeTab === 'peripherals' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Peripheral Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockPeripherals.map((peripheral) => (
                  <tr key={peripheral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{peripheral.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">
                        {peripheral.serialNumber || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{peripheral.assignedToName}</p>
                        <p className="text-xs text-gray-500">{peripheral.assignedTo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(peripheral.assignedDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {peripheral.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Exceptions */}
          {activeTab === 'exceptions' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Service Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Asset Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Last Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exceptionAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900">{asset.serviceTag}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{asset.assetType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{asset.assignedToName}</p>
                        <p className="text-xs text-gray-500">{asset.assignedTo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={asset.verificationStatus} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {asset.lastVerifiedDate ? new Date(asset.lastVerifiedDate).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Empty State */}
          {((activeTab === 'instock' && instockAssets.length === 0) ||
            (activeTab === 'assigned' && assignedAssets.length === 0) ||
            (activeTab === 'peripherals' && mockPeripherals.length === 0) ||
            (activeTab === 'exceptions' && exceptionAssets.length === 0)) && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-1">No items found</p>
              <p className="text-sm text-gray-500">There are no {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}