import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="ml-64 transition-all duration-300">
        <AdminTopbar />
        <article className="p-6">
          {children}
        </article>
      </main>
    </section>
  );
}
