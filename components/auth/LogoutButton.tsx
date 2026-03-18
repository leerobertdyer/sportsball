"use client";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

async function handleLogout() {
    await logout()
}

export default function LogoutButton() {
  return (
    <div className="w-fit h-fit flex justify-center absolute bottom-10 left-1/2 -translate-x-1/2">
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
