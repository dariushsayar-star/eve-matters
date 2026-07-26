import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import MattressExploded from '../three/MattressExploded.jsx';
import { mattressLayers } from '../data/layers.js';
import { useSound } from '../hooks/useSound.js';

export default function Structure() {
  const [activeLayerId, setActiveLayerId] = useState(null);
  const { playClick } = useSound();
  const activeLayer = mattressLayers.find((l) => l.id === activeLayerId);

  const handleSelect = (id) => {
    playClick();
    setActiveLayerId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="px-6 md:px-12 pb-20 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="ساختار سه‌بعدی"
        title="نمای انفجاری تشک"
        subtitle="تشک را با انگشت یا ماوس بچرخانید و روی هر لایه ضربه بزنید تا اطلاعات آن را ببینید."
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[55vh] min-h-[420px] glass rounded-3xl overflow-hidden relative">
          <MattressExploded onLayerClick={handleSelect} activeLayerId={activeLayerId} />
          <span className="absolute bottom-4 right-4 text-xs text-ash/70 tracking-wide">
            کشیدن برای چرخش · اسکرول برای زوم
          </span>
        </div>

        {/* Layer list / info panel */}
        <div className="glass rounded-3xl p-6 flex flex-col gap-2 max-h-[55vh] min-h-[420px] overflow-y-auto no-scrollbar">
          <h3 className="text-lg font-bold mb-2">لایه‌های تشک</h3>
          {mattressLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleSelect(layer.id)}
              className={`w-full text-right px-4 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 border
                ${activeLayerId === layer.id ? 'border-gold/50 bg-gold/10' : 'border-transparent hover:bg-white/5'}`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: layer.color, boxShadow: `0 0 8px ${layer.color}` }}
              />
              <span className="flex-1">
                <span className="block font-semibold text-sm">{layer.title}</span>
                <span className="block text-xs text-ash">{layer.subtitle} · {layer.thickness}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail modal for the selected layer */}
      <AnimatePresence>
        {activeLayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
            onClick={() => setActiveLayerId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="glass-gold rounded-3xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setActiveLayerId(null)}
                className="absolute top-5 left-5 text-ash hover:text-gold transition-colors"
                aria-label="بستن"
              >
                <FiX size={22} />
              </button>
              <span
                className="inline-block w-12 h-12 rounded-2xl mb-4"
                style={{ backgroundColor: activeLayer.color, boxShadow: `0 0 24px ${activeLayer.color}80` }}
              />
              <h3 className="text-2xl font-black">{activeLayer.title}</h3>
              <p className="text-ash text-xs tracking-widest uppercase mt-1">
                {activeLayer.subtitle} · ضخامت {activeLayer.thickness}
              </p>
              <p className="text-ivory/85 mt-4 leading-relaxed">{activeLayer.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
