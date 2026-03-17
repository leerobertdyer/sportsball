"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import CheckEmailCard from "@/components/auth/CheckEmailCard";
import { loginSchema, onSubmit } from "@/components/auth/utils";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [checkEmail, setCheckEmail] = useState(false);

  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (checkEmail) return <CheckEmailCard email={form.getValues().email} />;

  function submitCallback() {
    setCheckEmail(true);
    toast("Please check your email to confirm login.");
  }

  function handleSubmit() {
    onSubmit({
      email: form.getValues().email,
      password: form.getValues().password,
      callBack: submitCallback,
    });
  }
  return (
    <Form {...form}>
      <form
        suppressHydrationWarning
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-80 bg-white p-4 rounded-md"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="you@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}