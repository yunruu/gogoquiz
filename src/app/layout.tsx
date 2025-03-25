import Navbar from '@/components/navbar';
import { Theme } from '@radix-ui/themes';
import '@/styles/globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        <Theme accentColor="violet">
          <Navbar className="w-full shadow-xl mb-4" />
          <main className="px-4">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
