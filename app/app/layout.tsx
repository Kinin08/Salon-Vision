import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="ml-64 transition-all duration-300">
        <Topbar />
        <article className="p-6">
          {children}
        </article>
      </main>
    </section>
  );
}
