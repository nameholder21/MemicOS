'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
  const { data: session } = useSession();

  const { setSignInModalOpen } = useGlobalContext();

  if (session) {
    redirect('/');
  } else {
    setSignInModalOpen(true);
  }

  return <div className="flex min-h-screen items-center justify-center" />;
}
