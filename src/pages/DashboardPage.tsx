import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Share2, LogOut } from "lucide-react";
import { DeadlineCard } from "@/components/DeadlineCard";
import { AddDeadlineForm } from "@/components/AddDeadlineForm";
import { ShareLink } from "@/components/ShareLink";
import { Company, Deadline } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      // Fetch company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (companyError) throw companyError;

      if (!companyData) {
        navigate({ to: "/setup" });
        return;
      }

      setCompany(companyData);

      // Fetch deadlines
      const { data: deadlinesData, error: deadlinesError } = await supabase
        .from("deadlines")
        .select("*")
        .eq("company_id", companyData.id)
        .order("expires_on", { ascending: true });

      if (deadlinesError) throw deadlinesError;
      setDeadlines(deadlinesData || []);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("deadlines").delete().eq("id", id);
      if (error) throw error;
      setDeadlines(deadlines.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete deadline");
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{company.name}</h1>
            <p className="text-slate-400 mt-1">{company.phone || "No phone number"}</p>
          </div>
          <div className="flex gap-2">
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Share Link */}
        <Card className="mb-6">
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

        {/* Deadlines List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Deadlines</h2>
          {deadlines.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-400">No deadlines yet. Add one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            deadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
