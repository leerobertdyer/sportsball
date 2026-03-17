"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type User = {
  id: string;
  created_at: string;
  email: string;
};

export async function loginOrSignup(values: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
  if (signInData.user) {
    redirect("/");
  }
  if (signInError?.message === "Invalid login credentials") {
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (signUpError) return { error: signUpError.message };
    return redirect("/");
  }
  return { error: signInError };
}
