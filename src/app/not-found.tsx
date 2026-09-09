import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex-1 flex items-center justify-center py-24 px-4 bg-white">
      <div className="w-full max-w-md text-center">
        <p className="text-[12px] font-bold uppercase tracking-[1px] text-[#6960C5] mb-3">
          Ошибка 404
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif] mb-3">
          Страница не найдена
        </h1>
        <p className="text-[#6a7282] text-sm mb-8">
          Такой страницы не существует — возможно, ссылка устарела или в адресе опечатка.
        </p>

        <Link
          href="/"
          className="inline-block rounded-[18px] bg-[#1b1b1b] text-white px-6 py-3 text-[14px] font-bold uppercase tracking-[1px] hover:opacity-85 transition-opacity"
        >
          На главную
        </Link>
      </div>
    </section>
  );
}