import { useState, useEffect } from 'react';

// --- SVGs Icons (Lucide Style) ---
const IconArrowRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const IconStar = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconClock = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconHome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconWand = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>
);
const IconQr = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
);
const IconUser = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconX = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const IconCalculator = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);

export default function App() {
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [clientData, setClientData] = useState<any>(null);
  
  // Registration Form
  const [regName, setRegName] = useState('');
  const [regBrand, setRegBrand] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Product Modal Data
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [calcWidth, setCalcWidth] = useState('100');
  const [calcHeight, setCalcHeight] = useState('100');
  const [calcInstallation, setCalcInstallation] = useState(false);
  const [calcPlastificado, setCalcPlastificado] = useState(false);

  // QR Modal
  const [qrText, setQrText] = useState('');
  const [qrImageSrc, setQrImageSrc] = useState('');

  useEffect(() => {
    // Check if user is registered
    const data = localStorage.getItem('ultra_client_data');
    if (data) {
      setClientData(JSON.parse(data));
      setWelcomeVisible(false);
    }
  }, []);

  const handleStart = () => {
    setWelcomeVisible(false);
    if (!clientData) setActiveModal('register');
  };

  const handleRegisterSubmit = () => {
    if (!regName || !regBrand || !regPhone) {
      alert('Por favor completa todos los campos');
      return;
    }
    const data = { name: regName, brand: regBrand, phone: regPhone, registeredAt: new Date().toISOString() };
    localStorage.setItem('ultra_client_data', JSON.stringify(data));
    setClientData(data);
    setActiveModal(null);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      localStorage.removeItem('ultra_client_data');
      setClientData(null);
      setActiveModal(null);
    }
  };

  const openProduct = (title: string, img1: string, isVinyl: boolean = false) => {
    setSelectedProduct({ title, img1, isVinyl });
    setActiveModal('product');
  };

  const generateQr = () => {
    if (!qrText.trim()) return;
    setQrImageSrc(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`);
  };

  const calculatePrice = () => {
    const width = parseFloat(calcWidth) || 0;
    const height = parseFloat(calcHeight) || 0;
    
    if (width > 0 && height > 0) {
      const areaM2 = (width * height) / 10000;
      let total = 0;
      if (selectedProduct?.isVinyl) {
        let basePrice = calcPlastificado ? 55000 : 35000;
        total = areaM2 * basePrice;
        if (calcInstallation) total += areaM2 * 17000;
      } else {
        total = areaM2 * 50000;
        if (calcInstallation) total += areaM2 * 15000;
      }
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total);
    }
    return '$0';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-primary/30 pb-32">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
      </div>

      {/* Welcome Overlay */}
      {welcomeVisible && (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
          <div className="text-center mb-16 px-4">
            <p className="text-white/60 text-lg md:text-2xl font-medium tracking-[0.2em] uppercase mb-4 animate-fade-in-up transition-opacity">Ingresa al futuro de</p>
            <h1 className="text-7xl md:text-9xl font-display font-black leading-none animate-ultra-reveal drop-shadow-2xl flex flex-col md:flex-row items-center">
              <span className="text-white">Ultra</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-[#FF8C42] to-yellow-500 ml-0 md:ml-4">Graphic</span>
            </h1>
          </div>
          <button 
            onClick={handleStart}
            className="group relative flex items-center gap-4 px-10 py-5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(242,125,38,0.5)] group-hover:shadow-[0_0_30px_rgba(242,125,38,0.8)] transition-all z-10">
              <IconArrowRight size={22} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-[0.3em] uppercase text-white/90 group-hover:text-white transition-colors z-10">Iniciar</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="px-4 pt-6 pb-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto glass-nav rounded-full px-2 py-2 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-yellow-500 p-[2px] shadow-lg shadow-primary/20">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9dbXCLX0LwICy_lfT6QHQKT4sSKxvKC0zl3lxT9e2giqf_Y5CO6SHu8YMNAnHPSe_Vfmi1_9NMCmYcdJ3oDHQfcfhcNalQnMSNzj6IdfqCGoc84H3f5q3HcxYUk8KHGPjCI2fVLxgNgCmqTwVGO3Y9qXSf1fhgut85W8v4qPywTVhyphenhyphentFiy8vSNFFn_aY9/s3543/DWDAWDAWD.png" alt="Logo" className="w-full h-full object-cover rounded-full bg-black" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-white">Ultra</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">Graphic</span>
          </h1>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </header>

      {/* Featured Section */}
      <section className="py-6 relative z-10 max-w-7xl mx-auto">
        <div className="px-6 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Catálogo Estelar</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Calidad que impacta</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 pb-8 snap-x snap-mandatory scroll-container">
          {/* Card 1 */}
          <div onClick={() => openProduct('Avisos Acrílico 3D', 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop', false)}
               className="relative min-w-[350px] md:min-w-[500px] h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop" alt="Avisos" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <span className="backdrop-blur-md bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white px-4 py-2 rounded-full border border-white/20">Acrilico</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-display font-bold text-3xl leading-none mb-3 drop-shadow-lg">Avisos Acrílico 3D</h4>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-80">
                <div className="flex items-center gap-2"><IconStar className="text-yellow-400" /> <span className="font-bold">4.9</span> <span className="text-xs">(124+)</span></div>
                <div className="flex items-center gap-2 font-medium"><IconClock size={14} /> <span>2D Ent.</span></div>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div onClick={() => openProduct('Impresión de Vinilo', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', true)}
               className="relative min-w-[350px] md:min-w-[500px] h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" alt="Vinilo" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <span className="backdrop-blur-md bg-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary px-4 py-2 rounded-full border border-primary/30">Láser HR</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-display font-bold text-3xl leading-none mb-3 drop-shadow-lg">Impresión de Vinilo</h4>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-80">
                <div className="flex items-center gap-2"><IconStar className="text-yellow-400" /> <span className="font-bold">5.0</span> <span className="text-xs">(89+)</span></div>
                <div className="flex items-center gap-2 font-medium"><IconClock size={14} /> <span>24H Ent.</span></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div onClick={() => openProduct('Avisos Luminosos', 'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=800&auto=format&fit=crop', false)}
               className="relative min-w-[350px] md:min-w-[500px] h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=800&auto=format&fit=crop" alt="Luminosos Neo" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <span className="backdrop-blur-md bg-yellow-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/30">Neón Flex</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-display font-bold text-3xl leading-none mb-3 drop-shadow-lg">Letras Luminosas</h4>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-80">
                <div className="flex items-center gap-2"><IconStar className="text-yellow-400" /> <span className="font-bold">4.8</span> <span className="text-xs">(156+)</span></div>
                <div className="flex items-center gap-2 font-medium"><IconClock size={14} /> <span>4D Ent.</span></div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div onClick={() => openProduct('Pendones y Lonas', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', true)}
               className="relative min-w-[350px] md:min-w-[500px] h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop" alt="Pendones" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <span className="backdrop-blur-md bg-blue-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 px-4 py-2 rounded-full border border-blue-500/30">Gran Formato</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-display font-bold text-3xl leading-none mb-3 drop-shadow-lg">Pendones y Lonas</h4>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-80">
                <div className="flex items-center gap-2"><IconStar className="text-yellow-400" /> <span className="font-bold">4.7</span> <span className="text-xs">(230+)</span></div>
                <div className="flex items-center gap-2 font-medium"><IconClock size={14} /> <span>24H Ent.</span></div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div onClick={() => openProduct('Diseño Offset & Flyers', 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800&auto=format&fit=crop', false)}
               className="relative min-w-[350px] md:min-w-[500px] h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800&auto=format&fit=crop" alt="Papeleria" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <span className="backdrop-blur-md bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white px-4 py-2 rounded-full border border-white/20">Editorial</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="font-display font-bold text-3xl leading-none mb-3 drop-shadow-lg">Impresión Papelería</h4>
              <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-80">
                <div className="flex items-center gap-2"><IconStar className="text-yellow-400" /> <span className="font-bold">5.0</span> <span className="text-xs">(95+)</span></div>
                <div className="flex items-center gap-2 font-medium"><IconClock size={14} /> <span>3D Ent.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools / Pro Section */}
      <section className="py-6 relative z-10 max-w-7xl mx-auto">
        <div className="px-6 mb-4">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-1">Nuevos Lanzamientos</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Servicios Pro</p>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 pb-8 snap-x snap-mandatory scroll-container">
          <div onClick={() => openProduct('Tarjetas Elite', 'https://images.unsplash.com/photo-1589041127530-ebab8790089f?q=80&w=800&auto=format&fit=crop', false)} 
               className="relative min-w-[280px] md:min-w-[380px] h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1589041127530-ebab8790089f?q=80&w=800&auto=format&fit=crop" alt="Cards" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Tarjetas Elite</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Mate y Brillo UV</span>
            </div>
          </div>
          <div onClick={() => openProduct('Reconocimientos', 'https://images.unsplash.com/photo-1622668579708-25039f997cb6?q=80&w=800&auto=format&fit=crop', false)} 
               className="relative min-w-[280px] md:min-w-[380px] h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1622668579708-25039f997cb6?q=80&w=800&auto=format&fit=crop" alt="Awards" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Reconocimientos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Trofeos 3D</span>
            </div>
          </div>
          <div onClick={() => openProduct('Sellos Automáticos', 'https://images.unsplash.com/photo-1588147285627-7cdfc80c10b4?q=80&w=800&auto=format&fit=crop', false)} 
               className="relative min-w-[280px] md:min-w-[380px] h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1588147285627-7cdfc80c10b4?q=80&w=800&auto=format&fit=crop" alt="Sellos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Sellos Automáticos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Trodat / Colop</span>
            </div>
          </div>
          <div onClick={() => openProduct('Carnets PVC', 'https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=800&auto=format&fit=crop', false)} 
               className="relative min-w-[280px] md:min-w-[380px] h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=800&auto=format&fit=crop" alt="Identificacion" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Carnets Alta Calidad</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">PVC y Lanyards</span>
            </div>
          </div>
          <div onClick={() => openProduct('Mugs Personalizados', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop', false)} 
               className="relative min-w-[280px] md:min-w-[380px] h-[260px] md:h-[320px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop" alt="Mugs" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Mugs y Termos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Sublimación Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none">
        <nav className="bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-6 py-3 flex gap-8 md:gap-12 items-center pointer-events-auto">
          <button onClick={() => setActiveTab('home')} className={`relative p-2 transition-all duration-300 ${activeTab === 'home' ? 'text-primary' : 'text-white/40 hover:text-white/80'}`}>
            <IconHome size={22} className={activeTab === 'home' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
            {activeTab === 'home' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,125,38,1)]" />}
          </button>
          
          <button onClick={() => setActiveModal('removeBg')} className={`relative p-2 transition-all duration-300 ${activeModal === 'removeBg' ? 'text-primary' : 'text-white/40 hover:text-white/80'}`}>
            <IconWand size={22} className={activeModal === 'removeBg' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
          </button>

          <button onClick={() => setActiveModal('qr')} className={`relative p-2 transition-all duration-300 ${activeModal === 'qr' ? 'text-primary' : 'text-white/40 hover:text-white/80'}`}>
            <IconQr size={22} className={activeModal === 'qr' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
          </button>

          <button onClick={() => { setActiveTab('user'); setActiveModal(clientData ? 'profile' : 'register'); }} 
                  className={`relative p-2 transition-all duration-300 ${activeTab === 'user' ? 'text-primary' : 'text-white/40 hover:text-white/80'}`}>
            <IconUser size={22} className={activeTab === 'user' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
            {activeTab === 'user' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,125,38,1)]" />}
          </button>
        </nav>
      </div>

      {/* --- Modals --- */}
      
      {/* Block background for all modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] transition-opacity" onClick={() => setActiveModal(null)}></div>
      )}

      {/* Register Modal */}
      {activeModal === 'register' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up pointer-events-auto">
            <div className="p-8 pb-6 border-b border-white/5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-500"></div>
              <h3 className="font-display font-bold text-white text-2xl mb-1">Crea tu Cuenta</h3>
              <p className="text-sm text-white/50">Únete a Ultra Graphic y accede a cotizaciones.</p>
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <input type="text" placeholder="Nombre de Empresa / Personal" value={regName} onChange={e => setRegName(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-primary/50 outline-none rounded-xl py-4 px-5 text-white transition-colors" />
              <input type="text" placeholder="Correo Electrónico" value={regBrand} onChange={e => setRegBrand(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-primary/50 outline-none rounded-xl py-4 px-5 text-white transition-colors" />
              <input type="tel" placeholder="Tu Teléfono (WhatsApp)" value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/[^0-9\s+]/g, ''))} className="w-full bg-white/5 border border-white/10 focus:border-primary/50 outline-none rounded-xl py-4 px-5 text-white transition-colors" />
              <button onClick={handleRegisterSubmit} className="w-full bg-gradient-to-r from-primary to-yellow-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(242,125,38,0.4)] hover:shadow-[0_0_30px_rgba(242,125,38,0.6)] active:scale-95 transition-all mt-4">
                Completar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === 'profile' && clientData && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center animate-fade-in-up pointer-events-auto relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-yellow-500 p-1 mb-6 shadow-[0_0_20px_rgba(242,125,38,0.4)]">
              <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                 <span className="text-3xl font-display font-bold text-white">{clientData.name.substring(0,2).toUpperCase()}</span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">{clientData.name}</h3>
            <p className="text-white/40 font-medium mb-8 text-sm">{clientData.brand}</p>
            
            <button onClick={handleLogout} className="w-full py-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all">
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {activeModal === 'qr' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up pointer-events-auto">
            <div className="p-6 border-b border-white/5 relative">
              <h3 className="font-display font-bold text-white text-xl flex items-center gap-2"><IconQr className="text-primary"/> Generador QR</h3>
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <input type="text" placeholder="https://ejemplo.com" value={qrText} onChange={e => setQrText(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateQr()} 
                     className="w-full bg-white/5 border border-white/10 focus:border-primary/50 outline-none rounded-xl py-4 px-5 text-white transition-colors text-sm" />
              <button onClick={generateQr} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all">
                Generar QR
              </button>
              {qrImageSrc && (
                <div className="flex flex-col items-center mt-6 p-6 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <img src={qrImageSrc} className="w-48 h-48 object-contain" alt="QR Code" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Remove BG Modal */}
      {activeModal === 'removeBg' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm flex flex-col items-center text-center p-8 animate-fade-in-up pointer-events-auto relative">
             <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
             <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(242,125,38,0.2)]">
               <IconWand size={32} className="text-primary" />
             </div>
             <h3 className="font-display font-bold text-2xl text-white mb-3">Magic Eraser</h3>
             <p className="text-sm text-white/50 mb-8 leading-relaxed">
               Sube cualquier imagen para remover el fondo al instante. <br/>(Función Pro, requiere integración API habilitada).
             </p>
             <button className="w-full bg-gradient-to-r from-primary to-[#E55A00] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(242,125,38,0.4)] hover:shadow-[0_0_30px_rgba(242,125,38,0.6)] transition-all">
               Subir Imagen
             </button>
          </div>
        </div>
      )}

      {/* Product View Modal */}
      {activeModal === 'product' && selectedProduct && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
          <div className="bg-[#111] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-5xl h-[85vh] md:h-[70vh] flex flex-col md:flex-row overflow-hidden shadow-2xl pointer-events-auto animate-fade-in-up">
             
             {/* Close Button */}
             <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-50 border border-white/10 hover:bg-white/10 transition-colors">
               <IconX size={20} />
             </button>

             {/* Image Side */}
             <div className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden bg-black shrink-0">
               <img src={selectedProduct.img1} alt={selectedProduct.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r" />
               <div className="absolute top-6 left-6">
                 <span className="backdrop-blur-md bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white px-4 py-2 rounded-full border border-white/20 shadow-lg">Ultra PRO</span>
               </div>
             </div>

             {/* Content Side */}
             <div className="flex-1 p-6 md:p-10 flex flex-col min-h-0 relative z-10 -mt-6 md:mt-0 bg-[#111] rounded-t-[2rem] md:rounded-none">
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                 <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">{selectedProduct.title}</h2>
                 <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6">El diseño moderno requiere materiales y acabados que resalten tu marca por encima del resto. Descubre por qué los expertos prefieren Ultra.</p>
                 
                 {/* Calculator Unit */}
                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-500 opacity-50"></div>
                   <h4 className="font-bold flex items-center gap-2 mb-5 text-white/90"><IconCalculator size={18} className="text-primary"/> Calculadora Inteligente</h4>
                   
                   <div className="grid grid-cols-2 gap-4 mb-5">
                     <div className="relative">
                       <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-2">Ancho (cm)</label>
                       <input type="number" value={calcWidth} onChange={(e) => setCalcWidth(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-white transition-colors input-transparent" />
                     </div>
                     <div className="relative">
                       <label className="block text-[10px] uppercase tracking-wider font-bold text-white/40 mb-2">Alto (cm)</label>
                       <input type="number" value={calcHeight} onChange={(e) => setCalcHeight(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-white transition-colors input-transparent" />
                     </div>
                   </div>

                   <div className="space-y-3 mb-6">
                     <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                       <span className="text-sm font-medium text-white/80">Incluir Instalación</span>
                       <input type="checkbox" checked={calcInstallation} onChange={(e) => setCalcInstallation(e.target.checked)} className="w-4 h-4 accent-primary" />
                     </label>
                     {selectedProduct.isVinyl && (
                       <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                         <span className="text-sm font-medium text-white/80">Plastificado Mate/Brillante</span>
                         <input type="checkbox" checked={calcPlastificado} onChange={(e) => setCalcPlastificado(e.target.checked)} className="w-4 h-4 accent-primary" />
                       </label>
                     )}
                   </div>

                   <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                     <div>
                       <span className="block text-[10px] uppercase font-bold text-white/40 mb-1">Costo Estimado</span>
                       <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">{calculatePrice()}</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Call to Action */}
               <button onClick={() => window.open(`https://wa.me/573027502695?text=Hola, quiero agendar mi: ${selectedProduct.title}`, '_blank')} 
                 className="mt-auto w-full group relative flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border border-white/10 shadow-xl transition-all active:scale-95 shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/20 to-[#1da851]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                 <span className="relative z-10">Cotizar Ext. WhatsApp</span> 
                 <svg className="w-5 h-5 relative z-10 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.94.57 3.75 1.54 5.3L2 22l4.82-1.46C8.36 21.46 10.12 22 11.99 22c5.52 0 10-4.48 10-10S17.51 2 11.99 2zm5.72 14.16c-.24.68-1.4 1.25-1.93 1.34-.44.07-.98.13-1.66-.08-1.57-.49-3.41-1.63-4.81-3.04-1.69-1.7-2.61-3.66-2.65-5.59-.03-1.4.67-2.13 1.01-2.5.34-.37.93-.46 1.23-.46.3 0 .59.01.85.03.28.02.66-.1.97.64.33.8 1.09 2.66 1.18 2.85.11.23.19.46.06.71-.12.24-.26.39-.51.64-.26.26-.52.61-.74.83-.2.2-.42.43-.19.82.23.39 1 1.63 2.12 2.62 1.45 1.29 2.67 1.69 3.07 1.88.4.19.64.16.88-.09.24-.25 1.05-1.22 1.34-1.64.28-.42.57-.35.94-.21.37.14 2.34 1.1 2.74 1.3.4.19.67.3.77.47.1.18.1.94-.14 1.61z"/></svg>
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

