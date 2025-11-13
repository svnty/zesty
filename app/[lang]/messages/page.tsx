"use client";

import { ChatList } from '@/app/[lang]/messages/(client-renders)/chat-list';
import { toastManager } from '@/components/ui/toast';
import { useSupabaseSession } from '@/lib/supabase/client';
import { redirect, useParams, useRouter } from 'next/navigation';

export default function InboxPage() {
  const { data: session, status, user } = useSupabaseSession();
  const { lang } = useParams();
  const router = useRouter();

  if (status === 'loading') {
    return <div className='container p-4 text-center justify-center mx-auto'>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    toastManager.add({
      title: "Authentication Required",
      description: "Please log in to access your messages.",
      type: "warning",
    });
    router.push(`/${lang}`);
    return;
  }

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-8rem)] p-4">
      <ChatList />
    </div>
  );
}