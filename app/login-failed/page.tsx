import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in failed",
};

export default function LoginFailedPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 font-sans">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Sign-in failed
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Your sign-in link was invalid or expired.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Try again
      </Link>
    </main>
  );
}
