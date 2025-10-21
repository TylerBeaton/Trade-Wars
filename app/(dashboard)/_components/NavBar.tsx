import { Moon } from 'lucide-react';
import Link from 'next/link';

export function NavBar() {
  return (
    <div className="p-4 flex items-center justify-between">
      collapseButton
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard</Link>
        <Moon />
      </div>
    </div>
  );
}
