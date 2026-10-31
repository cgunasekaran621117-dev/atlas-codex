import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Calendar, List, Filter, Search as SearchIcon } from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";
import { AddDeadlineForm } from "@/components/AddDeadlineForm";
import { ShareLink } from "@/components/ShareLink";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { CalendarView } from "@/components/CalendarView";
import { useDeadlines } from "@/hooks/useDeadlines";
import { useCompany } from "@/hooks/useCompany";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type ViewType = "list" | "calendar";

export function DashboardPage() {
  const { user } = useUser();
  const { company, loading: companyLoading } = useCompany();
  const [view, setView] = useState<ViewType>("list");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("expires_soonest");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { deadlines, loading, error, deleteDeadline, refresh } = useDeadlines({
    companyId: company?.id || "",
    filter: filter as "all" | "expired" | "soon" | "ok",
    sort: sort as "expires_soonest" | "expires_latest" | "name_asc" | "name_desc",
    search,
  });

  useEffect(() => {
    if (!companyLoading && !company) {
      navigate({ to: "/setup" });
    }
  }, [company, companyLoading, navigate]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDeadline(id);
      toast.success("Deadline deleted successfully");
    } catch (err) {
      toast.error("Failed to delete deadline");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    refresh();
    toast.success("Deadline added successfully");
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here are your company deadlines for <span className="font-medium text-foreground">{company.name}</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Total Deadlines</div>
            <div className="text-3xl font-bold text-foreground">{deadlines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Due Soon</div>
            <div className="text-3xl font-bold text-amber-500">
              {deadlines.filter((d) => {
                const days = (new Date(d.expires_on).getTime() - new Date().getTime()) / 864e5;
                return days <= 30 && days >= 0;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Expired</div>
            <div className="text-3xl font-bold text-red-500">
              {deadlines.filter((d) => {
                const days = (new Date(d.expires_on).getTime() - new Date().getTime()) / 864e5;
                return days < 0;
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Active</div>
            <div className="text-3xl font-bold text-emerald-500">
              {deadlines.filter((d) => {
                const days = (new Date(d.expires_on).getTime() - new Date().getTime()) / 864e5;
                return days > 30;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share Your Deadlines</CardTitle>
          <CardDescription>
            Share this link with others to view your deadlines (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShareLink shareToken={company.share_token} />
        </CardContent>
      </Card>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search deadlines..."
            className="w-full md:w-[300px]"
          />
          <FilterBar
            filter={filter}
            sort={sort}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewType)} className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Deadline</DialogTitle>
              </DialogHeader>
              <AddDeadlineForm companyId={company.id} onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-500 bg-red-500/10">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">{error}</p>
            <Button
              variant="outline"
              className="mt-4 mx-auto"
              onClick={refresh}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs value={view} className="w-full">
          <TabsContent value="list" className="space-y-0">
            {deadlines.length === 0 ? (
              <EmptyState
                type="deadlines"
                onAction={() => setShowAddForm(true)}
                actionText="Add Your First Deadline"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deadlines.map((deadline) => (
                  <DeadlineCard
                    key={deadline.id}
                    deadline={deadline}
                    onDelete={(id) => {
                      if (id === deletingId) return;
                      setDeletingId(id);
                    }}
                    showActions={deletingId !== deadline.id}
                  />
                ))}
                {deletingId && (
                  <ConfirmDialog
                    title="Delete Deadline"
                    description="Are you sure you want to delete this deadline? This action cannot be undone."
                    onConfirm={() => handleDelete(deletingId)}
                    onCancel={() => setDeletingId(null)}
                    confirmText="Delete"
                    confirmVariant="destructive"
                  />
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarView deadlines={deadlines} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
