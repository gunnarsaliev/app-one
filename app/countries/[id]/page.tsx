import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountry } from "@/lib/countries";

export async function generateMetadata({
  params,
}: PageProps<"/countries/[id]">): Promise<Metadata> {
  const { id } = await params;
  const country = await getCountry(id);
  return { title: country?.name ?? "Country not found" };
}

export default async function CountryPage({
  params,
}: PageProps<"/countries/[id]">) {
  const { id } = await params;
  const country = await getCountry(id);

  if (!country) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 font-sans">
      <Link
        href="/countries"
        className="text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
      >
        ← All countries
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {country.name}
      </h1>
      <p className="mt-2 text-zinc-500">
        Population: {country.population.toLocaleString("en-US")}
      </p>
      <p className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
        {country.shortDescription}
      </p>
    </main>
  );
}
