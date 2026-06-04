"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";

const initial: AuthState = {};

export function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <div className="w-full max-w-sm">
      {/* Mode toggle */}
      <div className="mb-6 flex gap-2 rounded-xl border-2 border-ink bg-paper-2 p-1 shadow-[3px_3px_0_0_#161320]">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg py-2 font-display text-sm font-extrabold transition-colors ${
              mode === m ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
            }`}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="font-display text-sm font-bold text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1.5 w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-ink outline-none focus:shadow-[3px_3px_0_0_#6d5ef7]"
            placeholder="you@business.com"
          />
        </div>
        <div>
          <label className="font-display text-sm font-bold text-ink" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            className="mt-1.5 w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-ink outline-none focus:shadow-[3px_3px_0_0_#6d5ef7]"
            placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          />
        </div>

        {state.error && (
          <p className="rounded-lg border-2 border-ink bg-coral/20 px-3 py-2 text-sm font-semibold text-ink">
            {state.error}
          </p>
        )}
        {state.notice && (
          <p className="rounded-lg border-2 border-ink bg-mint/20 px-3 py-2 text-sm font-semibold text-ink">
            {state.notice}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl border-2 border-ink bg-brand py-3 font-display font-extrabold text-white shadow-[4px_4px_0_0_#161320] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
