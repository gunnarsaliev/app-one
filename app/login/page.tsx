import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasValidSession, safeReturnTo, SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const returnTo = safeReturnTo(typeof next === "string" ? next : undefined);

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (hasValidSession(token)) redirect(returnTo);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16 font-sans">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Sign in
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        app-one uses your Krotost account. You&apos;ll be sent to
        auth.krotost.com to sign in and then brought back here.
      </p>
      <a
        href={`/auth/login?next=${encodeURIComponent(returnTo)}`}
        className="mt-8 flex h-12 items-center justify-center rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Continue with Krotost
      </a>
    </main>
  );
}
