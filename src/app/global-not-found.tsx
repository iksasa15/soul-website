import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Logo } from "@/components/brand/Logo";

const readex = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--font-readex" });

export const metadata: Metadata = {
  title: "404 | SOUL",
  description: "الصفحة غير موجودة — Page not found",
};

const theme = `(function(){try{var t=localStorage.getItem("soul-theme"),d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(_){}})()`;

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={readex.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body className="grid min-h-dvh place-items-center bg-bg p-6 text-center font-display text-fg">
        <div>
          <Logo variant="mark" className="mx-auto size-24" />
          <p className="mt-6 text-7xl font-semibold text-gradient" dir="ltr">
            404
          </p>
          <h1 className="mt-4 text-2xl font-semibold">الصفحة غير موجودة</h1>
          <p className="mt-1 text-muted" lang="en" dir="ltr">
            Page not found
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/ar" className="rounded-full bg-sky px-5 py-2.5 text-sm font-semibold text-white">
              العودة إلى الرئيسية
            </Link>
            <Link href="/en" lang="en" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold">
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
