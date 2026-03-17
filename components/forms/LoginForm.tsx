"use client"
import { handleLoginOrSignup } from "@/components/forms/utils";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    return (
        <Button onClick={handleLoginOrSignup} variant="default">Login \ Signup</Button>
    )
}