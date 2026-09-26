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
  { label: '대표', value: '임보라', isTitle: true },
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
    <footer className="relative mt-20 px-9 py-10 lg:mt-40 lg:px-20 lg:py-0">
      <div className="flex flex-col gap-6 lg:absolute lg:inset-x-20 lg:top-2/3 lg:-translate-y-1/2 lg:flex-row lg:justify-between lg:gap-0">
        <div className="flex flex-col gap-2.5 text-[clamp(12px,2vw,16px)] whitespace-nowrap lg:w-2/3 lg:flex-row lg:justify-between">
          <dl className="order-2 flex flex-col gap-2.5 lg:order-1 lg:gap-0">
            <dt className="text-font-footer-description hidden lg:mb-1 lg:block">
              주소
            </dt>
            {ADDRESSES.map(({ label, value }) => (
              <dd key={label} className="text-font-footer-description flex">
                <span>
                  {label} ㅣ {value}
                </span>
              </dd>
            ))}
          </dl>

          <dl className="text-font-footer-description order-1 flex flex-col gap-2.5 lg:order-2 lg:gap-0">
            {CONTACTS.map(({ label, value, isTitle }) =>
              isTitle ? (
                <dt key={label} className="text-[#686868]">
                  <span>
                    {label} ㅣ {value}
                  </span>
                </dt>
              ) : (
                <dd key={label}>
                  {label}. {value}
                </dd>
              ),
            )}
          </dl>

          <dl className="order-3 lg:mt-auto lg:self-end">
            <dt className="text-font-footer-description text-[clamp(10px,2vw,16px)]">
              © 2026. 건축사사무소 몸. All rights reserved.
            </dt>
          </dl>
        </div>

        <div className="order-4 flex items-center gap-3.5 lg:gap-4 lg:self-center">
          {SOCIAL_LINKS.map(({ href, icon: Icon, image }) => (
            <Link key={href} href={href} target="_blank">
              {Icon ? (
                <Icon className="size-3.5 text-[#AAAAAA] lg:size-8" />
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
