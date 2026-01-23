import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Monitor,
  Laptop,
  Smartphone,
  Server,
  Wifi
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ManagerInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  // Mock inventory data
  const inventoryItems = [
    {
      id: 1,
      name: "Dell Latitude 7420",
      category: "Laptop",
      status: "Active",
      user: "John Doe",
      location: "Building A, Floor 3",
      serialNumber: "DL7420-2024-001",
      purchaseDate: "2024-01-15",
      value: "$1,299"
    },
    {
      id: 2,
      name: "HP EliteDesk 800",
      category: "Desktop",
      status: "Active",
      user: "Jane Smith",
      location: "Building B, Floor 1",
      serialNumber: "HP800-2024-002",
      purchaseDate: "2024-02-20",
      value: "$899"
    },
    {
      id: 3,
      name: "Dell U2422H Monitor",
      category: "Monitor",
      status: "Maintenance",
      user: "Mike Wilson",
      location: "Building A, Floor 2",
      serialNumber: "DU2422-2024-003",
      purchaseDate: "2024-01-10",
      value: "$349"
    },
    {
      id: 4,
      name: "iPhone 15 Pro",
      category: "Mobile",
      status: "Active",
      user: "Sarah Johnson",
      location: "Building C, Floor 4",
      serialNumber: "IP15P-2024-004",
      purchaseDate: "2024-03-05",
      value: "$999"
    },
    {
      id: 5,
      name: "Dell PowerEdge R740",
      category: "Server",
      status: "Active",
      user: "IT Admin",
      location: "Data Center",
      serialNumber: "DPR740-2024-005",
      purchaseDate: "2023-12-01",
      value: "$4,599"
    },
    {
      id: 6,
      name: "Cisco Catalyst 2960",
      category: "Network",
      status: "Active",
      user: "IT Admin",
      location: "Data Center",
      serialNumber: "CC2960-2024-006",
      purchaseDate: "2024-01-20",
      value: "$799"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Laptop": return <Laptop className="w-4 h-4" />;
      case "Desktop": return <Monitor className="w-4 h-4" />;
      case "Mobile": return <Smartphone className="w-4 h-4" />;
      case "Server": return <Server className="w-4 h-4" />;
      case "Network": return <Wifi className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 border-green-200";
      case "Maintenance": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Retired": return "bg-gray-50 text-gray-700 border-gray-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Asset Inventory</h1>
              <p className="text-muted-foreground mt-1">Manage and track all company assets.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <Plus className="w-4 h-4" />
              Add Asset
            </Button>
          </div>

          {/* Search and Filter */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="Laptop">Laptops</option>
                <option value="Desktop">Desktops</option>
                <option value="Monitor">Monitors</option>
                <option value="Mobile">Mobile Devices</option>
                <option value="Server">Servers</option>
                <option value="Network">Network Equipment</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Inventory Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <motion.div key={item.id} variants={item}>
                <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Serial Number</span>
                        <span className="font-medium">{item.serialNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned to</span>
                        <span className="font-medium">{item.user}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <motion.div variants={item} className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No assets found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
