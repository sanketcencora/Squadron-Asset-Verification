import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { mockCampaigns, mockHardwareAssets, mockUsers, mockEquipmentCounts } from '@/data/mockData';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Plus, 
  FileSpreadsheet,
  Package,
  CheckCircle,
  Clock,
  Filter,
  BarChart3,
  Network,
  Server,
  Video,
  Armchair,
  Box,
  Download
} from 'lucide-react';
import { exportToExcel, formatDateForExcel, ExcelExportRow } from '@/utils/excelExport';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface FinanceDashboardProps {
  onCreateCampaign: () => void;
  onViewReports: () => void;
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'red';
  trend?: { value: string; positive: boolean };
}

function KPICard({ title, value, icon: Icon, color, trend }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-semibold text-gray-900 mb-1">{value}</p>
      {trend && (
        <p className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.value}
        </p>
      )}
    </div>
  );
}

const teams = [
  'Engineering',
  'Sales & Marketing',
  'Product Management',
  'Human Resources',
  'Finance & Operations',
  'Customer Success',
  'Legal & Compliance'
];

export function FinanceDashboard({ onCreateCampaign, onViewReports }: FinanceDashboardProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Calculate KPIs
  const totalAssets = mockHardwareAssets.filter(a => a.status === 'Assigned').length;
  const totalVerified = mockUsers.filter(u => u.verificationStatus === 'Verified').length;
  const totalPending = mockUsers.filter(u => u.verificationStatus === 'Pending').length;
  const totalOverdue = mockUsers.filter(u => u.verificationStatus === 'Overdue').length;
  const totalExceptions = mockUsers.filter(u => u.verificationStatus === 'Exception').length;
  const verificationRate = Math.round((totalVerified / totalAssets) * 100);

  // Calculate ALL asset categories for comprehensive view
  const networkEquipment = mockEquipmentCounts.filter(eq => eq.category === 'network');
  const servers = mockEquipmentCounts.filter(eq => eq.category === 'servers');
  const audioVideo = mockEquipmentCounts.filter(eq => eq.category === 'audioVideo');
  const furniture = mockEquipmentCounts.filter(eq => eq.category === 'furniture');
  const otherEquipment = mockEquipmentCounts.filter(eq => eq.category === 'other');

  const totalNetworkItems = networkEquipment.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalNetworkValue = networkEquipment.reduce((sum, eq) => sum + eq.value, 0);
  
  const totalServerItems = servers.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalServerValue = servers.reduce((sum, eq) => sum + eq.value, 0);
  
  const totalAVItems = audioVideo.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalAVValue = audioVideo.reduce((sum, eq) => sum + eq.value, 0);
  
  const totalFurnitureItems = furniture.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalFurnitureValue = furniture.reduce((sum, eq) => sum + eq.value, 0);
  
  const totalOtherItems = otherEquipment.reduce((sum, eq) => sum + eq.quantity, 0);
  const totalOtherValue = otherEquipment.reduce((sum, eq) => sum + eq.value, 0);

  const hardwareValue = mockHardwareAssets.reduce((sum, a) => sum + a.cost, 0);

  const totalAllAssets = totalAssets + totalNetworkItems + totalServerItems + totalAVItems + totalFurnitureItems + totalOtherItems;
  const totalAllValue = hardwareValue + totalNetworkValue + totalServerValue + totalAVValue + totalFurnitureValue + totalOtherValue;

  // Prepare chart data
  const assetDistributionData = [
    { name: 'Hardware', value: totalAssets, color: '#3B82F6' },
    { name: 'Network', value: totalNetworkItems, color: '#06B6D4' },
    { name: 'Servers', value: totalServerItems, color: '#8B5CF6' },
    { name: 'Audio Video', value: totalAVItems, color: '#A855F7' },
    { name: 'Furniture', value: totalFurnitureItems, color: '#F97316' },
    { name: 'Other', value: totalOtherItems, color: '#6B7280' }
  ];

  const assetValueData = [
    { category: 'Hardware', value: Math.round(hardwareValue / 1000) },
    { category: 'Network', value: Math.round(totalNetworkValue / 1000) },
    { category: 'Servers', value: Math.round(totalServerValue / 1000) },
    { category: 'Audio Video', value: Math.round(totalAVValue / 1000) },
    { category: 'Furniture', value: Math.round(totalFurnitureValue / 1000) },
    { category: 'Other', value: Math.round(totalOtherValue / 1000) }
  ];

  const monthlyTrendData = [
    { month: 'Jul', verified: 520, pending: 180, total: 700 },
    { month: 'Aug', verified: 580, pending: 150, total: 730 },
    { month: 'Sep', verified: 640, pending: 120, total: 760 },
    { month: 'Oct', verified: 710, pending: 100, total: 810 },
    { month: 'Nov', verified: 780, pending: 85, total: 865 },
    { month: 'Dec', verified: 850, pending: 70, total: 920 },
    { month: 'Jan', verified: 920, pending: 55, total: 975 }
  ];

  const verificationStatusData = [
    { name: 'Verified', value: 156, color: '#10B981' },
    { name: 'Pending', value: 72, color: '#F59E0B' },
    { name: 'Overdue', value: 14, color: '#EF4444' },
    { name: 'Exception', value: 3, color: '#F97316' }
  ];

  const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#A855F7', '#F97316', '#6B7280'];

  const handleExportPendingAndExceptions = () => {
    // Get employees with pending or exception status
    const employeesWithIssues = mockUsers.filter(
      u => u.verificationStatus === 'Pending' || 
           u.verificationStatus === 'Overdue' || 
           u.verificationStatus === 'Exception'
    );

    // Map to export format
    const exportData: ExcelExportRow[] = [];

    employeesWithIssues.forEach(employee => {
      // Get all assets assigned to this employee
      const assignedAssets = mockHardwareAssets.filter(
        a => a.assignedTo === employee.employeeId
      );

      if (assignedAssets.length === 0) {
        // Employee has no assigned assets
        exportData.push({
          employeeId: employee.employeeId,
          employeeName: employee.name,
          email: employee.email,
          team: employee.team,
          location: employee.location,
          serviceTag: 'N/A',
          assetType: 'N/A',
          model: 'N/A',
          verificationStatus: employee.verificationStatus,
          lastVerifiedDate: formatDateForExcel(employee.lastVerifiedDate),
          issueDescription: 'No assets assigned'
        });
      } else {
        // Add a row for each asset
        assignedAssets.forEach(asset => {
          exportData.push({
            employeeId: employee.employeeId,
            employeeName: employee.name,
            email: employee.email,
            team: employee.team,
            location: employee.location,
            serviceTag: asset.serviceTag,
            assetType: asset.assetType,
            model: asset.model,
            verificationStatus: asset.verificationStatus || employee.verificationStatus,
            lastVerifiedDate: formatDateForExcel(asset.lastVerifiedDate),
            issueDescription: getIssueDescription(employee.verificationStatus, asset.verificationStatus)
          });
        });
      }
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Pending_And_Exceptions_Report_${timestamp}.xlsx`;

    // Export to Excel
    exportToExcel(exportData, filename);
  };

  const getIssueDescription = (employeeStatus: string, assetStatus?: string): string => {
    if (employeeStatus === 'Exception' || assetStatus === 'Exception') {
      return 'Verification exception - requires review';
    }
    if (employeeStatus === 'Overdue' || assetStatus === 'Overdue') {
      return 'Verification overdue - deadline passed';
    }
    if (employeeStatus === 'Pending' || assetStatus === 'Pending') {
      return 'Verification pending - awaiting employee action';
    }
    return '';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor verification campaigns and audit compliance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPendingAndExceptions}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Pending & Exceptions</span>
            </button>
            <button
              onClick={onCreateCampaign}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Verification Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Hardware Assets"
          value={totalAssets}
          icon={Package}
          color="blue"
          trend={{ value: '+12 this month', positive: true }}
        />
        <KPICard
          title="Verification Completed"
          value={`${verificationRate}%`}
          icon={CheckCircle}
          color="green"
          trend={{ value: `${totalVerified}/${totalAssets} verified`, positive: true }}
        />
        <KPICard
          title="Pending Verifications"
          value={totalPending}
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Overdue + Exceptions"
          value={totalOverdue + totalExceptions}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Comprehensive Asset Overview - Power BI Dashboard Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Comprehensive Asset Overview - Monthly & Annual Audits</h2>
              <p className="text-sm text-gray-600 mt-1">All asset categories including hardware, network, servers, audio video, and furniture</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Monthly View
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Annual View
              </button>
            </div>
          </div>
        </div>

        {/* Asset Category Summary Cards */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Hardware</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalAssets}</p>
              <p className="text-xs text-gray-500 mt-1">${(hardwareValue / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Network className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Network</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalNetworkItems}</p>
              <p className="text-xs text-gray-500 mt-1">${(totalNetworkValue / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Server className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Servers</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalServerItems}</p>
              <p className="text-xs text-gray-500 mt-1">${(totalServerValue / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Video className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Audio Video</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalAVItems}</p>
              <p className="text-xs text-gray-500 mt-1">${(totalAVValue / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Armchair className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Furniture</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalFurnitureItems}</p>
              <p className="text-xs text-gray-500 mt-1">${(totalFurnitureValue / 1000).toFixed(0)}K</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Box className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Other</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalOtherItems}</p>
              <p className="text-xs text-gray-500 mt-1">${(totalOtherValue / 1000).toFixed(0)}K</p>
            </div>
          </div>

          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets Across All Categories</p>
                <p className="text-xs text-gray-500 mt-1">Updated as of {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{totalAllAssets.toLocaleString()}</p>
                <p className="text-sm text-gray-600">${(totalAllValue / 1000000).toFixed(2)}M Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Power BI Dashboard Embed */}
        <div className="p-6">
          {/* Analytics Dashboard Charts */}
          <div className="space-y-6">
            {/* Header with Export */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Audit Analytics Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">Real-time visualization of all asset categories for monthly and annual audits</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Dashboard</span>
              </button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Distribution Pie Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Asset Distribution by Category</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assetDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {assetDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Status Donut Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Verification Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={verificationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {verificationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {verificationStatusData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Value Bar Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Asset Value by Category (in thousands)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assetValueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 11 }}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value) => `$${value}K`}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                      {assetValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend Area Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">7-Month Verification Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area 
                      type="monotone" 
                      dataKey="verified" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorVerified)" 
                      name="Verified"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#F59E0B" 
                      fillOpacity={1} 
                      fill="url(#colorPending)" 
                      name="Pending"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6 mt-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Dashboard Insights for Monthly & Annual Audits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-600 mb-1">Overall Compliance</p>
                      <p className="text-2xl font-bold text-green-600">{verificationRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">Target: 95%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-600 mb-1">Total Asset Value</p>
                      <p className="text-2xl font-bold text-blue-600">${(totalAllValue / 1000000).toFixed(2)}M</p>
                      <p className="text-xs text-gray-500 mt-1">Across {totalAllAssets} assets</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-600 mb-1">Highest Category</p>
                      <p className="text-2xl font-bold text-purple-600">Furniture</p>
                      <p className="text-xs text-gray-500 mt-1">{totalFurnitureItems} items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {mockCampaigns.filter(c => c.status === 'Active').map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <StatusBadge status={campaign.status} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details →
                </button>
              </div>

              {/* Campaign Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium text-gray-900">
                    {Math.round((campaign.verifiedCount / campaign.totalAssets) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(campaign.verifiedCount / campaign.totalAssets) * 100}%` }}
                  />
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-semibold text-gray-900">{campaign.totalEmployees}</p>
                  <p className="text-xs text-gray-600 mt-1">Employees</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-semibold text-green-700">{campaign.verifiedCount}</p>
                  <p className="text-xs text-green-700 mt-1">Verified</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-semibold text-yellow-700">{campaign.pendingCount}</p>
                  <p className="text-xs text-yellow-700 mt-1">Pending</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-semibold text-red-700">{campaign.overdueCount + campaign.exceptionCount}</p>
                  <p className="text-xs text-red-700 mt-1">Issues</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Deadline: <span className="font-medium text-gray-900">{new Date(campaign.deadline).toLocaleDateString()}</span>
                </span>
                <span className="text-gray-600">
                  Created: {new Date(campaign.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Status Overview */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Verification Status by Team</h2>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>View Chart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <select
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Exception">Exception</option>
            </select>
          </div>
        </div>

        {/* Exception Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Assets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Overdue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Exceptions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.slice(0, 5).map((team, index) => {
                const total = Math.floor(Math.random() * 100) + 50;
                const verified = Math.floor(total * 0.6);
                const pending = Math.floor(total * 0.25);
                const overdue = Math.floor(total * 0.1);
                const exceptions = total - verified - pending - overdue;
                const progress = Math.round((verified / total) * 100);

                return (
                  <tr key={team} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{team}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-medium">{verified}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-yellow-600 font-medium">{pending}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-600 font-medium">{overdue}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-orange-600 font-medium">{exceptions}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}