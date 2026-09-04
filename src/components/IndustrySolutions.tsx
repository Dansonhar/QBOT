const industries = [
  { name: 'Café / Restaurant', caption: 'Counter, QR ordering, kitchen display, loyalty — all running from day one.', img: '/cover/cover-fnb.webp' },
  { name: 'Salon / Wellness', caption: 'Clients book, check in, and pay at the kiosk. You focus on service.', img: '/cover/cover-salon.webp' },
  { name: 'Gym / Sports', caption: 'Self-entry, membership scanning, and automated check-in.', img: '/cover/cover-gym.webp' },
  { name: 'Clinic', caption: 'Queue management, patient flow, and cashless payment.', img: '/cover/cover-clinic.webp' },
  { name: 'Hotel / Hospitality', caption: 'Guest self-check-in, F&B ordering, and room service from one system.', img: '/cover/cover-hotels.webp' },
  { name: 'Retail', caption: 'Counter POS, inventory tracking, and loyalty — for any store.', img: '/cover/cover-carwash.webp' },
];

export default function IndustrySolutions() {
  return (
    <section id="industry-solutions" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-[36px] lg:text-[42px] font-extrabold text-black leading-[1.12] tracking-tight mb-4">
            For everyone from cafés to clinics
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-xl mx-auto">
            Whether you run a restaurant, salon, gym, car wash, or hotel — QPOS adapts to how your business works. Same system. Configured for your industry.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {industries.map((ind) => (
            <div key={ind.name} className="group relative aspect-[4/3] overflow-hidden bg-gray-200">
              <img src={ind.img} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm md:text-base font-bold text-white mb-0.5">{ind.name}</h3>
                <p className="text-[11px] md:text-[12px] text-white/70 leading-[1.4]">{ind.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
