export default function YouTubeSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-[34px] lg:text-[40px] font-extrabold text-black leading-[1.15] tracking-tight mb-4">
            See QPOS in action
          </h2>
          <p className="text-[15px] text-gray-400 leading-[1.7] max-w-xl mx-auto">
            Watch how one device replaces your entire counter — from POS to kiosk to mobile ordering.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full overflow-hidden bg-black rounded-lg shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/Y8GNPc3yAxo?rel=0&modestbranding=1&enablejsapi=1"
              title="QPOS Product Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
