export function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Soft gradient ambient orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-400/40 animate-pulse"
            style={{
              width: `${(i % 3) * 3 + 4}px`,
              height: `${(i % 3) * 3 + 4}px`,
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
              animationDuration: `${3 + (i % 4) * 2}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
