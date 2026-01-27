import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Server,
  Wifi,
  Monitor,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wrench
} from "lucide-react";
import { motion } from "framer-motion";

export default function ITManagerDashboard() {
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

  // Mock IT stats
  const stats = [
    {
      title: "Total Servers",
      value: "24",
      icon: Server,
      variant: "primary" as const,
      trend: "+2",
      trendUp: true
    },
    {
      title: "Active Tickets",
      value: "18",
      icon: Wrench,
      variant: "warning" as const,
      trend: "-5",
      trendUp: false
    },
    {
      title: "Network Health",
      value: "99%",
      icon: Wifi,
      variant: "success" as const,
      trend: "Optimal",
      trendUp: true
    },
    {
      title: "Security Issues",
      value: "2",
      icon: AlertTriangle,
      variant: "destructive" as const,
      trend: "-3",
      trendUp: false
    }
  ];

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">IT Dashboard</h1>
              <p className="text-muted-foreground mt-1">Technical infrastructure and support.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <Wrench className="w-4 h-4" />
              Create Ticket
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

          {/* Infrastructure Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border-none shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Infrastructure Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Server className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Web Servers</p>
                          <p className="text-xs text-muted-foreground">4/4 online</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Wifi className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Network</p>
                          <p className="text-xs text-muted-foreground">99.9% uptime</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Optimal
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <Monitor className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Database</p>
                          <p className="text-xs text-muted-foreground">High load</p>
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
                    <Server className="w-4 h-4" />
                    View Infrastructure
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wrench className="w-4 h-4" />
                    Support Tickets
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="w-4 h-4" />
                    System Maintenance
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Security Center
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
