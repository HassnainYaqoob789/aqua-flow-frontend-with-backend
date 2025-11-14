import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";

import ClientProvider from "@/components/ClientProvider";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "Aqua Flow",
  description: "Next.js + React Query setup",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
