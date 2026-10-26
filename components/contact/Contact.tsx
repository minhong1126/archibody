type ContactItem = { key: string; value: string; href?: string };
type ContactGroup = { title: string; items: ContactItem[] };

const CONTACT_GROUPS: ContactGroup[] = [
  {
    title: '주소',
    items: [
      { key: 'O', value: '서울 논현로2길 57 대진빌딩 203호' },
      { key: 'H', value: '강원 원주시 섭재삼보길 160-15' },
    ],
  },
  {
    title: '문의',
    items: [
      { key: 'T', value: '010-2338-6557', href: 'tel:010-2338-6557' },
      {
        key: 'E',
        value: 'architecturebody@gmail.com',
        href: 'mailto:architecturebody@gmail.com',
      },
    ],
  },
];

const Contact = () => {
  return (
    <section className="w-full px-[10%] py-20 lg:pt-24">
      <div className="mx-auto grid max-w-sm grid-cols-1 lg:max-w-265 lg:grid-cols-[minmax(0,606fr)_minmax(0,384fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10 xl:gap-x-[70px]">
        <h2 className="section-title lg:text-left">건축사사무소 몸</h2>

        <div className="mt-15 aspect-[326/189] w-full overflow-hidden bg-zinc-100 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:aspect-[606/449]">
          지도지도
        </div>

        <div className="mt-9 flex flex-col gap-8 lg:col-start-2 lg:row-start-2 lg:mt-12 lg:gap-10">
          {CONTACT_GROUPS.map(({ title, items }) => (
            <div key={title}>
              <h3 className="leading-1.6 text-[clamp(12px,10px+0.52vw,20px)] font-medium text-neutral-400">
                {title}
              </h3>
              <dl className="mt-2 flex flex-col lg:mt-1">
                {items.map(({ key, value, href }) => (
                  <div
                    key={key}
                    className="leading-1.6 flex gap-[0.8em] text-[clamp(12px,10px+0.52vw,20px)]"
                  >
                    <dt className="w-[1em] shrink-0 font-semibold text-zinc-800">
                      {key}
                    </dt>
                    <dd className="min-w-0 break-all text-zinc-600">
                      {href ? (
                        <a
                          href={href}
                          className="hover:text-zinc-800 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
