import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }

    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!company) {
      throw redirect({
        to: "/setup",
      });
    }

    return { session, company };
  },
});
