import "@/app/(portal)/portal.css";

export const metadata = {
  title: "EPOCH '26 Admin — Track Changes",
  description: "Admin panel for managing track change requests.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-root">
      {children}
    </div>
  );
}
