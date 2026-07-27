import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import { mattresses, specLabels } from '../data/mattresses.js';

export default function Compare() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="مقایسه مدل‌ها"
        title="NO.1 · NO.2 · NO.3 · EMMA · SIMBA · HAPPY+"
        subtitle="ویژگی‌های هر مدل را در کنار هم مشاهده کنید و مدل مناسب خود را پیدا کنید."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {mattresses.map(function (m, i) {
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl p-5 text-center"
              style={{ borderColor: m.color + '40' }}
            >
              <span
                className="block w-3 h-3 rounded-full mx-auto mb-3"
                style={{ backgroundColor: m.color, boxShadow: '0 0 10px ' + m.color }}
              />
              <h3 className="font-black text-lg">{m.name}</h3>
              <p className="text-xs text-ash mt-1">{m.tagline}</p>
              <p className="text-xs text-gold mt-2">{m.warrantyYears} سال گارانتی</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-6 md:p-10 space-y-8">
        {Object.keys(specLabels).map(function (key) {
          return (
            <div key={key}>
              <h4 className="text-sm font-semibold text-ash mb-3">{specLabels[key]}</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {mattresses.map(function (m) {
                  return (
                    <div key={m.id} className="flex flex-col gap-2">
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: m.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: m.specs[key] + '%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs text-ash text-center">{m.specs[key]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-ash border-b border-white/10">
              <th className="py-3 text-right font-medium">مشخصه</th>
              {mattresses.map(function (m) {
                return (
                  <th key={m.id} className="py-3 text-center font-bold" style={{ color: m.color }}>
                    {m.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-4 text-ash">سطح سفتی (۱ نرم - ۵ سفت)</td>
              {mattresses.map(function (m) {
                return (
                  <td key={m.id} className="py-4 text-center">
                    {m.firmness} / ۵
                  </td>
                );
              })}
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-4 text-ash">ارتفاع تشک</td>
              {mattresses.map(function (m) {
return (
                  <td key={m.id} className="py-4 text-center">
                    {m.heightCm} سانتی‌متر
                  </td>
                );
              })}
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-4 text-ash">گارانتی</td>
              {mattresses.map(function (m) {
                return (
                  <td key={m.id} className="py-4 text-center">
                    {m.warrantyYears} سال
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-4 text-ash">رده قیمتی</td>
              {mattresses.map(function (m) {
                var dollars = '';
                for (var i = 0; i < m.price; i++) {
                  dollars += '$';
                }
                return (
                  <td key={m.id} className="py-4 text-center">
                    {dollars}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
