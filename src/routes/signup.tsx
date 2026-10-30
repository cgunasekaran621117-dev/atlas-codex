import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupPage } from "@/pages/SignupPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
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
