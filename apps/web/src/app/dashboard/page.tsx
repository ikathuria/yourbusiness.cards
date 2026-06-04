import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/supabase/auth";
import { getTemplate } from "@/templates/registry";
import { Sticker } from "@/components/site/Sticker";
import { CardRowActions } from "./CardRowActions";
import { signOut, togglePublish, deleteCard } from "./actions";

export const metadata: Metadata = { title: "Dashboard" };

type CardRow = {
  id: string;
  slug: string;
  template_id: string;
  business_name: string;
  published: boolean;
  updated_at: string;
};

export default async function DashboardPage() {
  const account = await getAccount();
  if (!account) redirect("/login");

  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("business_cards")
    .select("id, slug, template_id, business_name, published, updated_at")
    .eq("account_id", account.id)
    .order("updated_at", { ascending: false })
    .returns<CardRow[]>();

  const list = cards ?? [];

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      {/* Header */}
      <header className="border-b-2 border-ink bg-paper-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-ink no-underline">
            yourbusiness<span className="text-brand">.cards</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-semibold text-ink/60">{account.email}</span>
              <span className="rounded-md border-2 border-ink bg-mint px-2 py-0.5 text-xs font-extrabold uppercase">
                {account.plan}
              </span>
            </span>
            <form action={signOut}>
              <button className="rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-sm font-extrabold text-ink transition-transform hover:-translate-y-0.5">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Your cards</h1>
            <p className="mt-1 text-sm font-medium text-ink/60">
              {list.length} card{list.length === 1 ? "" : "s"}
            </p>
          </div>
          <Sticker href="/dashboard/new" variant="primary" size="md">
            + New card
          </Sticker>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-ink/40 bg-paper-2 p-12 text-center">
            <p className="font-display text-xl font-extrabold">No cards yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-ink/60">
              Create your first digital business card — pick a template and make it yours.
            </p>
            <div className="mt-6 flex justify-center">
              <Sticker href="/dashboard/new" variant="ink" size="md">
                Create your first card
              </Sticker>
            </div>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {list.map((card) => {
              const template = getTemplate(card.template_id);
              return (
                <li
                  key={card.id}
                  className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-paper-2 p-5 shadow-[4px_4px_0_0_#161320] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-lg font-extrabold">{card.business_name}</h2>
                      <span
                        className={`rounded-md border-2 border-ink px-2 py-0.5 text-[0.65rem] font-extrabold uppercase ${
                          card.published ? "bg-mint text-ink" : "bg-paper text-ink/60"
                        }`}
                      >
                        {card.published ? "Live" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-ink/50">
                      /c/{card.slug} · {template?.name ?? card.template_id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <CardRowActions slug={card.slug} published={card.published} />
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={card.id} />
                      <input type="hidden" name="published" value={(!card.published).toString()} />
                      <button className="rounded-lg border-2 border-ink bg-brand px-3 py-1.5 text-xs font-extrabold text-white transition-transform hover:-translate-y-0.5">
                        {card.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteCard}>
                      <input type="hidden" name="id" value={card.id} />
                      <button className="rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-xs font-extrabold text-coral transition-transform hover:-translate-y-0.5">
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
