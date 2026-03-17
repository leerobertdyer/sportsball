import LoginForm from "@/components/forms/LoginForm";

export default function Login() {
  return (
    <div
      className="w-full h-screen "
      style={{
        backgroundImage: 'url("/images/sports.png")',
        backgroundSize: 120,
      }}
    >
      <div className="w-full h-full bg-my-green-dark/50 py-10 flex flex-col justify-around items-center ">
        <h1 className="text-center text-3xl text-my-yellow-light bg-my-green-dark p-2 rounded-md">
          Sportsball
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
