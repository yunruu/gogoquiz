export interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  return (
    <div className={`bg-zinc-50 z-[1000] text-violet-800 font-bold h-14 flex items-center px-4 ${className}`}>
      gogoquiz
    </div>
  );
}
