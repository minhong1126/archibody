import { IoLogoInstagram, IoLogoYoutube } from 'react-icons/io';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import blogIcon from '@/public/common/blog-icon.png';

const ADDRESSES = [
  { label: '서울', value: '논현로2길 57 대진빌딩 203호' },
  { label: '원주', value: '강원도 원주시 섭재삼보길 160-15' },
];

const CONTACTS = [
  { label: 'T', value: '010-2338-6557' },
  { label: 'E', value: 'architecturebody@gmail.com' },
];

type SocialLink = {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  image?: StaticImageData;
};

const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://www.instagram.com/archibody/', icon: IoLogoInstagram },
  { href: 'https://blog.naver.com/archibody', image: blogIcon },
  {
    href: 'https://www.youtube.com/@%EB%AA%B8%EA%B1%B4%EC%B6%95',
    icon: IoLogoYoutube,
  },
];

const MainFooter = () => {
  return (
    <footer className="relative px-8 pt-20 pb-10 lg:p-20">
      <div className="flex flex-col gap-6 text-[#949494] lg:absolute lg:inset-x-20 lg:top-2/3 lg:-translate-y-1/2 lg:flex-row lg:justify-between">
        <div className="flex flex-col text-[clamp(10px,1.2vw,20px)] whitespace-nowrap lg:w-2/3 lg:flex-row lg:justify-between lg:gap-10">
          <dl className="order-2 flex flex-col lg:order-1">
            <dt className="hidden text-[#686868] lg:block">주소</dt>
            {ADDRESSES.map(({ label, value }) => (
              <dd key={label}>
                {label} ㅣ {value}
              </dd>
            ))}
          </dl>
          <dl className="order-1">
            <dt className="text-[#686868]">대표 ㅣ 임보라</dt>
          </dl>
          <dl className="order-3 flex flex-col lg:order-2">
            {CONTACTS.map(({ label, value }) => (
              <dd key={label}>
                {label}. {value}
              </dd>
            ))}
          </dl>

          <dl className="order-3 pt-8 lg:mt-auto lg:self-end">
            <dt className="text-[clamp(9px,1vw,18px)]">
              © 2026. 건축사사무소 몸. All rights reserved.
            </dt>
          </dl>
        </div>

        <div className="order-4 flex items-center gap-3.5 lg:gap-4 lg:self-center">
          {SOCIAL_LINKS.map(({ href, icon: Icon, image }) => (
            <Link key={href} href={href} target="_blank">
              {Icon ? (
                <Icon className="size-3.5 text-[#949494] lg:size-8" />
              ) : (
                image && (
                  <div className="size-3.5 lg:size-8">
                    <Image
                      src={image}
                      alt="blog icon"
                      width={30}
                      height={30}
                      className="size-full"
                    />
                  </div>
                )
              )}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
