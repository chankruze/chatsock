import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-24">
      This is the protected page!
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
