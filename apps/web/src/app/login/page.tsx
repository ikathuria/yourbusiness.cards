import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Already signed in → go to the dashboard.
  const user = await getCurrentUser();
  if (user) redirect(next ?? "/dashboard");

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-6 text-ink">
      <Link
        href="/"
        className="mb-8 font-display text-xl font-extrabold tracking-tight text-ink no-underline"
      >
        yourbusiness<span className="text-brand">.cards</span>
      </Link>
      <div className="rounded-2xl border-2 border-ink bg-paper p-8 shadow-[6px_6px_0_0_#161320]">
        <h1 className="font-display mb-1 text-2xl font-extrabold">Welcome</h1>
        <p className="mb-6 text-sm font-medium text-ink/60">
          Sign in or create an account to build your cards.
        </p>
        <AuthForm next={next ?? "/dashboard"} />
      </div>
    </main>
  );
}
