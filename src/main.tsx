import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import routeTree from "./routeTree.gen";
import { Toaster } from "sonner";
import "./styles.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Reload
        </button>
      </div>
    </div>
  ),
  defaultPendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  ),
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
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          success: "group-[.toaster]:bg-emerald-500/20 group-[.toaster]:border-emerald-500",
          error: "group-[.toaster]:bg-red-500/20 group-[.toaster]:border-red-500",
          warning: "group-[.toaster]:bg-amber-500/20 group-[.toaster]:border-amber-500",
          info: "group-[.toaster]:bg-blue-500/20 group-[.toaster]:border-blue-500",
        },
      }}
    />
  </>
);
