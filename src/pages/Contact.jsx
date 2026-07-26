import { motion } from 'framer-motion';
import { FiPhone, FiInstagram, FiGlobe, FiMapPin } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';

const contacts = [
  { icon: FiPhone, label: 'تماس تلفنی', value: '۰۲۱-۱۲۳۴۵۶۷۸' },
  { icon: FiInstagram, label: 'اینستاگرام', value: '@evematters' },
  { icon: FiGlobe, label: 'وب‌سایت', value: 'www.evematters.com' },
  { icon: FiMapPin, label: 'آدرس شوروم', value: 'تهران، خیابان ولیعصر، مرکز خرید لوکس' }
];

export default function Contact() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading eyebrow="در ارتباط باشید" title="با ما تماس بگیرید" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl overflow-hidden h-[360px] relative flex items-center justify-center"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(244,196,48,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,196,48,0.08) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />
          <div className="relative flex flex-col items-center gap-3 text-center px-6">
            <FiMapPin size={40} className="text-gold" />
            <p className="text-ash text-sm">نقشه گوگل در نسخه نهایی در این محل جای‌گذاری می‌شود</p>
          </div>
        </motion.div>

        {/* Contact details + QR */}
        <div className="flex flex-col gap-4">
          {contacts.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="flex items-center gap-4 py-5">
                <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                  <c.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-ash">{c.label}</p>
                  <p className="font-semibold">{c.value}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          <GlassCard className="flex items-center gap-5 py-6">
            <div className="w-20 h-20 rounded-2xl bg-white/90 grid grid-cols-4 grid-rows-4 p-1.5 gap-0.5 shrink-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className={`${[1, 3, 4, 6, 9, 11, 12, 14].includes(i) ? 'bg-void' : 'bg-transparent'} rounded-[1px]`} />
              ))}
            </div>
            <div>
              <p className="font-semibold">اسکن برای دنبال کردن</p>
              <p className="text-ash text-xs mt-1">کد QR نمادین — برای نسخه نهایی تصویر واقعی جایگزین شود</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
