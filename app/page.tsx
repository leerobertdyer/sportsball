import LogoutButton from "@/components/auth/LogoutButton";
import Stats from "@/components/dashboards/Stats";

export default function Home() {
  return (
    <div className="" >
      <main className="flex w-full flex-col items-center justify-around py-32 px-16">
        <h1 className="text-center text-3xl">Sportsball</h1>
        <Stats />
      </main>
        <LogoutButton />
    </div>
  );
}
