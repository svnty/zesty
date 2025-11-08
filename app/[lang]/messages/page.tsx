"use client";

import { ChatList } from '@/components/chat-list';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';

export default function InboxPage() {
  const { data: session, status } = useSession();
  const { lang } = useParams();

  if (status === 'loading') {
    return <div className='container p-4 text-center justify-center mx-auto'>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect(`/${lang}`);
  }

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-8rem)] p-4">
      <ChatList />
    </div>
  );
}