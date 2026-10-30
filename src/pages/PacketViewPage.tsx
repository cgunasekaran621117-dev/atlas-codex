import { useEffect, useState } from "react";
import { useSearchParams } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Deadline } from "@/lib/types";

export function PacketViewPage() {
  const [searchParams] = useSearchParams();
  const [packet, setPacket] = useState<{ company: string; items: Deadline[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.packet;
    if (!token) {
      setError("No share token provided");
      setLoading(false);
      return;
    }

    const fetchPacket = async () => {
      try {
        const { data, error } = await supabase.rpc("get_packet", {
          p_token: token,
        });

        if (error) throw error;
        setPacket(data);
      } catch (err: any) {
        setError(err.message || "Failed to load packet");
      } finally {
        setLoading(false);
      }
    };

    fetchPacket();
  }, [searchParams.packet]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">No data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{packet.company}</h1>
          <p className="text-slate-400 mt-2">Shared Deadlines</p>
        </div>

        <div className="space-y-4">
          {packet.items.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-400">No deadlines to display</p>
              </CardContent>
            </Card>
          ) : (
            packet.items.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    {item.name}
                    <Badge variant="secondary">{item.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Expires: {item.expires_on}
                    </span>
                    <StatusBadge expiresOn={item.expires_on} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
