import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import { mattresses, specLabels } from '../data/mattresses.js';

export default function Compare() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="مقایسه مدل‌ها"
        title="SIMBA · HAPPY · ROYAL · PREMIUM"
        subtitle="ویژگی‌های هر مدل را در کنار هم مشاهده کنید و مدل مناسب خود را پیدا کنید."
      />

      {/* Model header cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {mattresses.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-3xl p-5 text-center"
            style={{ borderColor: `${m.color}40` }}
          >
            <span
              className="block w-3 h-3 rounded-full mx-auto mb-3"
              style={{ backgroundColor: m.color, boxShadow: `0 0 10px ${m.color}` }}
            />
            <h3 className="font-black text-lg">{m.name}</h3>
            <p className="text-xs text-ash mt-1">{m.tagline}</p>
          </motion.div>
        ))}
      </div>

      {/* Spec comparison bars */}
      <div className="glass rounded-3xl p-6 md:p-10 space-y-8">
        {Object.entries(specLabels).map(([key, label]) => (
          <div key={key}>
            <h4 className="text-sm font-semibold text-ash mb-3">{label}</h4>
            <div className="grid grid-cols-4 gap-4">
              {mattresses.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: m.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.specs[key]}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs text-ash text-center">{m.specs[key]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Firmness + price quick table */}
      <div className="overflow-x-auto mt-10">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-ash border-b border-white/10">
              <th className="py-3 text-right font-medium">مشخصه</th>
              {mattresses.map((m) => (
                <th key={m.id} className="py-3 text-center font-bold" style={{ color: m.color }}>
                  {m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-4 text-ash">سطح سفتی (۱ نرم - ۵ سفت)</td>
              {mattresses.map((m) => (
                <td key={m.id} className="py-4 text-center">{m.firmness} / ۵</td>
              ))}
            </tr>
            <tr>
              <td className="py-4 text-ash">رده قیمتی</td>
              {mattresses.map((m) => (
                <td key={m.id} className="py-4 text-center">{'$'.repeat(m.price)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
