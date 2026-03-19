import LogoutButton from "@/components/auth/LogoutButton";
import EventsListSkeleton from "@/components/Stats/EventsListSkeleton";
import NewEvents from "@/components/Stats/NewEvents";
import SearchAndFilter from "@/components/Stats/SearchAndFilter";
import Stats from "@/components/Stats/Stats";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ search?: string; sport?: string }>;
};

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params?.search ?? "";
  const sport = params?.sport ?? "";

  return (
    <div style={{ backgroundImage: 'url("/images/sportsball.png")', backgroundSize: 'cover' }}>
      <main className="flex w-full flex-col items-center justify-around py-32  sm:px-10 md:px-16">
        <Card className="text-center text-3xl bg-my-green-dark/50 p-8 rounded-md h-fit w-full flex flex-col items-center gap-4">
          <h1 className="text-center text-3xl">Sportsball</h1>
          <Suspense fallback={<div className="h-9 w-full max-w-md animate-pulse rounded-md bg-muted" />}>
            <SearchAndFilter search={search} sport={sport} />
          </Suspense>
          <Suspense key={`${search}-${sport}`} fallback={<EventsListSkeleton />}>
            <Stats search={search} sport={sport} />
          </Suspense>
          <NewEvents isEditing={false} event={null} />
        </Card>
      </main>
      <LogoutButton />
    </div>
  );
}
