import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { FileText } from 'lucide-react';

const notoSansKr = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'AI Job Matcher - 맞춤형 합격 자소서 생성기',
  description: '채용 공고를 분석하고 내 경험을 매칭하여 완벽한 자기소개서를 완성하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} bg-white text-slate-900 antialiased min-h-screen flex flex-col`}>
        <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-900 text-white p-2 rounded-lg shadow-sm">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900">AI 맞춤형 자소서</h1>
            </div>
            <nav className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <a href="#" className="hover:underline">사용 가이드(없음)</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} AI Job Matcher.</p>
          <p className="mt-1">Powered by Google Gemini 3.0 Flash</p>
        </footer>
      </body>
    </html>
  );
}
