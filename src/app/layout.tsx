import Navbar from '@/components/navbar';
import { Theme } from '@radix-ui/themes';
import '@/styles/globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased m-4 mt-18">
      <Theme accentColor="violet">
        <Navbar className="fixed top-0 left-0 w-full shadow-xl" />
        <main>{children}</main>
      </Theme>
    </div>
  );
}
