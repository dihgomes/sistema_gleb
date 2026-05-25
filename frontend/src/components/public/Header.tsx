export default function Header() {
  return (
    <header className="bg-gray-100 py-6 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
        {/* Logo GLEB */}
        <div className="w-20 h-20 sm:w-24 sm:h-24">
          <img
            src="/logo.png"
            alt="GLEB Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold tracking-wide uppercase leading-tight text-blue-800">
            Grande Loja Maçônica do Estado da Bahia
          </h1>
          <p className="mt-1.5 text-base sm:text-lg text-gray-600 tracking-wide font-medium">
            Validação Carteira GLEB
          </p>
        </div>
      </div>
    </header>
  );
}
