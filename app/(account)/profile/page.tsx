'use client';
// filepath: app/(auth)/login/page.tsx
import { LoginForm } from '@/components/loginForm';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { is } from 'zod/v4/locales';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div>
            <h2 className="text-center text-3xl font-bold">Not Logged In</h2>
          </div>

          <p className="text-center text-sm text-gray-600">
            You must be logged in to view your profile.{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold">Profile</h2>
        </div>

        <ul className="text-center text-sm text-gray-600">
          <li>
            <span className="font-medium">
              Username: {session.user.username || 'N/A'}
            </span>
          </li>
          <li>
            <span className="font-medium"> Name: {session.user.name}</span>
          </li>
          <li>
            <span className="font-medium"> Email: {session.user.email}</span>
          </li>
          <li>
            <span className="font-medium">
              Email Verified?: {session.user.emailVerified ? 'Yes' : 'No'}
            </span>
          </li>
          <li>
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Home
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
