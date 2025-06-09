'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Real Time', href: '/dashboard',  },
  {name: 'Usage History',href: '/dashboard/history',},
  { name: 'Forecasting', href: '/dashboard/forecasting', },
  { name: 'Reports', href: '/dashboard/reports',  },
  { name: 'Bills', href: '/dashboard/bills',  },
  { name: 'Settings', href: '/dashboard/settings',  },
];

export default function TopNav() {
  const pathName = usePathname()
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={
              clsx(" text-lg font-bold hover:text-[#FDB750]",
                {' text-[#FDB750]': pathName === link.href,},
                {' text-white': pathName !== link.href,}
              )
            }
          >
            <p >{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
