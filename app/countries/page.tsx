import type { Metadata } from "next";
import Link from "next/link";
import { getCountries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Countries",
};

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 font-sans">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Countries
      </h1>
      {countries.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No countries found.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {countries.map((country) => (
            <li key={country.id}>
              <Link
                href={`/countries/${country.id}`}
                className="block h-full rounded-xl border border-black/[.08] p-5 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                <h2 className="text-lg font-medium text-black dark:text-zinc-50">
                  {country.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Population: {country.population.toLocaleString("en-US")}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {country.shortDescription}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
