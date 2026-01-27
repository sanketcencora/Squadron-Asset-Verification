import { Sidebar } from "@/components/layout/Sidebar";
import { useAssets } from "@/hooks/use-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Package, TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Clock, Users, DollarSign, BarChart3, PieChart, Upload, Download, FileText } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ManagerDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  const { data: assets, isLoading } = useAssets({
    search,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'instock': return <Badge variant="secondary" className="bg-green-100 text-green-700">In Stock</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Assigned</Badge>;
      case 'retired': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Retired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleImportCSV = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportSubmit = () => {
    if (importFile) {
      // Simulate CSV import
      console.log('Importing CSV file:', importFile.name);
      // Here you would typically parse the CSV and upload to server
      alert(`Successfully imported ${importFile.name}`);
      setShowImportModal(false);
      setImportFile(null);
    }
  };

  const handleExportCSV = () => {
    if (assets && assets.length > 0) {
      // Create CSV content
      const headers = ['Name', 'Type', 'Status', 'Service Tag', 'Model', 'Cost', 'Purchase Date'];
      const csvContent = [
        headers.join(','),
        ...assets.map(asset => [
          asset.name,
          asset.type,
          asset.status,
          asset.serviceTag,
          asset.model,
          asset.cost,
          asset.purchaseDate ? format(new Date(asset.purchaseDate), 'yyyy-MM-dd') : 'N/A'
        ].join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `assets_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Asset Inventory</h1>
              <p className="text-muted-foreground mt-1">Manage and track organization hardware.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleImportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
            </div>
          </div>

          {/* Overview Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                      <p className="text-3xl font-bold text-blue-600">1,284</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">+12% from last month</span>
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                      <p className="text-3xl font-bold text-green-600">892</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">69.5% utilization</span>
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                      <p className="text-3xl font-bold text-amber-600">347</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-amber-600">27% available</span>
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <Package className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                      <p className="text-3xl font-bold text-purple-600">$2.4M</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <DollarSign className="w-3 h-3 text-purple-500" />
                        <span className="text-purple-600">+8% value increase</span>
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Asset Distribution Chart */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    Asset Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1,284</div>
                          <div className="text-sm text-muted-foreground font-medium">Total Assets</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#laptop-gradient)" strokeWidth="48" strokeDasharray="45 55" opacity="0.9" />
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#monitor-gradient)" strokeWidth="48" strokeDasharray="25 75" opacity="0.9" strokeDashoffset="-45" />
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#mobile-gradient)" strokeWidth="48" strokeDasharray="20 80" opacity="0.9" strokeDashoffset="-70" />
                          <circle cx="96" cy="96" r="72" fill="none" stroke="url(#other-gradient)" strokeWidth="48" strokeDasharray="10 90" opacity="0.9" strokeDashoffset="-90" />
                          <defs>
                            <linearGradient id="laptop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="monitor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                            <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#fbbf24" />
                            </linearGradient>
                            <linearGradient id="other-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#f87171" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Laptops</div>
                          <div className="text-xs text-muted-foreground">45% • 578 units</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Monitors</div>
                          <div className="text-xs text-muted-foreground">25% • 321 units</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Mobile</div>
                          <div className="text-xs text-muted-foreground">20% • 257 units</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
                        <div>
                          <div className="font-semibold text-sm">Other</div>
                          <div className="text-xs text-muted-foreground">10% • 128 units</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'New asset added', item: 'Dell Latitude 5540', user: 'Emily Johnson', time: '2 hours ago', icon: Package, color: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-indigo-50' },
                      { action: 'Asset assigned', item: 'MacBook Pro 14"', user: 'Michael Torres', time: '4 hours ago', icon: Users, color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50' },
                      { action: 'Maintenance completed', item: 'ThinkPad X1 Carbon', user: 'James Wilson', time: '6 hours ago', icon: CheckCircle, color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50' },
                      { action: 'Asset returned', item: 'Surface Laptop 4', user: 'Lisa Anderson', time: '1 day ago', icon: Package, color: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-slate-50' },
                      { action: 'Exception reported', item: 'Monitor - LG 27"', user: 'Sarah Chen', time: '2 days ago', icon: AlertTriangle, color: 'from-red-500 to-pink-600', bg: 'from-red-50 to-pink-50' }
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 hover:bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl transition-all duration-200 group">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.bg} shadow-lg`}>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.color}`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base group-hover:text-purple-600 transition-colors">{activity.action}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Package className="w-3 h-3" />
                              {activity.item}
                              <span className="text-gray-400">•</span>
                              <Users className="w-3 h-3" />
                              {activity.user}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground bg-white/80 px-3 py-1 rounded-full border">
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="border-none shadow-lg shadow-black/5">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <CardTitle className="text-lg font-medium">All Assets</CardTitle>
                <div className="flex gap-4">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Instock">In Stock</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Tag</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Loading assets...</TableCell>
                      </TableRow>
                    ) : assets?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                      </TableRow>
                    ) : (
                      assets?.map((asset) => (
                        <TableRow key={asset.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium font-mono text-xs">{asset.serviceTag}</TableCell>
                          <TableCell>{asset.model}</TableCell>
                          <TableCell>{asset.type}</TableCell>
                          <TableCell>{asset.purchaseDate ? format(new Date(asset.purchaseDate), 'MMM d, yyyy') : '-'}</TableCell>
                          <TableCell>${asset.cost}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Import CSV Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Import CSV File</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    {importFile ? importFile.name : 'Choose a CSV file or drag and drop'}
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-file-input"
                  />
                  <label
                    htmlFor="csv-file-input"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
                  >
                    Select File
                  </label>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                  <p>Maximum file size: 10MB</p>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    disabled={!importFile}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
