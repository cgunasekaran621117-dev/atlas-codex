import { createFileRoute } from "@tanstack/react-router";
import { PacketViewPage } from "@/pages/PacketViewPage";

export const Route = createFileRoute("/packet")({
  component: PacketViewPage,
});
