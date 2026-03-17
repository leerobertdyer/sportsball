"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type User = {
  id: string;
  created_at: string;
  email: string;
};

export async function loginOrSignup({email, password}: { email: string, password: string}) {
  const supabase = await createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (signInData.user) {
    redirect("/");
  }
  if (signInError?.message === "Invalid login credentials") {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) return { error: signUpError.message };
    redirect("/");
  }
  return { error: signInError };
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