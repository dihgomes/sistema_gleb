export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-8 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full p-3 shadow-xl">
          <img
            src="/santacasa-icon.png"
            alt="Santa Casa Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-3xl font-bold tracking-wide uppercase leading-tight text-white drop-shadow-lg whitespace-nowrap">
            SANTA CASA DE RUY BARBOSA
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-medium tracking-wide">
            Sistema de Validação de Carteiras
          </p>
        </div>
      </div>
    </header>
  );
}
