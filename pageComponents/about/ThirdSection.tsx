import Image from 'next/image';
import aboutOwner from '@/public/about/about-owner.png';

type CareerItem = {
  year: string;
  role: string;
  dot: string;
  titleColor: string;
  descColor: string;
};

const careerItems: CareerItem[] = [
  {
    year: '2020 ~',
    role: '건축사사무소 몸 대표',
    dot: 'bg-stone-500',
    titleColor: 'text-neutral-600',
    descColor: 'text-neutral-700',
  },
  {
    year: '2015 - 2019',
    role: '건축디자인그룹 몸 대표',
    dot: 'bg-neutral-400',
    titleColor: 'text-neutral-500',
    descColor: 'text-neutral-500',
  },
  {
    year: '2013 - 2014',
    role: '살둔제로에너지하우스 협력 설계',
    dot: 'bg-stone-300',
    titleColor: 'text-neutral-500',
    descColor: 'text-neutral-500',
  },
  {
    year: '2008 - 2012',
    role: '정림건축종합건축사사무소 근무',
    dot: 'bg-neutral-200',
    titleColor: 'text-neutral-500',
    descColor: 'text-neutral-500',
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

      <div className="flex w-full gap-[clamp(1.5rem,4vw,2.5rem)] lg:justify-center">
        <div className="hidden shrink-0 self-stretch lg:flex">
          <Image
            src={aboutOwner}
            alt="건축사 임보라"
            className="h-full w-auto object-contain"
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
                <span
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] leading-[clamp(1.125rem,2vw,1.875rem)] font-semibold ${item.titleColor}`}
                >
                  {item.year}
                </span>
                <div
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] font-medium ${item.descColor}`}
                >
                  {item.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
