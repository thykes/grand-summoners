export default function PageHeader({ title, subtitle, onBackClick, backButtonText }) {
  return (
    <header className="text-center mb-10 w-full">
      {onBackClick && (
        <div className="mb-6">
          <button onClick={onBackClick} className="btn-secondary">
            ← {backButtonText || 'Back'}
          </button>
        </div>
      )}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text 
                 bg-gradient-to-r from-cyan-300 to-fuchsia-500 mb-2 drop-shadow-lg">
        {title}
      </h1>
      {subtitle && <h2 className="text-xl font-semibold text-gray-400">{subtitle}</h2>}
    </header>
  );
}