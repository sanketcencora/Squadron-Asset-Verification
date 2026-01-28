import { Sidebar } from "@/components/layout/Sidebar";
import { useAssets } from "@/hooks/use-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function ManagerDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: assets, isLoading } = useAssets({
    search,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'instock': return <Badge variant="secondary" className="bg-green-100 text-green-700">In Stock</Badge>;
      case 'assigned': return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Assigned</Badge>;
      case 'retired': return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Retired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Asset Inventory</h1>
              <p className="text-muted-foreground mt-1">Manage and track organization hardware.</p>
            </div>
          </div>

          <Card className="border-none shadow-lg shadow-black/5">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <CardTitle className="text-lg font-medium">All Assets</CardTitle>
                <div className="flex gap-4">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Instock">In Stock</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Tag</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Loading assets...</TableCell>
                      </TableRow>
                    ) : assets?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                      </TableRow>
                    ) : (
                      assets?.map((asset) => (
                        <TableRow key={asset.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium font-mono text-xs">{asset.serviceTag}</TableCell>
                          <TableCell>{asset.model}</TableCell>
                          <TableCell>{asset.type}</TableCell>
                          <TableCell>{asset.purchaseDate ? format(new Date(asset.purchaseDate), 'MMM d, yyyy') : '-'}</TableCell>
                          <TableCell>${asset.cost}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
