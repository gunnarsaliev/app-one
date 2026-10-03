const API_URL = "https://api-app-one-tau.vercel.app/api";

export type Country = {
  id: number;
  name: string;
  shortDescription: string;
  population: number;
  updatedAt: string;
  createdAt: string;
};

type PaginatedDocs<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export async function getCountries(): Promise<Country[]> {
  const res = await fetch(
    `${API_URL}/countries?depth=2&draft=false&trash=false&limit=100&sort=name`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) throw new Error(`Failed to fetch countries: ${res.status}`);
  const data: PaginatedDocs<Country> = await res.json();
  return data.docs;
}

export async function getCountry(id: string): Promise<Country | null> {
  // The API responds 500 (not 404) for non-numeric IDs
  if (!/^\d+$/.test(id)) return null;
  const res = await fetch(
    `${API_URL}/countries/${encodeURIComponent(id)}?depth=2&draft=false&trash=false`,
    { next: { revalidate: 60 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch country ${id}: ${res.status}`);
  return res.json();
}
