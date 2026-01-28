import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Package, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Users,
  Router,
  Server,
  Wifi,
  Cable
} from "lucide-react";

export default function NetworkEquipmentDashboard() {
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

  const stats = [
    {
      title: "Total Network Devices",
      value: "156",
      change: "+12%",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Active Connections",
      value: "142",
      change: "+5%",
      icon: Wifi,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "Network Health",
      value: "96%",
      change: "+2%",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Maintenance Required",
      value: "8",
      change: "-3",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  const recentDevices = [
    {
      id: 1,
      name: "Core Router 01",
      type: "Router",
      status: "Active",
      location: "Server Room A",
      lastMaintenance: "2024-01-15"
    },
    {
      id: 2,
      name: "Switch 24-Port",
      type: "Switch",
      status: "Active",
      location: "Office Floor 2",
      lastMaintenance: "2024-01-10"
    },
    {
      id: 3,
      name: "Access Point 05",
      type: "WiFi AP",
      status: "Maintenance",
      location: "Office Floor 3",
      lastMaintenance: "2024-01-20"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Network Equipment Dashboard</h1>
              <p className="text-gray-600">Manage network hardware and infrastructure</p>
            </div>
            <Button className="gap-2">
              <Package className="w-4 h-4" />
              Add Device
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Devices */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Router className="w-5 h-5" />
                Recent Network Devices
              </CardTitle>
              <CardDescription>
                Latest network equipment status and maintenance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-gray-600">{device.type} • {device.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={device.status === 'Active' ? 'default' : 'secondary'}>
                        {device.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
