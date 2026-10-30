import { createFileRoute, redirect } from "@tanstack/react-router";
import { CompanySetupPage } from "@/pages/CompanySetupPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/setup")({
  component: CompanySetupPage,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }

    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (company) {
      throw redirect({
        to: "/",
      });
    }
  },
});
