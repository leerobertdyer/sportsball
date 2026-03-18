"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function handleAddEvent() {
  console.log("TODO");
}
export default function AddEventButton() {
  return (
    <Button onClick={handleAddEvent}>
      <Plus fill="gold" />
    </Button>
  );
}