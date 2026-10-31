import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfilePage } from "@/pages/ProfilePage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
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

    if (!company) {
      throw redirect({
        to: "/setup",
      });
    }
  },
});
