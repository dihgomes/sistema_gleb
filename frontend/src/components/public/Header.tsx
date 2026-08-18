export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 py-8 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white rounded-3xl p-2 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-105" style={{ border: '2px solid rgba(16, 185, 129, 0.3)' }}>
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)' }}></div>
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
