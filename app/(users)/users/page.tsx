import { User } from '@/models';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const allUsers = await User.findAll();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul>
        {allUsers.map((user) => (
          <li key={user.id} className="mb-2">
            <Link
              href={`/users/${user.username}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {user.username || user.name || user.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
