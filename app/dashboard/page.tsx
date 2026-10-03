import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 font-sans">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Dashboard
        </h1>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="h-10 rounded-full border border-black/[.08] px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">You are signed in.</p>
    </main>
  );
}
