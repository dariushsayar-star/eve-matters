import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiAward,
  FiCpu,
  FiLayers,
  FiUserCheck,
  FiBarChart2,
  FiShield,
  FiPhone,
  FiSettings
} from 'react-icons/fi';
import { useSound } from '../hooks/useSound.js';

const links = [
  { to: '/home', label: 'خانه', icon: FiHome },
  { to: '/brand', label: 'برند', icon: FiAward },
  { to: '/technology', label: 'فناوری', icon: FiCpu },
  { to: '/structure', label: 'ساختار تشک', icon: FiLayers },
  { to: '/recommendation', label: 'پیشنهاد هوشمند', icon: FiUserCheck },
  { to: '/compare', label: 'مقایسه', icon: FiBarChart2 },
  { to: '/warranty', label: 'گارانتی', icon: FiShield },
  { to: '/contact', label: 'تماس', icon: FiPhone }
];

export default function Navbar() {
  const { playClick, playHover } = useSound();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-10 py-4
      glass border-x-0 border-t-0">
      <NavLink to="/home" onClick={playClick} className="flex items-center gap-2 shrink-0">
        <span className="text-xl md:text-2xl font-black tracking-widest gold-text">EVE</span>
        <span className="text-xs md:text-sm text-ash tracking-[0.3em]">MATTERS</span>
      </NavLink>

      <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={playClick}
            onMouseEnter={playHover}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300
              ${isActive ? 'bg-gold/15 text-gold border border-gold/40' : 'text-ash hover:text-ivory border border-transparent'}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      <NavLink
        to="/settings"
        onClick={playClick}
        className={({ isActive }) =>
          `p-2.5 rounded-full border transition-colors ${isActive ? 'border-gold text-gold' : 'border-white/15 text-ash hover:text-gold hover:border-gold/50'}`
        }
        aria-label="تنظیمات"
      >
        <FiSettings size={18} />
      </NavLink>
    </nav>
  );
}
