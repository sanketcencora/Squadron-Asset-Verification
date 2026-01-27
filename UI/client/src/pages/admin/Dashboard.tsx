import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  Users,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminManagerDashboard() {
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

  // Mock Admin stats
  const stats = [
    {
      title: "Total Users",
      value: "523",
      icon: Users,
      variant: "primary" as const,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Active Sessions",
      value: "89",
      icon: Activity,
      variant: "success" as const,
      trend: "+5%",
      trendUp: true
    },
    {
      title: "System Health",
      value: "98%",
      icon: Shield,
      variant: "default" as const,
      trend: "Stable",
      trendUp: true
    },
    {
      title: "Security Alerts",
      value: "3",
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: "-50%",
      trendUp: false
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">System administration and settings.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <Settings className="w-4 h-4" />
              System Settings
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

          {/* System Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Database className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Database</p>
                          <p className="text-xs text-muted-foreground">PostgreSQL</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Activity className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">API Server</p>
                          <p className="text-xs text-muted-foreground">Node.js</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Running
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <Shield className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Security</p>
                          <p className="text-xs text-muted-foreground">3 active alerts</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                        Warning
                      </span>
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
                    <Users className="w-4 h-4" />
                    User Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="w-4 h-4" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Security Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Activity className="w-4 h-4" />
                    View Audit Logs
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
