import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginOrSignup, logout } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const REDIRECT_THROW = new Error("NEXT_REDIRECT");

describe("loginOrSignup", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
    vi.mocked(redirect).mockReset();
    vi.mocked(redirect).mockImplementation(() => {
      throw REDIRECT_THROW;
    });
  });

  it("redirects to / when sign-in succeeds", async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: "u1", email: "u@x.com" } },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await expect(
      loginOrSignup({ email: "u@x.com", password: "ValidPass1!" }),
    ).rejects.toThrow(REDIRECT_THROW);

    expect(redirect).toHaveBeenCalledWith("/");
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "u@x.com",
      password: "ValidPass1!",
    });
  });

  it("calls signUp and redirects when credentials invalid and signUp succeeds", async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid login credentials" },
        }),
        signUp: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await expect(
      loginOrSignup({ email: "new@x.com", password: "ValidPass1!" }),
    ).rejects.toThrow(REDIRECT_THROW);

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@x.com",
      password: "ValidPass1!",
    });
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("returns signUp error when credentials invalid and signUp fails", async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid login credentials" },
        }),
        signUp: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Sign up failed" },
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await loginOrSignup({
      email: "new@x.com",
      password: "ValidPass1!",
    });

    expect(result).toEqual({ error: "Sign up failed" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns sign-in error for other errors (e.g. Email not confirmed)", async () => {
    const signInError = { message: "Email not confirmed" };
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: signInError,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await loginOrSignup({
      email: "u@x.com",
      password: "ValidPass1!",
    });

    expect(result).toEqual({ error: signInError });
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
    vi.mocked(redirect).mockReset();
    vi.mocked(revalidatePath).mockReset();
    vi.mocked(redirect).mockImplementation(() => {
      throw REDIRECT_THROW;
    });
  });

  it("calls signOut, revalidates layout, and redirects to /login", async () => {
    const mockSupabase = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await expect(logout()).rejects.toThrow(REDIRECT_THROW);

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("does not redirect when signOut fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockSupabase = {
      auth: {
        signOut: vi.fn().mockResolvedValue({
          error: new Error("Sign out failed"),
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await logout();

    expect(redirect).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
