import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SGSITS Anonymous | Ask Freely. Learn Better.',
  description:
    'Institutional Classroom Real-time Q&A Portal for Department of Information Technology, Shri G. S. Institute of Technology and Science, Indore',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F6F8FB] text-[#172033] antialiased">
        {/* Institutional Header Banner */}
        <header className="border-b border-slate-200 bg-white shadow-institutional sticky top-0 z-50">
          <div className="bg-[#0B1F3A] text-slate-200 text-xs py-1.5 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 font-medium tracking-wide">
              <span>SHRI G. S. INSTITUTE OF TECHNOLOGY AND SCIENCE, INDORE</span>
              <span className="text-slate-400">Autonomous Institute Estd. 1952 • NIRF Ranked</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white p-0.5 rounded-full border border-slate-200 shadow-sm">
                <Image
                  src="/sgsits-logo.png"
                  alt="SGSITS Indore Crest"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">
                    SGSITS <span className="text-[#1769AA]">Anonymous</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF3FB] text-[#1769AA] border border-[#1769AA]/20">
                    IT Department
                  </span>
                </div>
                <span className="text-xs text-[#667085] font-medium tracking-wide">
                  Ask Freely. Learn Better.
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-[#667085] bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#198754] animate-pulse"></span>
                <span>Academic Portal • Asia/Kolkata</span>
              </div>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1769AA] hover:bg-[#123B6D] rounded-md transition-colors shadow-sm"
              >
                Sign In / Demo
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Institutional Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 mt-auto text-xs text-[#667085]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Image
                src="/sgsits-logo.png"
                alt="SGSITS Crest"
                width={28}
                height={28}
                className="opacity-80 grayscale hover:grayscale-0 transition-all"
              />
              <div>
                <p className="font-semibold text-[#172033]">
                  Department of Information Technology
                </p>
                <p>Shri G. S. Institute of Technology & Science, Indore (M.P.) - 452003</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-[#1769AA]">Privacy Principles</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-[#1769AA]">Academic Integrity</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#198754] font-medium">Phase 1 Foundation Active</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
