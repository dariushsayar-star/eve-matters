import { motion } from 'framer-motion';
import { FiMoon, FiGlobe, FiSun, FiVolume2, FiMusic } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { useSettings } from '../hooks/useSettings.jsx';
import { useSound } from '../hooks/useSound.js';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${checked ? 'bg-gold justify-end' : 'bg-white/15 justify-start'}`}
    >
      <motion.span layout className="w-6 h-6 rounded-full bg-void shadow-md" />
    </button>
  );
}

export default function Settings() {
  const { settings, update } = useSettings();
  const { playClick } = useSound();

  return (
    <div className="px-6 md:px-12 pb-20 max-w-2xl mx-auto">
      <SectionHeading eyebrow="تنظیمات" title="شخصی‌سازی تجربه" align="right" />

      <div className="flex flex-col gap-4">
        <GlassCard className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <FiMoon className="text-gold" size={20} />
            <div>
              <p className="font-semibold">حالت تیره</p>
              <p className="text-ash text-xs">نمایش لوکس و کم‌نور برای شوروم</p>
            </div>
          </div>
          <Toggle checked={settings.darkMode} onChange={() => { playClick(); update({ darkMode: !settings.darkMode }); }} />
        </GlassCard>

        <GlassCard className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <FiGlobe className="text-gold" size={20} />
            <div>
              <p className="font-semibold">زبان</p>
              <p className="text-ash text-xs">فارسی / انگلیسی</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[{ id: 'fa', label: 'فارسی' }, { id: 'en', label: 'EN' }].map((l) => (
              <button
                key={l.id}
                onClick={() => { playClick(); update({ language: l.id }); }}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${settings.language === l.id ? 'border-gold text-gold bg-gold/10' : 'border-white/15 text-ash'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="py-5">
          <div className="flex items-center gap-4 mb-4">
            <FiSun className="text-gold" size={20} />
            <div>
              <p className="font-semibold">روشنایی نمایشگر</p>
              <p className="text-ash text-xs">{settings.brightness}%</p>
            </div>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            value={settings.brightness}
            onChange={(e) => update({ brightness: Number(e.target.value) })}
            className="w-full accent-gold"
          />
        </GlassCard>

        <GlassCard className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <FiVolume2 className="text-gold" size={20} />
            <div>
              <p className="font-semibold">صدای رابط کاربری</p>
              <p className="text-ash text-xs">کلیک، هاور و انتقال بین صفحات</p>
            </div>
          </div>
          <Toggle checked={settings.soundEnabled} onChange={() => update({ soundEnabled: !settings.soundEnabled })} />
        </GlassCard>

        <GlassCard className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <FiMusic className="text-gold" size={20} />
            <div>
              <p className="font-semibold">موسیقی پس‌زمینه</p>
              <p className="text-ash text-xs">پخش ملایم در حالت استندبای</p>
            </div>
          </div>
          <Toggle checked={settings.musicEnabled} onChange={() => update({ musicEnabled: !settings.musicEnabled })} />
        </GlassCard>
      </div>
    </div>
  );
}
