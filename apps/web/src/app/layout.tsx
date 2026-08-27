import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Traffic Dashboard",
  description: "Country and vehicle traffic overview",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <div className="min-h-screen max-w-8xl mx-auto px-4 sm:px-6 py-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl mt-1 font-bold">
                Traffic Dashboard
              </h1>
              <p className="text-sm mt-1 text-textMuted">
                Country and vehicle activity across the network
              </p>
            </div>
          </header>
          <div className="w-full mb-6 border-t-2 border-dashed border-border" />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
