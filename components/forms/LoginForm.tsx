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
import { Card } from "@/components/ui/card";
import { loginOrSignup } from "@/app/auth/actions";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(30, { message: "Password must be at most 30 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  });

const schema = z
  .object({
    email: z.string().email("Please use a valid email"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const [checkEmail, setCheckEmail] = useState(false);

  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    const resp = await loginOrSignup(values);
    if (resp.error?.toString().includes("Email not confirmed")) {
      console.log(resp.error);
      setCheckEmail(true);
      toast("Please check your email to confirm login.");
    }
  }

  if (checkEmail)
    return (
      <div className="bg-my-green-base text-my-yellow-light flex flex-col justify-center align-center">
        <Card className="p-4 text-center">
          <p>Please check your email</p>
          <p>{form.getValues().email}</p>
          <p>To finalize your login</p>
        </Card>
      </div>
    );

  return (
    <Form {...form}>
      <form 
        suppressHydrationWarning
        onSubmit={form.handleSubmit(onSubmit)}
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Login / Signup
        </Button>
      </form>
    </Form>
  );
}
