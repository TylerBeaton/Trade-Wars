'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default async function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <div>
      <h1>User ID: {params.id}</h1>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
}
