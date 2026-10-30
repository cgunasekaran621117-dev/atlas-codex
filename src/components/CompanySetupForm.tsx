import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";

export function CompanySetupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from("companies").insert({
        owner_id: session.user.id,
        name,
        phone,
      });

      if (error) throw error;

      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set Up Your Company</CardTitle>
        <CardDescription>
          Create your company profile to start managing deadlines
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Company"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
