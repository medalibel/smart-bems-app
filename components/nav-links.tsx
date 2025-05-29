'use client'
import {
  Cog6ToothIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Real Time', href: '/', icon: HomeIcon },
  {
    name: 'Usage History',
    href: '/history',
    icon: ClockIcon,
  },
  { name: 'Forecasting', href: '/forecasting', icon: ArrowTrendingUpIcon },
  { name: 'Reports', href: '/reports', icon: ClipboardDocumentListIcon },
  { name: 'Bills', href: '/bills', icon: BanknotesIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function NavLinks() {
  const pathName = usePathname()
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={
              clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-bold hover:bg-[#189AB4] hover:text-[#FDB750] md:flex-none md:justify-start md:p-2 md:px-3",
                {'bg-[#189AB4] text-[#FDB750]': pathName === link.href,},
                {'bg-white': pathName!== link.href,}
              )
            }
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
