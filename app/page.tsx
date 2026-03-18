import LogoutButton from "@/components/auth/LogoutButton";
import NewEvents from "@/components/Stats/NewEvents";
import Stats from "@/components/Stats/Stats";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="">
      <main className="flex w-full flex-col items-center justify-around py-32 px-16">
        <Card className="text-center text-3xl bg-my-green-dark p-8 rounded-md h-fit w-full flex flex-col items-center">
          <h1 className="text-center text-3xl">Sportsball</h1>
          <Stats />
          <NewEvents isEditing={false} event={null}/>
        </Card>
      </main>
      <LogoutButton />
    </div>
  );
}
