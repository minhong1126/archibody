import { IoLogoInstagram } from "react-icons/io";
import { IoLogoYoutube } from "react-icons/io";
import blogIcon from "@/public/common/blog-icon.png";
import Image from "next/image";
import Link from "next/link";

const MainFooter = () => {
  return (
    <footer className="h-60 relative px-20">
      <div className="flex absolute top-2/3 -translate-y-1/2 justify-between left-20 right-20">
        <div className="flex flex-col md:flex-row justify-between w-2/3 text-[#9E9E9E] text-xs whitespace-nowrap">
          <dl>
            <dt className="text-[#686868] mb-1">주소</dt>
            <dd>서울ㅣ논현로2길 57 대진빌딩 203호</dd>
            <dd>원주ㅣ강원도 원주시 섭재삼보길 160-15</dd>
          </dl>

          <dl>
            <dt className="text-[#686868] mb-1">대표 | 임보라</dt>
            <dd>T. 010-2338-6557</dd>
            <dd>E. architecturebody@gmail.com</dd>
          </dl>

          <dl className="self-end mt-auto">
            <dt className="text-[#686868]">
              © 2026. 건축사사무소 몸. All rights reserved.
            </dt>
          </dl>
        </div>

        <div className="flex gap-4 text-[#A9A9A9] self-center">
          <Link href="https://www.instagram.com/archibody/" target="_blank">
            <IoLogoInstagram size={30} />
          </Link>
          <div className="h-7.5 w-7.5">
            <Link href="https://blog.naver.com/archibody" target="_blank">
              <Image src={blogIcon} alt="blog icon" width={30} height={30} />
            </Link>
          </div>
          <Link
            href="https://www.youtube.com/@%EB%AA%B8%EA%B1%B4%EC%B6%95"
            target="_blank"
          >
            <IoLogoYoutube size={30} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
