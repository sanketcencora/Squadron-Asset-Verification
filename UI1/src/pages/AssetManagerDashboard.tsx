import { useState, useEffect, useRef } from 'react';
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
  WifiOff,
  X,
  FileText
} from 'lucide-react';
import { exportToExcel, formatDateForExcel, ExcelExportRow } from '@/utils/excelExport';
import { api, HardwareAssetAPI, PeripheralAPI } from '../services/api';

interface AssetManagerDashboardProps {
  onAssignAsset: () => void;
}

export function AssetManagerDashboard({ onAssignAsset }: AssetManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'instock' | 'assigned' | 'peripherals'>('instock');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ message: string; created: number; updated: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        type: (p.type === 'USBCCable' ? 'USB-C Cable' : p.type) as 'Charger' | 'Headphones' | 'Dock' | 'Mouse' | 'Keyboard' | 'USB-C Cable',
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
    { id: 'peripherals' as const, label: 'Assigned Peripherals', count: displayPeripherals.length, icon: Package }
  ];

  const handleCSVUpload = () => {
    setShowUploadModal(true);
    setUploadResult(null);
  };

  const parseCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          reject(new Error('CSV file is empty or has no data rows'));
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
        
        resolve(data);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const mapCSVToAsset = (row: Record<string, string>): Partial<HardwareAssetAPI> => {
    // Map common ServiceNow CSV fields to our asset format
    const assetTypeMap: Record<string, string> = {
      'laptop': 'Laptop',
      'notebook': 'Laptop',
      'monitor': 'Monitor',
      'display': 'Monitor',
      'mobile': 'Mobile',
      'phone': 'Mobile',
      'iphone': 'Mobile',
      'android': 'Mobile',
    };

    const typeValue = (row['asset type'] || row['type'] || row['assettype'] || row['category'] || 'Laptop').toLowerCase();
    const assetType = Object.keys(assetTypeMap).find(key => typeValue.includes(key)) 
      ? assetTypeMap[Object.keys(assetTypeMap).find(key => typeValue.includes(key))!]
      : 'Laptop';

    return {
      serviceTag: row['service tag'] || row['servicetag'] || row['asset tag'] || row['serial'] || row['serial number'] || '',
      assetType: assetType as any,
      model: row['model'] || row['model number'] || row['product'] || '',
      invoiceNumber: row['invoice'] || row['invoice number'] || row['invoicenumber'] || '',
      poNumber: row['po'] || row['po number'] || row['ponumber'] || row['purchase order'] || '',
      cost: parseFloat(row['cost'] || row['price'] || row['value'] || '0') || 0,
      purchaseDate: row['purchase date'] || row['purchasedate'] || row['date'] || new Date().toISOString().split('T')[0],
      assignedTo: row['assigned to'] || row['assignedto'] || row['employee id'] || row['employeeid'] || row['user'] || '',
      assignedToName: row['assigned to name'] || row['assignedtoname'] || row['employee name'] || row['employeename'] || row['user name'] || '',
      status: (row['assigned to'] || row['assignedto'] || row['employee id']) ? 'Assigned' : 'Instock',
      isHighValue: parseFloat(row['cost'] || row['price'] || row['value'] || '0') > 1000,
      location: row['location'] || row['site'] || 'Pune',
      team: row['team'] || row['department'] || row['dept'] || '',
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadResult(null);

    try {
      const csvData = await parseCSVFile(file);
      const assets = csvData.map(mapCSVToAsset).filter(a => a.serviceTag);

      if (assets.length === 0) {
        setUploadResult({ message: 'No valid assets found in CSV', created: 0, updated: 0, errors: 0 });
        setUploadLoading(false);
        return;
      }

      const result = await api.assets.bulkImport(assets);
      setUploadResult(result);

      // Refresh the assets list
      const assetsData = await api.assets.getAll();
      setHardwareAssets(assetsData);
    } catch (error: any) {
      setUploadResult({ 
        message: error.message || 'Failed to import CSV', 
        created: 0, 
        updated: 0, 
        errors: 1 
      });
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `Service Tag,Asset Type,Model,Cost,Purchase Date,Assigned To,Assigned To Name,Location,Team
ST-LT-2025-100,Laptop,Dell Latitude 5550,1350,2025-02-01,a123456,John Doe,Pune,Engineering
ST-MN-2025-100,Monitor,Dell U2723QE,650,2025-02-01,,,Pune,
ST-MB-2025-100,Mobile,iPhone 15 Pro,1199,2025-02-02,a123457,Jane Smith,Mumbai,Sales`;
    
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_servicenow_assets.csv';
    a.click();
    URL.revokeObjectURL(url);
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

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Upload CSV (ServiceNow)</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Supported CSV Format:</strong> ServiceNow asset export with columns like 
                  Service Tag, Asset Type, Model, Cost, Purchase Date, Assigned To, etc.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                {uploadLoading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                    <p className="text-gray-600">Processing CSV file...</p>
                  </div>
                ) : (
                  <>
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <label 
                      htmlFor="csv-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Click to select CSV file
                    </label>
                    <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
                  </>
                )}
              </div>

              {uploadResult && (
                <div className={`rounded-lg p-4 ${
                  uploadResult.errors > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <p className={`font-medium ${uploadResult.errors > 0 ? 'text-red-900' : 'text-green-900'}`}>
                    {uploadResult.message}
                  </p>
                  <div className="mt-2 text-sm space-y-1">
                    <p className="text-green-700">✓ Created: {uploadResult.created} assets</p>
                    <p className="text-blue-700">↻ Updated: {uploadResult.updated} assets</p>
                    {uploadResult.errors > 0 && (
                      <p className="text-red-700">✗ Errors: {uploadResult.errors}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={downloadSampleCSV}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample CSV</span>
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Banner */}
      {/* <div className={`mb-4 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm ${
        isBackendConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
      }`}>
        {isBackendConnected ? (
          <>
            <Wifi className="w-4 h-4" />
           
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Using mock data - Backend not available</span>
          </>
        )}
      </div> */}

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
        {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Exceptions</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{exceptionAssets.length}</p>
          <p className="text-sm text-red-600 mt-1">Require attention</p>
        </div> */}
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
                  {instockAssets
                    .filter(a => 
                      !searchQuery || 
                      a.serviceTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.assetType.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((asset) => (
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
                {assignedAssets
                  .filter(a => 
                    !searchQuery || 
                    a.serviceTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((asset) => (
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
                {displayPeripherals
                  .filter(p => 
                    !searchQuery || 
                    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((peripheral) => (
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

         

          {/* Empty State */}
          {((activeTab === 'instock' && instockAssets.length === 0) ||
            (activeTab === 'assigned' && assignedAssets.length === 0) ||
            (activeTab === 'peripherals' && displayPeripherals.length === 0)
          ) && (
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