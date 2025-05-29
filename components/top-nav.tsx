'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Real Time', href: '/',  },
  {
    name: 'Usage History',
    href: '/history',
    
  },
  { name: 'Forecasting', href: '/forecasting', },
  { name: 'Reports', href: '/reports',  },
  { name: 'Bills', href: '/bills',  },
  { name: 'Settings', href: '/settings',  },
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
