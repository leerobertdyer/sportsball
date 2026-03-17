import Stats from "@/components/dashboards/Stats";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        <h1 className="text-center text-3xl">Sportsball</h1>
        <Stats />
      </main>
    </div>
  );
}
