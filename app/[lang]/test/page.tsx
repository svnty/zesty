'use client';

import { useSupabaseSession } from '@/lib/supabase/client';

export default function Dashboard() {
  const { data: session, status, user } = useSupabaseSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please log in</p>;

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Last active: {user?.lastActive?.toString()}</p>
    </div>
  );
}