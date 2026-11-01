import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createRootRouteWithContext()({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
