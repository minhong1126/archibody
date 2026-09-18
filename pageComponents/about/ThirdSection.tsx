import Image from 'next/image';
import aboutOwner from '@/public/about/about-owner.png';

type CareerItem = {
  year: string;
  role: string;
  dot: string;
};

const careerItems: CareerItem[] = [
  {
    year: '2020 ~',
    role: '건축사사무소 몸 대표',
    dot: 'bg-[#666666]',
  },
  {
    year: '2015 - 2019',
    role: '건축디자인그룹 몸 대표',
    dot: 'bg-[#9D9D9D]',
  },
  {
    year: '2013 - 2014',
    role: '살둔제로에너지하우스 협력 설계',
    dot: 'bg-[#CFCFCF]',
  },
  {
    year: '2008 - 2012',
    role: '정림건축종합건축사사무소 근무',
    dot: 'bg-[#E0E0E0]',
  },
];

const ThirdSection = () => {
  return (
    <section className="flex w-full flex-col gap-[clamp(1.5rem,5vw,3rem)] pt-[clamp(2.5rem,6vw,5rem)] lg:px-[clamp(1.25rem,5vw,3rem)]">
      <div className="text-font-main flex flex-col items-center gap-[clamp(0.25rem,1vw,0.5rem)]">
        <span className="text-center text-[clamp(0.75rem,1.4vw,1.5rem)] font-semibold">
          대표
        </span>
        <span className="text-center text-[clamp(17px,2vw,30px)] font-semibold">
          건축사 임보라
        </span>
      </div>

      <div className="flex w-full items-center gap-[clamp(1.5rem,4vw,2.5rem)] lg:justify-center">
        <div className="hidden shrink-0 lg:block">
          <Image
            src={aboutOwner}
            alt="건축사 임보라"
            className="block h-auto max-h-100 w-[clamp(200px,20vw,350px)] object-cover"
            priority
          />
        </div>

        <div className="flex flex-col items-start px-[10%] lg:px-0">
          {careerItems.map((item, index) => (
            <div key={item.year} className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="flex h-[clamp(1.125rem,2vw,1.875rem)] items-center">
                  <div
                    className={`size-[clamp(0.5rem,0.8vw,0.75rem)] shrink-0 rounded-full ${item.dot}`}
                  />
                </div>
              </div>

              <div
                className={`flex flex-col items-start gap-2 pb-[clamp(1rem,1vw,2rem)] ${
                  index === careerItems.length - 1 ? 'pb-0' : ''
                }`}
              >
                <p
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] leading-[clamp(1.125rem,2vw,1.875rem)] font-semibold ${
                    index === 0 ? 'text-[#525252]' : 'text-[#6E6E6E]'
                  }`}
                >
                  {item.year}
                </p>

                <p
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] font-medium ${
                    index === 0 ? 'text-[#3F3F3F]' : 'text-[#6C6C6C]'
                  }`}
                >
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
