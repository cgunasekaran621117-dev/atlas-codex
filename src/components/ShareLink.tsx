import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareLinkProps {
  shareToken: string;
}

export function ShareLink({ shareToken }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}${window.location.pathname}?packet=${shareToken}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Company Deadlines",
          url: shareUrl,
        });
        toast.success("Link shared!");
      } else {
        copyToClipboard();
      }
    } catch (err) {
      toast.error("Failed to share link");
    }
  };

  return (
    <div className="flex gap-2">
      <Input value={shareUrl} readOnly className="flex-1" />
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="h-10"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        onClick={shareLink}
        className="h-10"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
