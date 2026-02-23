import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mt-[72px] w-full" style={{ height: 'calc(100svh - 72px)' }}>
        <div>Home Page Content</div>
      </main>
    </>
  );
}
