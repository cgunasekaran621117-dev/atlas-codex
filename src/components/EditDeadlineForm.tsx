import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Deadline } from "@/lib/types";
import { DEADLINE_CATEGORIES } from "@/lib/constants";
import { formatDateForInput } from "@/lib/utils";

interface EditDeadlineFormProps {
  deadline: Deadline;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditDeadlineForm({ deadline, onSuccess, onCancel }: EditDeadlineFormProps) {
  const [name, setName] = useState(deadline.name);
  const [category, setCategory] = useState(deadline.category);
  const [expiresOn, setExpiresOn] = useState(formatDateForInput(deadline.expires_on));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This would be handled by parent component
      // Just validate here
      if (!name || !category || !expiresOn) {
        throw new Error("All fields are required");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update deadline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Edit Deadline</CardTitle>
        <CardDescription>
          Update the details for this deadline
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
                {DEADLINE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
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
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Updating..." : "Update Deadline"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
