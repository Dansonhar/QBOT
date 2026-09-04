const stats = [
  { val: '14', tag: 'MODULES', label: 'One platform. No third-party bolt-ons.' },
  { val: '30%', tag: 'MORE REVENUE', label: 'Average revenue increase from Sales Boosters.' },
  { val: '3-in-1', tag: 'DEVICE', label: 'Counter, mobile, and kiosk from one device.' },
  { val: '2×', tag: 'SPEED', label: 'Faster service with self-ordering.' },
];

export default function StatsBar() {
  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-2xl md:text-[36px] font-extrabold text-white leading-[1.12] tracking-tight text-center mb-12">
          Built different. Built to last.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.tag} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.val}</p>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.15em] mb-1.5">{s.tag}</p>
              <p className="text-[12px] text-white/40 leading-[1.5]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
