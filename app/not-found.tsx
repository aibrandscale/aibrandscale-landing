import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 text-center">
      <div className="max-w-lg">
        <div className="t-eyebrow mb-5"> 404 </div>
        <h1 className="t-section">Тази страница не съществува</h1>
        <p className="mt-5 text-white/70 leading-relaxed">
          Възможно е линкът да е изтрит или да е грешно изписан. Върни се към началото и виж безплатното обучение.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 cta-gradient text-white font-alfabet-sb uppercase tracking-[0.06em] px-7 py-4 rounded-full hover:opacity-95 transition-opacity duration-300 cursor-pointer"
        >
          Към началото
        </Link>
      </div>
    </main>
  );
}
