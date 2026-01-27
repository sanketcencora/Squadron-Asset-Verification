import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Network,
  Wifi,
  Server,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Globe,
  Router,
  Cable,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

export default function NetworkEngineerDashboard() {
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

  // Mock Network stats
  const stats = [
    {
      title: "Network Devices",
      value: "156",
      icon: Router,
      variant: "primary" as const,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Active Connections",
      value: "2,847",
      icon: Wifi,
      variant: "success" as const,
      trend: "+15%",
      trendUp: true
    },
    {
      title: "Bandwidth Usage",
      value: "78%",
      icon: Activity,
      variant: "warning" as const,
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Security Alerts",
      value: "12",
      icon: Shield,
      variant: "destructive" as const,
      trend: "-25%",
      trendUp: false
    }
  ];

  const networkDevices = [
    { name: 'Core Router', status: 'Active', ip: '192.168.1.1', uptime: '45 days', type: 'Router' },
    { name: 'Switch-01', status: 'Active', ip: '192.168.1.10', uptime: '32 days', type: 'Switch' },
    { name: 'Firewall-01', status: 'Active', ip: '192.168.1.254', uptime: '67 days', type: 'Firewall' },
    { name: 'Access Point-01', status: 'Warning', ip: '192.168.1.100', uptime: '12 days', type: 'Access Point' },
    { name: 'Server-01', status: 'Active', ip: '192.168.1.50', uptime: '89 days', type: 'Server' }
  ];

  const networkActivities = [
    { action: 'Network scan completed', device: '192.168.1.0/24', user: 'System', time: '5 mins ago', icon: Network, color: 'from-blue-500 to-blue-600' },
    { action: 'Bandwidth threshold exceeded', device: 'Core Router', user: 'Monitor', time: '15 mins ago', icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
    { action: 'New device connected', device: 'Laptop-DELL-001', user: 'Auto', time: '1 hour ago', icon: Smartphone, color: 'from-green-500 to-emerald-600' },
    { action: 'Security patch applied', device: 'Firewall-01', user: 'Admin', time: '2 hours ago', icon: Shield, color: 'from-purple-500 to-pink-600' },
    { action: 'Configuration backup', device: 'All Devices', user: 'System', time: '6 hours ago', icon: Download, color: 'from-gray-500 to-gray-600' }
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Network Requirements</h1>
              <p className="text-muted-foreground mt-1">Monitor and manage network infrastructure.</p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                <Network className="w-4 h-4" />
                Network Scan
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Configure
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

          {/* Network Overview */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Network Status */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">98.5%</div>
                          <div className="text-sm text-muted-foreground font-medium">Network Uptime</div>
                        </div>
                      </div>
                      {/* Network visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                          <div className="absolute inset-2 border-4 border-green-200 rounded-full"></div>
                          <div className="absolute inset-4 border-4 border-purple-200 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                          {/* Connection lines */}
                          <div className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-blue-300 transform -translate-x-1/2"></div>
                          <div className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-green-300 transform -translate-y-1/2"></div>
                          <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-purple-300 transform -translate-x-1/2 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-green-600">142</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="text-lg font-bold text-amber-600">8</div>
                        <div className="text-xs text-muted-foreground">Warning</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="text-lg font-bold text-red-600">6</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bandwidth Usage */}
            <motion.div variants={item}>
              <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    Bandwidth Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="h-64 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 rounded-2xl p-6">
                      <div className="flex items-end justify-between h-full gap-3">
                        {[45, 78, 65, 89, 72, 85, 78].map((height, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className={`w-full rounded-t-lg shadow-lg ${
                                height > 80 ? 'bg-gradient-to-t from-red-500 to-red-400' :
                                height > 60 ? 'bg-gradient-to-t from-amber-500 to-amber-400' :
                                'bg-gradient-to-t from-green-500 to-green-400'
                              }`}
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs font-semibold text-muted-foreground bg-white/80 px-2 py-1 rounded">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">78%</div>
                        <div className="text-sm text-muted-foreground font-medium">Current Usage</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">1.2 Gbps</div>
                        <div className="text-sm text-muted-foreground font-medium">Peak Speed</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Network Devices Table */}
          <motion.div variants={item}>
            <Card className="border-none shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Router className="w-6 h-6 text-white" />
                  </div>
                  Network Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Device Name</th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th className="text-left p-3 font-semibold">IP Address</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networkDevices.map((device, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{device.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {device.type}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-sm">{device.ip}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              device.status === 'Active' ? 'bg-green-100 text-green-700' :
                              device.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {device.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">{device.uptime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  Network Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {networkActivities.map((activity, index) => {
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
                            <Router className="w-3 h-3" />
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
        </motion.div>
      </main>
    </div>
  );
}
