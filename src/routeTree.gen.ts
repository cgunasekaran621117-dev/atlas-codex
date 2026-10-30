/* eslint-disable */
import { type RouteTree } from "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      parentPath: never;
      loader?: never;
      validateSearch?: never;
      beforeLoad?: () => Promise<{ session: any; company: any } | void>;
      afterLoad?: never;
      onLoaded?: never;
      hasErrorBoundary?: never;
      errorBoundary?: never;
      pendingComponent?: never;
      component: () => Promise<typeof import("./pages/DashboardPage")>;
    };
    "/login": {
      id: "/login";
      path: "/login";
      fullPath: "/login";
      parentPath: never;
      loader?: never;
      validateSearch?: never;
      beforeLoad?: () => Promise<void>;
      afterLoad?: never;
      onLoaded?: never;
      hasErrorBoundary?: never;
      errorBoundary?: never;
      pendingComponent?: never;
      component: () => Promise<typeof import("./pages/LoginPage")>;
    };
    "/signup": {
      id: "/signup";
      path: "/signup";
      fullPath: "/signup";
      parentPath: never;
      loader?: never;
      validateSearch?: never;
      beforeLoad?: () => Promise<void>;
      afterLoad?: never;
      onLoaded?: never;
      hasErrorBoundary?: never;
      errorBoundary?: never;
      pendingComponent?: never;
      component: () => Promise<typeof import("./pages/SignupPage")>;
    };
    "/setup": {
      id: "/setup";
      path: "/setup";
      fullPath: "/setup";
      parentPath: never;
      loader?: never;
      validateSearch?: never;
      beforeLoad?: () => Promise<void>;
      afterLoad?: never;
      onLoaded?: never;
      hasErrorBoundary?: never;
      errorBoundary?: never;
      pendingComponent?: never;
      component: () => Promise<typeof import("./pages/CompanySetupPage")>;
    };
    "/packet": {
      id: "/packet";
      path: "/packet";
      fullPath: "/packet";
      parentPath: never;
      loader?: never;
      validateSearch?: never;
      beforeLoad?: never;
      afterLoad?: never;
      onLoaded?: never;
      hasErrorBoundary?: never;
      errorBoundary?: never;
      pendingComponent?: never;
      component: () => Promise<typeof import("./pages/PacketViewPage")>;
    };
  }
}

const routeTree = {
  root: {
    children: [
      {
        path: "/",
        id: "/",
      },
      {
        path: "login",
        id: "/login",
      },
      {
        path: "signup",
        id: "/signup",
      },
      {
        path: "setup",
        id: "/setup",
      },
      {
        path: "packet",
        id: "/packet",
      },
    ],
  },
} as const satisfies RouteTree;

export default routeTree;
