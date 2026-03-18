"use client";
import LoginForm from "@/components/auth/LoginForm";
import SingUpForm from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div
      className="w-full h-screen "
      style={{
        backgroundImage: 'url("/images/sports.png")',
        backgroundSize: 120,
      }}
    >
      <div className="w-full h-full bg-my-green-dark/50 py-10 flex flex-col justify-around items-center ">
        <Card className="text-center bg-my-green-dark/90 p-8 rounded-md h-fit">
          <h1 className="text-my-yellow-light text-[3rem]">Sportsball</h1>
          <Button
            variant="link"
            type="button"
            onClick={() => setShowLogin((prev) => !prev)}
            className="text-xs text-my-yellow-light underline hover:text-my-yellow-base"
          >
            {showLogin ? "Switch to Signup" : "Switch to login"}
          </Button>
          {showLogin ? <LoginForm /> : <SingUpForm />}
        </Card>
      </div>
    </div>
  );
}
