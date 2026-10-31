import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Company } from "@/lib/types";

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: companyData, error } = await supabase
          .from("companies")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setCompany(companyData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch company");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const createCompany = async (data: Omit<Company, "id" | "owner_id" | "share_token">) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: newCompany, error } = await supabase
        .from("companies")
        .insert({
          ...data,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setCompany(newCompany);
      return newCompany;
    } catch (err: any) {
      setError(err.message || "Failed to create company");
      throw err;
    }
  };

  const updateCompany = async (updates: Partial<Company>) => {
    if (!company) return null;

    try {
      const { data: updatedCompany, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", company.id)
        .select()
        .single();

      if (error) throw error;
      setCompany(updatedCompany);
      return updatedCompany;
    } catch (err: any) {
      setError(err.message || "Failed to update company");
      throw err;
    }
  };

  return {
    company,
    loading,
    error,
    createCompany,
    updateCompany,
    refresh: () => fetchCompany(),
  };
}
