"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddEventButton({handleAddEvent}: {handleAddEvent: () => void}) {

  return (
    <Button onClick={handleAddEvent}>
      <Plus fill="gold" />
    </Button>
  );
}
