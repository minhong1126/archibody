import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/common/main-logo.png';

type DesktopHeaderProps = {
  menuItems: {
    label: string;
    href: string;
  }[];
};

const desktopMenuGap: number[] = [83, 64, 83, 0];

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  return (
    <div className="relative flex h-24 w-full items-center justify-center px-[150px]">
      <Link href="/" aria-label="홈으로 이동">
        <Image width={48} height={48} src={logo} alt="logo" />
      </Link>
      <nav className="mx-auto flex items-center">
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            style={{ marginRight: desktopMenuGap[index] + 'px' }}
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
