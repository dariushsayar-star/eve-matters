import { NavLink } from 'react-router-dom';
import { FiHome, FiCpu, FiLayers, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { useSound } from '../hooks/useSound.js';

const links = [
  { to: '/home', label: 'خانه', icon: FiHome },
  { to: '/technology', label: 'فناوری', icon: FiCpu },
  { to: '/structure', label: 'ساختار', icon: FiLayers },
  { to: '/body-analysis', label: 'تحلیل بدن', icon: FiActivity },
  { to: '/compare', label: 'مقایسه', icon: FiBarChart2 }
];

export default function BottomNav() {
  const { playClick } = useSound();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-x-0 border-b-0 flex justify-around py-2 px-2">
      {links.map(function (link) {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={playClick}
            className={function (props) {
              const isActive = props.isActive;
              const base = 'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] transition-colors ';
              return base + (isActive ? 'text-gold' : 'text-ash');
            }}
          >
            <Icon size={18} />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
