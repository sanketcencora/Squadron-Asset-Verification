import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCircle, Briefcase, Wallet, Users, Settings, FileText, Package, Video, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "finance",
      title: "Finance User",
      description: "Manage campaigns & reports",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: "manager",
      title: "Asset Manager",
      description: "Track inventory & exceptions",
      icon: Briefcase,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: "network_equipment_manager",
      title: "Network Equipment Manager",
      description: "Network hardware & equipment management",
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      id: "audio_video_manager",
      title: "Audio Video Manager",
      description: "Audio/video equipment & systems management",
      icon: Video,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      id: "furniture_manager",
      title: "Furniture Manager",
      description: "Furniture & office equipment management",
      icon: Home,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      id: "employee",
      title: "Employee",
      description: "Verify your assigned assets",
      icon: UserCircle,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  const handleLogin = (role: string) => {
    login({ role: role as any });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Secure Asset Verification
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            Streamline Your <br />
            <span className="text-primary">Asset Audits</span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            The modern platform for enterprise asset tracking, verification campaigns, and compliance reporting.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
              ))}
            </div>
            <p>Trusted by forward-thinking teams</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl">Select Your Role</CardTitle>
              <CardDescription>
                Choose a role to explore the platform demo
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleLogin(role.id)}
                    disabled={isLoading}
                    className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-accent/5 transition-all duration-200 text-left group w-full"
                  >
                    <div className={`p-3 rounded-lg ${role.bg} ${role.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost">Login &rarr;</Button>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
