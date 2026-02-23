import { Header } from "@/components/header";

export function LayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="mt-[72px] w-full" style={{ height: 'calc(100svh - 72px)' }}>
        {children}
      </main>
    </>
  );
}