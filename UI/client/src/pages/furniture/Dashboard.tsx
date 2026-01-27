import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { 
  Home,
  Sofa,
  Car,
  Table,
  Bed,
  Archive,
  Monitor,
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
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FurnitureManagerDashboard() {
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

  // Mock furniture data
  const furnitureItems = [
    {
      id: 1,
      name: "Executive Office Chair",
      type: "Seating",
      model: "ErgoComfort Pro",
      status: "Active",
      location: "Building A, Floor 3, Room 301",
      ip: "N/A",
      health: "Excellent",
      assignedTo: "John Smith",
      nextMaintenance: "2024-02-15",
      notes: "Premium ergonomic chair with lumbar support"
    },
    {
      id: 2,
      name: "Conference Table",
      type: "Table",
      model: "MapleWood 12ft",
      status: "Active",
      location: "Building B, Floor 1, Conference Room",
      ip: "N/A",
      health: "Good",
      assignedTo: "Meeting Room",
      nextMaintenance: "2024-03-01",
      notes: "Large conference table for 12 people"
    },
    {
      id: 3,
      name: "Standing Desk",
      type: "Table",
      model: "HeightAdjust Pro",
      status: "Warning",
      location: "Building A, Floor 2, Desk 205",
      ip: "N/A",
      health: "Fair",
      assignedTo: "Sarah Johnson",
      nextMaintenance: "2024-01-25",
      notes: "Electric height adjustment mechanism needs service"
    },
    {
      id: 4,
      name: "Office Sofa",
      type: "Sofa",
      model: "ComfortPlus 3-Seater",
      status: "Active",
      location: "Building C, Floor 1, Lobby",
      ip: "N/A",
      health: "Good",
      assignedTo: "Reception Area",
      nextMaintenance: "2024-04-10",
      notes: "Waiting area seating"
    },
    {
      id: 5,
      name: "Filing Cabinet",
      type: "Cabinet",
      model: "SteelSecure 4-Drawer",
      status: "Maintenance",
      location: "Building A, Floor 4, Storage",
      ip: "N/A",
      health: "Poor",
      assignedTo: "Admin Office",
      nextMaintenance: "2024-01-20",
      notes: "Lock mechanism needs replacement"
    },
    {
      id: 6,
      name: "Workstation Desk",
      type: "Table",
      model: "EcoWork 6ft",
      status: "Active",
      location: "Building B, Floor 3, Desk 312",
      ip: "N/A",
      health: "Excellent",
      assignedTo: "Mike Davis",
      nextMaintenance: "2024-05-15",
      notes: "Sustainable bamboo workstation"
    }
  ];

  // Filter furniture based on search and filters
  const filteredFurniture = furnitureItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={item} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Furniture Manager Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Manage furniture and office equipment</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
                <Button className="gap-2">
                  <Home className="w-4 h-4" />
                  Add Furniture
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={item}>
            <Card className="border-none shadow-xl shadow-primary/10">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">119</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">95%</div>
                    <div className="text-sm text-muted-foreground font-medium">Utilization Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">78%</div>
                    <div className="text-sm text-muted-foreground font-medium">Overall Health</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">4</div>
                    <div className="text-sm text-muted-foreground font-medium">Need Maintenance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Furniture Inventory</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="health">Health Status</TabsTrigger>
              <TabsTrigger value="information">Furniture Info</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Furniture Categories */}
                <motion.div variants={item}>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        Furniture Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Car className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Seating</div>
                            <div className="text-sm text-muted-foreground">45 items</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Table className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Tables</div>
                            <div className="text-sm text-muted-foreground">32 items</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Sofa className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Sofas</div>
                            <div className="text-sm text-muted-foreground">18 items</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Archive className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Storage</div>
                            <div className="text-sm text-muted-foreground">24 items</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Furniture Inventory Tab */}
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
                            placeholder="Search furniture by name or model..."
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
                            <SelectItem value="Seating">Seating</SelectItem>
                            <SelectItem value="Table">Tables</SelectItem>
                            <SelectItem value="Sofa">Sofas</SelectItem>
                            <SelectItem value="Cabinet">Cabinets</SelectItem>
                            <SelectItem value="Bed">Beds</SelectItem>
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
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <Home className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Items</p>
                          <p className="text-xl font-bold">{filteredFurniture.length}</p>
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
                          <p className="text-xl font-bold">{filteredFurniture.filter(e => e.status === 'Active').length}</p>
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
                          <p className="text-xl font-bold">{filteredFurniture.filter(e => e.status === 'Warning').length}</p>
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
                          <p className="text-xl font-bold">{filteredFurniture.filter(e => e.status === 'Maintenance').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Furniture Inventory Table */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      Furniture Inventory
                      <Badge variant="secondary" className="ml-auto">
                        {filteredFurniture.length} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Item Name</th>
                            <th className="text-left p-3 font-semibold">Type</th>
                            <th className="text-left p-3 font-semibold">Model</th>
                            <th className="text-left p-3 font-semibold">Status</th>
                            <th className="text-left p-3 font-semibold">Location</th>
                            <th className="text-left p-3 font-semibold">Health</th>
                            <th className="text-left p-3 font-semibold">Assigned To</th>
                            <th className="text-left p-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFurniture.map((furniture) => (
                            <tr key={furniture.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{furniture.name}</td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                                  {furniture.type}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{furniture.model}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  furniture.status === 'Active' ? 'bg-green-100 text-green-700' :
                                  furniture.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                  furniture.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {furniture.status}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{furniture.location}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  furniture.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                                  furniture.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                                  furniture.health === 'Fair' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {furniture.health}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{furniture.assignedTo}</td>
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
                        <div className="text-3xl font-bold text-amber-600">4</div>
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <div className="mt-2 text-xs text-amber-600">
                          2 Critical, 2 Routine
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
                        <div className="text-3xl font-bold text-red-600">2</div>
                        <p className="text-sm text-muted-foreground">Immediate Action</p>
                        <div className="mt-2 text-xs text-red-600">
                          Filing Cabinet, Standing Desk
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
                        <div className="text-3xl font-bold text-green-600">15</div>
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
                      {furnitureItems.filter(item => item.status === 'Maintenance' || new Date(item.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map((furniture) => (
                        <div key={furniture.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              furniture.status === 'Maintenance' ? 'bg-blue-100' : 'bg-amber-100'
                            }`}>
                              <Wrench className={`w-5 h-5 ${
                                furniture.status === 'Maintenance' ? 'text-blue-600' : 'text-amber-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">{furniture.name}</div>
                              <div className="text-sm text-muted-foreground">{furniture.model} • {furniture.location}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Assigned to: {furniture.assignedTo}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{furniture.nextMaintenance}</div>
                            <div className="text-sm text-muted-foreground">Next Maintenance</div>
                            <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                              furniture.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {furniture.status === 'Maintenance' ? 'In Progress' : 'Scheduled'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Health Status Tab */}
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
                        <div className="text-3xl font-bold text-green-600">78%</div>
                        <p className="text-sm text-muted-foreground">Good</p>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">+2% this week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Excellent Condition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600">45</div>
                        <p className="text-sm text-muted-foreground">Optimal State</p>
                        <div className="mt-2 text-xs text-amber-600">
                          75% of total
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
                        <div className="text-3xl font-bold text-amber-600">10</div>
                        <p className="text-sm text-muted-foreground">Monitor Required</p>
                        <div className="mt-2 text-xs text-amber-600">
                          17% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-xl shadow-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Poor Condition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">5</div>
                        <p className="text-sm text-muted-foreground">Immediate Action</p>
                        <div className="mt-2 text-xs text-red-600">
                          8% of total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                          <div className="font-medium text-red-800">Broken Lock Mechanism</div>
                          <div className="text-sm text-red-600">Filing Cabinet • Security risk identified</div>
                          <div className="text-xs text-red-600 mt-1">Assigned to: Maintenance Team • Priority: High</div>
                        </div>
                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Critical</div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border-l-4 border-amber-500 bg-amber-50 rounded-lg">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-800">Height Adjustment Issue</div>
                          <div className="text-sm text-amber-600">Standing Desk • Motor malfunction detected</div>
                          <div className="text-xs text-amber-600 mt-1">Assigned to: Facilities • Priority: Medium</div>
                        </div>
                        <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">Warning</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Furniture Info Tab */}
            <TabsContent value="information" className="space-y-6">
              {/* Equipment Information Display */}
              <motion.div variants={item}>
                <Card className="border-none shadow-xl shadow-primary/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      Furniture Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {furnitureItems.map((furniture) => (
                        <motion.div key={furniture.id} variants={item}>
                          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-lg">{furniture.name}</CardTitle>
                              <Badge variant="secondary" className="w-fit">
                                {furniture.type}
                              </Badge>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Model</span>
                                  <span className="font-medium">{furniture.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    furniture.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    furniture.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                    furniture.status === 'Maintenance' ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {furniture.status}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Health</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    furniture.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                                    furniture.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                                    furniture.health === 'Fair' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {furniture.health}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Location</span>
                                  <span className="font-medium text-sm">{furniture.location}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Assigned To</span>
                                  <span className="font-medium">{furniture.assignedTo}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Next Maintenance</span>
                                  <span className="font-medium">{furniture.nextMaintenance}</span>
                                </div>
                                <div className="pt-2 border-t">
                                  <p className="text-sm text-muted-foreground">{furniture.notes}</p>
                                </div>
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