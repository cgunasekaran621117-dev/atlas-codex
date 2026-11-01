import { Outlet, useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Home, Calendar, Settings, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatar } from "./UserAvatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/" },
    { icon: <Calendar className="h-5 w-5" />, label: "Deadlines", path: "/" },
    { icon: <User className="h-5 w-5" />, label: "Profile", path: "/profile" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/profile" },
  ];

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate({ to: item.path });
                  setMobileMenuOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-2 mb-2">
                  <UserAvatar size="sm" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => navigate({ to: "/login" })}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className="h-10 w-10 p-0"
          onClick={() => navigate({ to: item.path })}
          title={item.label}
        >
          {item.icon}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Button
              variant="ghost"
              className="hidden md:flex h-10 w-10 p-0"
              onClick={() => navigate({ to: "/" })}
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-lg hidden md:block">Deadline Tracker</span>
          </div>
          
          <DesktopNav />
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="hidden md:flex"
                onClick={() => navigate({ to: "/profile" })}
              >
                <UserAvatar size="sm" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <div className="flex justify-around items-center h-14">
            {navItems.slice(0, 3).map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => navigate({ to: item.path })}
              >
                {item.icon}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
