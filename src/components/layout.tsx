import { Geist, Geist_Mono } from 'next/font/google';
import '@/components/globals.css';
import Navbar from './navbar';
import { Theme } from '@radix-ui/themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased m-4 mt-18`}>
      <Theme accentColor="violet">
        <Navbar className="fixed top-0 left-0 w-full shadow-xl" />
        {children}
      </Theme>
    </div>
  );
}
