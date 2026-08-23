import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/common/main-logo.png';
import type { MenuItem } from '@/type/common/headerType';

type DesktopHeaderProps = {
  menuItems: MenuItem[];
};

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  return (
    <div className="relative flex h-24 w-full items-center justify-center px-[150px]">
      <Link href="/" aria-label="홈으로 이동">
        <Image width={48} height={48} src={logo} alt="logo" />
      </Link>
      <nav className="mx-auto flex items-center gap-20.75">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-center text-[20px] font-semibold"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DesktopHeader;
