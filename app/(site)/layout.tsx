import Header from '@/components/common/header/Header';

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="min-h-0 w-full flex-1 overscroll-y-contain scroll-smooth pt-20 lg:h-screen lg:snap-y lg:snap-mandatory lg:overflow-hidden lg:overflow-y-scroll lg:pt-24">
        {children}
      </main>
    </>
  );
}
