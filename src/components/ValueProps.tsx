export default function ValueProps() {
  return (
    <section className="relative py-12 md:py-24 bg-white border-t border-gray-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-20">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-black mb-4 md:mb-8 leading-tight uppercase">
            Self-service and Automation solutions that custom-fit for your business.
          </h2>
          <p className="text-base md:text-xl lg:text-2xl font-bold text-black uppercase">
            ALL AT AFFORDABLE PRICING
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300">
          {[
            {
              title: 'SAVE STAFF COST',
              desc: 'NO MORE RM2,500-RM4,000 SALARIES PLUS OVERTIME',
            },
            {
              title: 'REDUCE HEADCOUNT',
              desc: 'USE STAFF ONLY WHERE REQUIRED',
            },
            {
              title: 'ACCEPT ALL PAYMENTS',
              desc: 'CREDIT CARDS, TNG, BOOST, GRABPAY AND MORE',
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`p-6 md:p-10 bg-white ${
                index !== 2 ? 'md:border-r border-b md:border-b-0 border-gray-300' : ''
              }`}
            >
              <h3 className="text-lg md:text-2xl font-black text-black mb-2 md:mb-4 uppercase">
                {item.title}
              </h3>
              <p className="text-sm md:text-base font-bold text-black uppercase leading-tight">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
