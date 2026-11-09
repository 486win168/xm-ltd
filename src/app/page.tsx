import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-50">
        <div className="text-2xl font-bold text-[#002b5b]">XM <span className="text-gray-400">Global</span></div>
        <div className="hidden md:flex gap-6 font-medium text-gray-600">
          <Link href="#" className="hover:text-blue-900">交易</Link>
          <Link href="#" className="hover:text-blue-900">洞察市場</Link>
          <Link href="#" className="hover:text-blue-900">福利活動</Link>
          <Link href="#" className="hover:text-blue-900">關於我們</Link>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="px-4 py-2 text-gray-700 hover:text-blue-900">登入</Link>
          <Link href="/open-account" className="bg-[#002b5b] text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors">立即開始</Link>
        </div>
      </nav>

      <main className="relative h-[80vh] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img src="https://cloud.xm-cdn.com/web/xmbz/ng-public/assets/img/home/hero/mountain.webp" className="w-full h-full object-cover opacity-30" alt="background" />
        </div>
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#002b5b] leading-tight mb-6">
            超過 2,000 萬名交易者<br/>選擇 XM
          </h1>
          <p className="text-xl text-gray-600 mb-10">執行速度快、點差低，讓您的交易事半功倍。</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/open-account" className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-orange-600 transition shadow-lg">
              立即開戶領取贈金
            </Link>
            <Link href="#" className="bg-white text-gray-800 border border-gray-300 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-50 transition">
              了解更多
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
