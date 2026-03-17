import { Card } from "@/components/ui/card";

interface CheckEmailCardProps {
  email: string;
}

export default function CheckEmailCard({ email }: CheckEmailCardProps) {
  return (
    <div className="bg-my-green-base text-my-yellow-light flex flex-col justify-center items-center">
      <Card className="p-4 text-center">
        <p className="font-semibold text-lg text-black">Please check your email</p>
        <p className="my-2 text-my-green-dark font-bold">{email}</p>
        <p className="text-sm text-gray-500">To finalize your login</p>
      </Card>
    </div>
  );
}