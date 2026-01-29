import { useState } from 'react';
import { 
  Server, 
  Network, 
  Upload, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  FileSpreadsheet,
  Plus,
  Calendar
} from 'lucide-react';
import { mockEquipmentCounts, EquipmentCount, locations } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';

interface NetworkEquipmentDashboardProps {
  userId: string;
}

export function NetworkEquipmentDashboard({ userId }: NetworkEquipmentDashboardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'network' | 'servers'>('all');

  // Filter equipment counts for Network and Servers
  const equipmentData = mockEquipmentCounts.filter(
    eq => eq.category === 'network' || eq.category === 'servers'
  );

  const filteredData = selectedCategory === 'all' 
    ? equipmentData 
    : equipmentData.filter(eq => eq.category === selectedCategory);

  // Calculate KPIs
  const totalItems = filteredData.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalValue = filteredData.reduce((sum, eq) => sum + eq.value, 0);
  const verifiedCount = filteredData.filter(eq => eq.verificationStatus === 'Verified').length;
  const pendingCount = filteredData.filter(eq => eq.verificationStatus === 'Pending').length;
  const exceptionCount = filteredData.filter(eq => eq.verificationStatus === 'Exception').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Network Equipment & Servers Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and track network infrastructure and server assets</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Count Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Items</p>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalItems}</p>
          <p className="text-sm text-gray-500 mt-1">{filteredData.length} categories</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Value</p>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
          <p className="text-sm text-green-600 mt-1">+8% this month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Verified</p>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{verifiedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Items verified</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting verification</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Exceptions</p>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{exceptionCount}</p>
          <p className="text-sm text-gray-500 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Power BI Dashboard Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Monthly & Annual Audit Reports</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Monthly View
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annual View
              </button>
            </div>
          </div>
        </div>
        
        {/* Power BI Embed Placeholder */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Power BI Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Integrate your Power BI dashboard here for real-time monthly and annual audit reports
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-2xl mx-auto border border-blue-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Configuration Steps:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Generate Power BI embed URL from your workspace</li>
                <li>Add the embed URL to the configuration</li>
                <li>Set appropriate access permissions</li>
                <li>The dashboard will display here automatically</li>
              </ol>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Replace this placeholder with:<br />
                  <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                    &lt;iframe src="YOUR_POWERBI_EMBED_URL" width="100%" height="600px"&gt;&lt;/iframe&gt;
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Equipment Inventory</h2>
            <div className="flex items-center space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'network' | 'servers')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="network">Network Equipment</option>
                <option value="servers">Servers</option>
              </select>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        item.category === 'network' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {item.category === 'network' ? (
                          <Network className="w-4 h-4" />
                        ) : (
                          <Server className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.itemName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">${item.value.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.verificationStatus} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(item.uploadedDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadCountModal
          onClose={() => setShowUploadModal(false)}
          userId={userId}
          categories={['network', 'servers']}
        />
      )}
    </div>
  );
}

interface UploadCountModalProps {
  onClose: () => void;
  userId: string;
  categories: string[];
}

function UploadCountModal({ onClose, userId, categories }: UploadCountModalProps) {
  const [formData, setFormData] = useState({
    category: categories[0],
    itemName: '',
    quantity: '',
    value: '',
    location: locations[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    alert(`Count data uploaded successfully!\n\nItem: ${formData.itemName}\nQuantity: ${formData.quantity}\nValue: $${formData.value}\n\nThis data will now be visible on your dashboard and included in Power BI reports.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upload Equipment Count</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'network' ? 'Network Equipment' : 'Servers'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="e.g., Cisco Router 2900 Series"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Value ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Upload Count Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
