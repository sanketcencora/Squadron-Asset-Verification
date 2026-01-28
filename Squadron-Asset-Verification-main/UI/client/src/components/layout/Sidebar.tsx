import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileCheck, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  LogOut,
  Box,
  Package,
  FileWarning
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const financeLinks = [
    { href: "/finance", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/finance/campaigns", icon: ClipboardList, label: "Campaigns" },
    { href: "/finance/reports", icon: BarChart3, label: "Reports" },
    { href: "/finance/reviews", icon: FileCheck, label: "Review" },
  ];

  const managerLinks = [
    { href: "/manager", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/manager/inventory", icon: Package, label: "Inventory" },
    { href: "/manager/exceptions", icon: FileWarning, label: "Exceptions" },
  ];

  const links = user?.role === "finance" ? financeLinks : managerLinks;

  return (
    <div className={cn("pb-12 min-h-screen bg-card border-r w-64 flex-shrink-0", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col">
        <div className="px-6 py-2 flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Box className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary">AssetVerify</h2>
        </div>
        
        <div className="px-3 py-2 flex-1">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="px-3 mt-auto">
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
