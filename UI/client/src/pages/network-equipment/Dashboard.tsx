import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { 
  Package,
  Power,
  Wrench,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Edit,
  Eye,
  Users,
  AlertTriangle,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NetworkEquipmentManagerDashboard() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Read tab from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'inventory', 'maintenance', 'health', 'information'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

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

  // Mock Network Equipment stats
  const stats = [
    {
      title: "Total Equipment",
      value: "342",
      icon: Package,
      variant: "primary" as const,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Active Devices",
      value: "298",
      icon: Power,
      variant: "success" as const,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Maintenance Required",
      value: "24",
      icon: Wrench,
      variant: "warning" as const,
      trend: "-15%",
      trendUp: false
    },
    {
      title: "Equipment Health",
      value: "87%",
      icon: Shield,
      variant: "default" as const,
      trend: "+5%",
      trendUp: true
    }
  ];

  // Enhanced Network Equipment data with comprehensive details
  const networkEquipment = [
    { 
      id: 1,
      name: 'Core Switch-01', 
      type: 'Switch', 
      model: 'Cisco Catalyst 9300', 
      serialNumber: 'CSW001234567',
      status: 'Active', 
      location: 'Server Room A - Rack 1', 
      ip: '192.168.1.10', 
      uptime: '45 days',
      health: 'Excellent',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2026-01-15',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      assignedTo: 'John Smith',
      notes: 'Core network switch, 48 ports, PoE enabled'
    },
    { 
      id: 2,
      name: 'Edge Router-01', 
      type: 'Router', 
      model: 'Cisco ISR 4331', 
      serialNumber: 'RTW001234568',
      status: 'Active', 
      location: 'Server Room A - Rack 2', 
      ip: '192.168.1.1', 
      uptime: '67 days',
      health: 'Excellent',
      purchaseDate: '2022-12-01',
      warrantyExpiry: '2025-12-01',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      assignedTo: 'Sarah Johnson',
      notes: 'Main edge router, dual WAN connections'
    },
    { 
      id: 3,
      name: 'Access Point-01', 
      type: 'Access Point', 
      model: 'Ubiquiti UniFi 6', 
      serialNumber: 'AP001234569',
      status: 'Warning', 
      location: 'Floor 2 - Ceiling', 
      ip: '192.168.1.100', 
      uptime: '12 days',
      health: 'Fair',
      purchaseDate: '2023-06-20',
      warrantyExpiry: '2026-06-20',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-03-15',
      assignedTo: 'Mike Davis',
      notes: 'WiFi 6 access point, requires firmware update'
    },
    { 
      id: 4,
      name: 'Firewall-01', 
      type: 'Firewall', 
      model: 'Palo Alto PA-220', 
      serialNumber: 'FW001234570',
      status: 'Active', 
      location: 'Server Room A - Rack 3', 
      ip: '192.168.1.254', 
      uptime: '89 days',
      health: 'Good',
      purchaseDate: '2023-03-10',
      warrantyExpiry: '2026-03-10',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      assignedTo: 'Emily Chen',
      notes: 'Next-generation firewall, threat prevention enabled'
    },
    { 
      id: 5,
      name: 'Storage Server-01', 
      type: 'Server', 
      model: 'Dell PowerEdge R740', 
      serialNumber: 'SRV001234571',
      status: 'Active', 
      location: 'Server Room B - Rack 1', 
      ip: '192.168.2.50', 
      uptime: '123 days',
      health: 'Excellent',
      purchaseDate: '2022-08-15',
      warrantyExpiry: '2025-08-15',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-04-25',
      assignedTo: 'Robert Wilson',
      notes: 'NAS storage server, 48TB capacity, RAID 10'
    },
    { 
      id: 6,
      name: 'Distribution Switch-01', 
      type: 'Switch', 
      model: 'Cisco Catalyst 2960', 
      serialNumber: 'DSW001234572',
      status: 'Maintenance', 
      location: 'Floor 1 - Network Closet', 
      ip: '192.168.1.20', 
      uptime: '0 days',
      health: 'Fair',
      purchaseDate: '2023-09-10',
      warrantyExpiry: '2026-09-10',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-02-15',
      assignedTo: 'Lisa Anderson',
      notes: 'Under maintenance for port replacement'
    }
  ];

  // Equipment categories for filtering
  const equipmentCategories = [
    { name: 'Routers', count: 12, percentage: 3.5, color: 'from-blue-500 to-blue-600' },
    { name: 'Switches', count: 28, percentage: 8.2, color: 'from-green-500 to-emerald-600' },
    { name: 'Access Points', count: 45, percentage: 13.2, color: 'from-amber-500 to-orange-600' },
    { name: 'Firewalls', count: 8, percentage: 2.3, color: 'from-red-500 to-pink-600' },
    { name: 'Servers', count: 15, percentage: 4.4, color: 'from-purple-500 to-indigo-600' },
    { name: 'Storage', count: 234, percentage: 68.4, color: 'from-gray-500 to-slate-600' }
  ];

  const equipmentActivities = [
    { action: 'Equipment maintenance completed', device: 'Core Switch-01', user: 'John Smith', time: '2 hours ago', icon: Wrench, color: 'from-green-500 to-emerald-600' },
    { action: 'New equipment installed', device: 'Access Point-05', user: 'Mike Johnson', time: '4 hours ago', icon: Package, color: 'from-blue-500 to-blue-600' },
    { action: 'Firmware update applied', device: 'Edge Router-01', user: 'System', time: '6 hours ago', icon: Download, color: 'from-purple-500 to-pink-600' },
    { action: 'Equipment failure detected', device: 'Storage Server-02', user: 'Monitor', time: '1 day ago', icon: AlertTriangle, color: 'from-red-500 to-orange-600' },
    { action: 'Inventory audit completed', device: 'All Equipment', user: 'Admin', time: '2 days ago', icon: Monitor, color: 'from-gray-500 to-gray-600' }
  ];

  const filteredEquipment = networkEquipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || equipment.type === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || equipment.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Network Equipment Manager</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor network hardware infrastructure.</p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Inventory
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          {stat.trendUp ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={stat.trendUp ? 'text-green-600' : 'text-red-600'}>
                            {stat.trend}
                          </span>
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <stat.icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Equipment Inventory</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="health">Equipment Health</TabsTrigger>
              <TabsTrigger value="information">Equipment Info</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Equipment Categories */}
                <motion.div variants={item}>
                  <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        Equipment Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">342</div>
                              <div className="text-sm text-muted-foreground font-medium">Total Equipment</div>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-48 h-48">
                              {equipmentCategories.map((category, index) => (
                                <div
                                  key={index}
                                  className="absolute inset-0 rounded-full border-4 opacity-30"
                                  style={{
                                    borderColor: category.color.includes('blue') ? '#3b82f6' :
                                                 category.color.includes('green') ? '#10b981' :
                                                 category.color.includes('amber') ? '#f59e0b' :
                                                 category.color.includes('red') ? '#ef4444' :
                                                 category.color.includes('purple') ? '#8b5cf6' : '#6b7280',
                                    transform: `scale(${0.3 + (index * 0.15)})`
                                  }}
                                />
                              ))}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {equipmentCategories.map((category, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold">{category.name}</div>
                                <div className="text-xs text-muted-foreground">{category.count} ({category.percentage}%)</div>
                              </div>
                            </div>
                          ))}
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
                        {equipmentActivities.map((activity, index) => {
                          const Icon = activity.icon;
                          return (
                            <div key={index} className="flex items-center gap-4 p-4 hover:bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl transition-all duration-200 group">
                              <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-purple-50 shadow-lg`}>
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.color}`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-base group-hover:text-purple-600 transition-colors">{activity.action}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Package className="w-3 h-3" />
                                  {activity.device}
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
            </TabsContent>

            {/* Equipment Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              {/* Search and Filters */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search equipment by name, model, or serial number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Router">Routers</SelectItem>
                            <SelectItem value="Switch">Switches</SelectItem>
                            <SelectItem value="Access Point">Access Points</SelectItem>
                            <SelectItem value="Firewall">Firewalls</SelectItem>
                            <SelectItem value="Server">Servers</SelectItem>
                            <SelectItem value="Storage">Storage</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Warning">Warning</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={item}>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Items</p>
                          <p className="text-xl font-bold">{filteredEquipment.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Power className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active</p>
                          <p className="text-xl font-bold">{filteredEquipment.filter(e => e.status === 'Active').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Warning</p>
                          <p className="text-xl font-bold">{filteredEquipment.filter(e => e.status === 'Warning').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Maintenance</p>
                          <p className="text-xl font-bold">{filteredEquipment.filter(e => e.status === 'Maintenance').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Equipment Inventory Table */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      Network Equipment Inventory
                      <Badge variant="secondary" className="ml-auto">
                        {filteredEquipment.length} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Device Name</th>
                            <th className="text-left p-3 font-semibold">Type</th>
                            <th className="text-left p-3 font-semibold">Model</th>
                            <th className="text-left p-3 font-semibold">Status</th>
                            <th className="text-left p-3 font-semibold">Location</th>
                            <th className="text-left p-3 font-semibold">IP Address</th>
                            <th className="text-left p-3 font-semibold">Health</th>
                            <th className="text-left p-3 font-semibold">Assigned To</th>
                            <th className="text-left p-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEquipment.map((equipment, index) => (
                            <tr key={equipment.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{equipment.name}</td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {equipment.type}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{equipment.model}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  equipment.status === 'Active' ? 'bg-green-100 text-green-700' :
                                  equipment.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                  equipment.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {equipment.status}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{equipment.location}</td>
                              <td className="p-3 font-mono text-sm">{equipment.ip}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  equipment.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                                  equipment.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                                  equipment.health === 'Fair' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {equipment.health}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{equipment.assignedTo}</td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Wrench className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-6">
              {/* Maintenance Overview */}
              <motion.div variants={item}>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Scheduled Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600">3</div>
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <div className="mt-2 text-xs text-amber-600">
                          2 Critical, 1 Routine
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">1</div>
                        <p className="text-sm text-muted-foreground">Immediate Action</p>
                        <div className="mt-2 text-xs text-red-600">
                          Core Switch-01
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">12</div>
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <div className="mt-2 text-xs text-green-600">
                          On Schedule
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Upcoming Maintenance */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      Maintenance Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {networkEquipment.filter(eq => eq.status === 'Maintenance' || new Date(eq.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              equipment.status === 'Maintenance' ? 'bg-blue-100' : 'bg-amber-100'
                            }`}>
                              <Wrench className={`w-5 h-5 ${
                                equipment.status === 'Maintenance' ? 'text-blue-600' : 'text-amber-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">{equipment.name}</div>
                              <div className="text-sm text-muted-foreground">{equipment.model} • {equipment.location}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Assigned to: {equipment.assignedTo}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{equipment.nextMaintenance}</div>
                            <div className="text-sm text-muted-foreground">Next Maintenance</div>
                            <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                              equipment.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {equipment.status === 'Maintenance' ? 'In Progress' : 'Scheduled'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Maintenance History */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      Recent Maintenance Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Wrench className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-green-800">Firmware Update Completed</div>
                          <div className="text-sm text-green-600">Edge Router-01 • 2 days ago</div>
                        </div>
                        <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Success</div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Wrench className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-800">Routine Maintenance</div>
                          <div className="text-sm text-blue-600">Storage Server-01 • 5 days ago</div>
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Completed</div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-800">Emergency Repair</div>
                          <div className="text-sm text-amber-600">Access Point-01 • 1 week ago</div>
                        </div>
                        <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">Resolved</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Health Monitoring Tab */}
            <TabsContent value="health" className="space-y-6">
              {/* Health Overview */}
              <motion.div variants={item}>
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Overall Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">87%</div>
                        <p className="text-sm text-muted-foreground">Excellent</p>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">+5% this week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Healthy Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">298</div>
                        <p className="text-sm text-muted-foreground">Optimal Performance</p>
                        <div className="mt-2 text-xs text-blue-600">
                          87% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Need Attention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600">24</div>
                        <p className="text-sm text-muted-foreground">Monitor Required</p>
                        <div className="mt-2 text-xs text-amber-600">
                          7% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Critical Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">6</div>
                        <p className="text-sm text-muted-foreground">Immediate Action</p>
                        <div className="mt-2 text-xs text-red-600">
                          2% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Health Trends */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      Equipment Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="h-64 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 rounded-2xl p-6">
                        <div className="flex items-end justify-between h-full gap-3">
                          {[85, 92, 78, 88, 95, 87, 90].map((health, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                              <div 
                                className={`w-full rounded-t-lg shadow-lg ${
                                  health > 90 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                                  health > 80 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                                  health > 70 ? 'bg-gradient-to-t from-amber-500 to-amber-400' :
                                  'bg-gradient-to-t from-red-500 to-red-400'
                                }`}
                                style={{ height: `${health}%` }}
                              ></div>
                              <span className="text-xs font-semibold text-muted-foreground bg-white/80 px-2 py-1 rounded">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">87%</div>
                          <div className="text-sm text-muted-foreground font-medium">Overall Health</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">298</div>
                          <div className="text-sm text-muted-foreground font-medium">Healthy Devices</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                          <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">24</div>
                          <div className="text-sm text-muted-foreground font-medium">Need Attention</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">6</div>
                          <div className="text-sm text-muted-foreground font-medium">Critical Issues</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health Issues */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      Critical Health Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-red-800">High CPU Usage</div>
                          <div className="text-sm text-red-600">Core Switch-01 • 95% CPU for 2 hours</div>
                          <div className="text-xs text-red-600 mt-1">Assigned to: John Smith • Priority: High</div>
                        </div>
                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Critical</div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border-l-4 border-amber-500 bg-amber-50 rounded-lg">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-800">Memory Warning</div>
                          <div className="text-sm text-amber-600">Access Point-01 • 85% memory usage</div>
                          <div className="text-xs text-amber-600 mt-1">Assigned to: Mike Davis • Priority: Medium</div>
                        </div>
                        <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">Warning</div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border-l-4 border-amber-500 bg-amber-50 rounded-lg">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-800">Storage Alert</div>
                          <div className="text-sm text-amber-600">Storage Server-01 • 92% disk usage</div>
                          <div className="text-xs text-amber-600 mt-1">Assigned to: Robert Wilson • Priority: Medium</div>
                        </div>
                        <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">Warning</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Equipment Info Tab */}
            <TabsContent value="information" className="space-y-6">
              {/* Equipment Information Display */}
              <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    Network Equipment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {networkEquipment.map((equipment) => (
                      <motion.div key={equipment.id} variants={item}>
                        <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                  <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">{equipment.type}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                equipment.status === 'Active' ? 'bg-green-100 text-green-700' :
                                equipment.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                equipment.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {equipment.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Model</span>
                                <span className="font-medium">{equipment.model}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Serial Number</span>
                                <span className="font-medium font-mono">{equipment.serialNumber}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Location</span>
                                <span className="font-medium">{equipment.location}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">IP Address</span>
                                <span className="font-medium font-mono">{equipment.ip}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Health</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  equipment.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                                  equipment.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                                  equipment.health === 'Fair' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {equipment.health}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Assigned To</span>
                                <span className="font-medium">{equipment.assignedTo}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Uptime</span>
                                <span className="font-medium">{equipment.uptime}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Next Maintenance</span>
                                <span className="font-medium">{equipment.nextMaintenance}</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t">
                              <p className="text-sm text-muted-foreground">{equipment.notes}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
