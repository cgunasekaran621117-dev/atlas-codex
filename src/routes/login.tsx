import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (company) {
        throw redirect({
          to: "/",
        });
      } else {
        throw redirect({
          to: "/setup",
        });
      }
    }
  },
});
