import Link from 'next/link';

export default function OpenAccount() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="p-4 bg-white border-b">
        <Link href="/" className="text-xl font-bold text-[#002b5b]">XM </Link>
      </nav>
      
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-[#002b5b] text-center mb-2">開啟您的交易之門</h1>
        <p className="text-center text-gray-500 mb-8">只需 30 秒，即可完成申請</p>
        
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-500 mb-1">名字</label>
              <input type="text" className="border p-3 rounded-lg focus:border-blue-500 outline-none shadow-sm" placeholder="請輸入名字" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-500 mb-1">姓氏</label>
              <input type="text" className="border p-3 rounded-lg focus:border-blue-500 outline-none shadow-sm" placeholder="請輸入姓氏" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-500 mb-1">電子郵件</label>
            <input type="email" className="border p-3 rounded-lg focus:border-blue-500 outline-none shadow-sm" placeholder="example@email.com" />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-500 mb-1">手機號碼</label>
            <div className="flex">
              <input type="text" value="+886" readOnly className="border p-3 rounded-l-lg bg-gray-100 w-20 text-center" />
              <input type="tel" className="border p-3 rounded-r-lg focus:border-blue-500 outline-none shadow-sm flex-1" placeholder="請輸入手機號碼" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-500 mb-1">設定密碼</label>
            <input type="password" className="border p-3 rounded-lg focus:border-blue-500 outline-none shadow-sm" placeholder="請設定交易帳戶密碼" />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-xs text-blue-600 leading-relaxed">
            點擊「立即申請」表示您同意我們使用電子郵件與您聯繫，並同意我們的法律條款。
          </div>
          
          <button type="submit" className="w-full bg-[#002b5b] text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition shadow-md">
            立即申請
          </button>
        </form>
      </div>
    </div>
  );
}
