import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Home, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Users,
  Sofa,
  Table,
  Car,
  Bed
} from "lucide-react";

export default function FurnitureDashboard() {
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
      title: "Total Furniture Items",
      value: "234",
      change: "+15%",
      icon: Home,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "In Use",
      value: "189",
      change: "+8%",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "Condition Good",
      value: "87%",
      change: "+3%",
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Need Repair",
      value: "12",
      change: "-4",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  const recentFurniture = [
    {
      id: 1,
      name: "Executive Office Chair",
      type: "Seating",
      status: "In Use",
      location: "Office 101",
      lastInspection: "2024-01-15"
    },
    {
      id: 2,
      name: "Conference Table 8-Seater",
      type: "Table",
      status: "In Use",
      location: "Conference Room A",
      lastInspection: "2024-01-10"
    },
    {
      id: 3,
      name: "Standing Desk Adjustable",
      type: "Desk",
      status: "Maintenance",
      location: "Workstation B5",
      lastInspection: "2024-01-20"
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
              <h1 className="text-3xl font-bold text-gray-900">Furniture Dashboard</h1>
              <p className="text-gray-600">Manage furniture and office equipment</p>
            </div>
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Add Furniture
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

        {/* Recent Furniture */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sofa className="w-5 h-5" />
                Recent Furniture Items
              </CardTitle>
              <CardDescription>
                Latest furniture status and inspection records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFurniture.map((furniture) => (
                  <div key={furniture.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Home className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{furniture.name}</h3>
                        <p className="text-sm text-gray-600">{furniture.type} • {furniture.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={furniture.status === 'In Use' ? 'default' : 'secondary'}>
                        {furniture.status}
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
