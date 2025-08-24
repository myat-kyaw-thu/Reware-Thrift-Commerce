'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const links = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Orders',
    href: '/user/orders',
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex items-center space-x-1 lg:space-x-2', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out',
            pathname.includes(item.href)
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-slate-100/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          )}
        >

          {pathname.includes(item.href) && (
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 dark:from-slate-100 dark:via-gray-200 dark:to-zinc-100 opacity-10 animate-pulse" />
          )}
          <span className="relative z-10">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
