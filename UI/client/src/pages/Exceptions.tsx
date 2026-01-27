import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileWarning,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ExceptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

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

  // Mock exceptions data
  const exceptions = [
    {
      id: 1,
      assetName: "Dell Latitude 7420",
      serialNumber: "DL7420-2024-001",
      exceptionType: "Missing Physical Tag",
      severity: "High",
      status: "Open",
      reportedDate: "2024-06-15",
      reportedBy: "Emily Johnson",
      description: "Asset found without physical verification tag during audit",
      resolution: null,
      resolvedDate: null
    },
    {
      id: 2,
      assetName: "HP EliteDesk 800",
      serialNumber: "HP800-2024-002",
      exceptionType: "Location Mismatch",
      severity: "Medium",
      status: "Resolved",
      reportedDate: "2024-06-14",
      reportedBy: "Michael Torres",
      description: "Asset location in system doesn't match actual location",
      resolution: "Updated location in system to Building B, Floor 1",
      resolvedDate: "2024-06-14"
    },
    {
      id: 3,
      assetName: "Dell U2422H Monitor",
      serialNumber: "DU2422-2024-003",
      exceptionType: "User Not Found",
      severity: "Medium",
      status: "Open",
      reportedDate: "2024-06-13",
      reportedBy: "Sarah Chen",
      description: "Assigned user no longer works at the company",
      resolution: null,
      resolvedDate: null
    },
    {
      id: 4,
      assetName: "iPhone 15 Pro",
      serialNumber: "IP15P-2024-004",
      exceptionType: "Asset Damaged",
      severity: "High",
      status: "Resolved",
      reportedDate: "2024-06-12",
      reportedBy: "John Doe",
      description: "Screen cracked, device not functional",
      resolution: "Device replaced under warranty",
      resolvedDate: "2024-06-13"
    },
    {
      id: 5,
      assetName: "Dell PowerEdge R740",
      serialNumber: "DPR740-2024-005",
      exceptionType: "Status Discrepancy",
      severity: "Low",
      status: "Resolved",
      reportedDate: "2024-06-11",
      reportedBy: "Jane Smith",
      description: "System shows as inactive but server is running",
      resolution: "Updated status to Active in system",
      resolvedDate: "2024-06-11"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-50 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Low": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <Clock className="w-4 h-4" />;
      case "In Progress": return <RefreshCw className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-orange-50 text-orange-700 border-orange-200";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredExceptions = exceptions.filter(exception => {
    const matchesSearch = exception.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.exceptionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || exception.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Asset Exceptions</h1>
              <p className="text-muted-foreground mt-1">Track and manage asset verification exceptions.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <FileWarning className="w-4 h-4" />
              Report Exception
            </Button>
          </div>

          {/* Search and Filter */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search exceptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Exception Cards */}
          <div className="space-y-4">
            {filteredExceptions.map((exception) => (
              <motion.div key={exception.id} variants={item}>
                <Card className="border-none shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{exception.assetName}</h3>
                          <p className="text-sm text-muted-foreground">{exception.serialNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(exception.severity)}`}>
                          {exception.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(exception.status)}`}>
                          {getStatusIcon(exception.status)}
                          {exception.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Exception Type</h4>
                      <p className="text-sm text-muted-foreground">{exception.exceptionType}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{exception.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Reported</h4>
                        <p className="text-sm text-muted-foreground">
                          {exception.reportedDate} by {exception.reportedBy}
                        </p>
                      </div>
                      {exception.resolution && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Resolution</h4>
                          <p className="text-sm text-muted-foreground">{exception.resolution}</p>
                          {exception.resolvedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Resolved on {exception.resolvedDate}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {exception.status === "Open" && (
                        <>
                          <Button size="sm" className="gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Start Resolution
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Mark Resolved
                          </Button>
                        </>
                      )}
                      {exception.status === "In Progress" && (
                        <Button size="sm" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Mark Resolved
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredExceptions.length === 0 && (
            <motion.div variants={item} className="text-center py-12">
              <FileWarning className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No exceptions found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
