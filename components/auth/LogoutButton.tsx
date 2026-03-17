"use client";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

async function handleLogout() {
    await logout()
}

export default function LogoutButton() {
  return (
    <div className="w-full h-fit flex justify-center">
      <Button
        variant="link"
        className=""
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}
