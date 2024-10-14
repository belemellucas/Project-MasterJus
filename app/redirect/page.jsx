// pages/redirect.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const RedirectPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      // Usuário não autenticado, redirecionar para a página inicial
      router.push('/');
    } else {
      // Usuário autenticado, redirecionar para a página de admin
      router.push('/admin');
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecionando...</p>
    </div>
  );
};

export default RedirectPage;
