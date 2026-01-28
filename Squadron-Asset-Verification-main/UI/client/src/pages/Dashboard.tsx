import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package,
  FileWarning,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
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

  // Mock dashboard stats
  const stats = [
    {
      title: "Total Assets",
      value: "156",
      icon: Package,
      variant: "primary" as const,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Active Exceptions",
      value: "8",
      icon: FileWarning,
      variant: "destructive" as const,
      trend: "-25%",
      trendUp: false
    },
    {
      title: "Verified Today",
      value: "23",
      icon: CheckCircle,
      variant: "default" as const,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Pending Reviews",
      value: "14",
      icon: Clock,
      variant: "warning" as const,
      trend: "+3%",
      trendUp: true
    }
  ];

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Overview of your asset management system.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <TrendingUp className="w-4 h-4" />
              Generate Report
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="border-none shadow-lg shadow-black/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <stat.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      {stat.trend && (
                        <span className={`text-xs font-medium flex items-center gap-1 ${
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.trendUp ? '↑' : '↓'} {stat.trend}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Asset verified</p>
                        <p className="text-xs text-muted-foreground">Dell Latitude 7420 - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Exception reported</p>
                        <p className="text-xs text-muted-foreground">HP EliteDesk 800 - 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New asset added</p>
                        <p className="text-xs text-muted-foreground">iPhone 15 Pro - 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Package className="w-4 h-4" />
                    Add New Asset
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileWarning className="w-4 h-4" />
                    Report Exception
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Assign Asset
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
