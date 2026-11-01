import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { supabase } from "@/lib/supabase";

interface AddDeadlineFormProps {
  companyId: string;
  onSuccess: () => void;
}

export function AddDeadlineForm({ companyId, onSuccess }: AddDeadlineFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("license");
  const [expiresOn, setExpiresOn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("deadlines").insert({
        company_id: companyId,
        name,
        category,
        expires_on: expiresOn,
      });

      if (error) throw error;

      setName("");
      setCategory("license");
      setExpiresOn("");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add deadline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Deadline</CardTitle>
        <CardDescription>
          Add a new deadline for your company
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Deadline Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="renewal">Renewal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresOn">Expires On</Label>
            <Input
              id="expiresOn"
              type="date"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Deadline"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
