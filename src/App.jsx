import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Splash from './pages/Splash.jsx';
import Home from './pages/Home.jsx';
import Brand from './pages/Brand.jsx';
import Technology from './pages/Technology.jsx';
import Structure from './pages/Structure.jsx';
import Recommendation from './pages/Recommendation.jsx';
import BodyAnalysis from './pages/BodyAnalysis.jsx';
import Compare from './pages/Compare.jsx';
import Warranty from './pages/Warranty.jsx';
import Contact from './pages/Contact.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/structure" element={<Structure />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/body-analysis" element={<BodyAnalysis />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
