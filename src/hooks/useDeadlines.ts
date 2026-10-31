import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Deadline } from "@/lib/types";
import { getDaysUntilExpiry } from "@/lib/utils";

interface UseDeadlinesOptions {
  companyId: string;
  filter?: "all" | "expired" | "soon" | "ok";
  sort?: "expires_soonest" | "expires_latest" | "name_asc" | "name_desc";
  search?: string;
}

export function useDeadlines({ companyId, filter = "all", sort = "expires_soonest", search = "" }: UseDeadlinesOptions) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeadlines = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("deadlines")
          .select("*")
          .eq("company_id", companyId);

        // Apply search filter
        if (search) {
          query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
        }

        // Apply sort
        switch (sort) {
          case "expires_soonest":
            query = query.order("expires_on", { ascending: true });
            break;
          case "expires_latest":
            query = query.order("expires_on", { ascending: false });
            break;
          case "name_asc":
            query = query.order("name", { ascending: true });
            break;
          case "name_desc":
            query = query.order("name", { ascending: false });
            break;
        }

        const { data, error } = await query;

        if (error) throw error;

        // Apply client-side filter based on status
        if (filter !== "all") {
          const filteredData = data.filter((deadline) => {
            const days = getDaysUntilExpiry(deadline.expires_on);
            if (filter === "expired" && days >= 0) return false;
            if (filter === "soon" && (days < 0 || days > 30)) return false;
            if (filter === "ok" && days <= 30) return false;
            return true;
          });
          setDeadlines(filteredData);
        } else {
          setDeadlines(data || []);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch deadlines");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchDeadlines();
    }, 300);

    return () => clearTimeout(timer);
  }, [companyId, filter, sort, search]);

  const addDeadline = async (deadline: Omit<Deadline, "id">) => {
    try {
      const { data: newDeadline, error } = await supabase
        .from("deadlines")
        .insert(deadline)
        .select()
        .single();

      if (error) throw error;
      setDeadlines([...deadlines, newDeadline]);
      return newDeadline;
    } catch (err: any) {
      setError(err.message || "Failed to add deadline");
      throw err;
    }
  };

  const updateDeadline = async (id: string, updates: Partial<Deadline>) => {
    try {
      const { data: updatedDeadline, error } = await supabase
        .from("deadlines")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setDeadlines(
        deadlines.map((d) => (d.id === id ? updatedDeadline : d))
      );
      return updatedDeadline;
    } catch (err: any) {
      setError(err.message || "Failed to update deadline");
      throw err;
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      const { error } = await supabase.from("deadlines").delete().eq("id", id);
      if (error) throw error;
      setDeadlines(deadlines.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete deadline");
      throw err;
    }
  };

  return {
    deadlines,
    loading,
    error,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    refresh: () => fetchDeadlines(),
  };
}
