"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type User = {
  id: string;
  created_at: string;
  email: string;
};

function toUserMessage(error: unknown): string {
  const msg =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof (error as { message?: string })?.message === "string"
          ? (error as { message: string }).message
          : String(error);
  if (msg.includes("Invalid login credentials")) return "Invalid email or password.";
  if (msg.includes("User already registered") || msg.includes("already been registered"))
    return "An account with this email already exists. Try logging in.";
  if (msg.includes("Password should be at least")) return "Password must be at least 6 characters.";
  if (msg.includes("Unable to validate email address")) return "Please use a valid email address.";
  return msg;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data.user) {
    redirect("/");
  }
  return { error: toUserMessage(signInError) };
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) return { error: toUserMessage(signUpError.message) };
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Logout Error:", error);
    return;
  }
  revalidatePath("/", "layout"); // crucial for removing stale cookie data (next js aggressive caching issue)
  redirect("/login");
}