import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import routeTree from "./routeTree.gen";
import { Toaster } from "sonner";
import "./styles.css";

const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No root element found");
}

createRoot(rootElement).render(
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
);
