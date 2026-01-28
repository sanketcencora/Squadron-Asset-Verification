import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Video, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Users,
  Mic,
  Camera,
  Monitor,
  Speaker
} from "lucide-react";

export default function AudioVideoDashboard() {
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
      title: "Total AV Equipment",
      value: "89",
      change: "+8%",
      icon: Video,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Active Systems",
      value: "76",
      change: "+4%",
      icon: Monitor,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "System Health",
      value: "92%",
      change: "+1%",
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Maintenance Required",
      value: "5",
      change: "-2",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  const recentEquipment = [
    {
      id: 1,
      name: "Conference Room Camera",
      type: "Camera",
      status: "Active",
      location: "Conference Room A",
      lastMaintenance: "2024-01-18"
    },
    {
      id: 2,
      name: "Wireless Microphone Set",
      type: "Microphone",
      status: "Active",
      location: "Meeting Room B",
      lastMaintenance: "2024-01-12"
    },
    {
      id: 3,
      name: "Projector HD 1080p",
      type: "Projector",
      status: "Maintenance",
      location: "Training Room",
      lastMaintenance: "2024-01-22"
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
              <h1 className="text-3xl font-bold text-gray-900">Audio Video Dashboard</h1>
              <p className="text-gray-600">Manage audio/video equipment and systems</p>
            </div>
            <Button className="gap-2">
              <Video className="w-4 h-4" />
              Add Equipment
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

        {/* Recent Equipment */}
        <motion.div variants={item}>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Recent AV Equipment
              </CardTitle>
              <CardDescription>
                Latest audio/video equipment status and maintenance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEquipment.map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Video className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{equipment.name}</h3>
                        <p className="text-sm text-gray-600">{equipment.type} • {equipment.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={equipment.status === 'Active' ? 'default' : 'secondary'}>
                        {equipment.status}
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
