import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/en");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>Welcome, {user?.name || user?.email}!</p>
      <pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
      <a 
        href="/api/auth/signout" 
        className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </a>
    </div>
  );
}
