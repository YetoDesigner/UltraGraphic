import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logoutUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- SVGs Icons (Lucide Style) ---
const IconArrowRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const IconStar = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const IconClock = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconHome = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconWand = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" /></svg>
);
const IconQr = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
);
const IconUser = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const IconX = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const IconCalculator = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
);

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [clientData, setClientData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Product Modal Data
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // QR Modal
  const [qrText, setQrText] = useState('');
  const [qrImageSrc, setQrImageSrc] = useState('');

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Opcional: mostrar automáticamente el modal en Android/Desktop
      if (!sessionStorage.getItem('pwaPromptShown')) {
        setShowInstallModal(true);
        sessionStorage.setItem('pwaPromptShown', 'true');
      }
    });

    // Detectar iOS para PWA
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIos() && !isInStandaloneMode() && !sessionStorage.getItem('pwaPromptShown')) {
      setShowInstallModal(true);
      sessionStorage.setItem('pwaPromptShown', 'true');
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setClientData({
          name: user.displayName || 'Usuario',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });
      } else {
        setClientData(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fallback to pure native CSS scroll snapping for 120Hz maximum performance.

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setActiveModal(null);
    } catch (error) {
      alert("Error al iniciar sesión con Google");
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de cerrar sesión de Google?')) {
      await logoutUser();
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

      {/* Login Screen Overlay */}
      {(!clientData || authLoading) && (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center pointer-events-auto">
          {!authLoading ? (
            <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center animate-fade-in-up text-center p-8 m-4 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-yellow-500 p-[2px] shadow-[0_0_20px_rgba(242,125,38,0.5)] mb-4 animate-ultra-reveal">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9dbXCLX0LwICy_lfT6QHQKT4sSKxvKC0zl3lxT9e2giqf_Y5CO6SHu8YMNAnHPSe_Vfmi1_9NMCmYcdJ3oDHQfcfhcNalQnMSNzj6IdfqCGoc84H3f5q3HcxYUk8KHGPjCI2fVLxgNgCmqTwVGO3Y9qXSf1fhgut85W8v4qPywTVhyphenhyphentFiy8vSNFFn_aY9/s3543/DWDAWDAWD.png" alt="Logo" className="w-full h-full object-cover rounded-full bg-black border-[3px] border-[#111]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-black tracking-widest flex items-center gap-2 mb-2">
                <span className="text-white">Ultra</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">Graphic</span>
              </h1>
              <p className="text-sm text-white/50 mb-8">Inicia sesión con Google para acceder al catálogo exclusivo.</p>

              <button
                onClick={handleGoogleLogin}
                disabled={!termsAccepted}
                className={`w-full font-bold py-4 px-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 relative group overflow-hidden ${termsAccepted ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-95' : 'bg-white/20 text-white/50 cursor-not-allowed'}`}
              >
                <div className={`absolute inset-0 bg-black/5 translate-x-[-100%] ${termsAccepted ? 'group-hover:translate-x-[100%]' : ''} transition-transform duration-1000 ease-out`} />
                <svg className={`w-6 h-6 relative z-10 ${termsAccepted ? '' : 'opacity-50'}`} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                <span className="relative z-10 text-[15px] tracking-wide">Continuar con Google</span>
              </button>

              <label className="flex items-center justify-center gap-3 mt-6 text-sm text-white/70 cursor-pointer w-full text-left">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span>Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a></span>
              </label>

              {deferredPrompt && (
                <div className="mt-8 pt-6 border-t border-white/10 w-full animate-fade-in-up">
                  <p className="text-xs text-white/50 mb-3">Obtén la mejor experiencia instalando la app.</p>
                  <button
                    onClick={async () => {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') setDeferredPrompt(null);
                    }}
                    className="w-full bg-primary/20 text-primary border border-primary/30 font-bold py-3 px-6 rounded-full hover:bg-primary/30 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <IconHome size={18} /> Instalar la Aplicación
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#f27d26]"></div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="px-4 pt-6 pb-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto glass-nav rounded-full px-2 py-2 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-yellow-500 p-[2px] shadow-lg shadow-primary/20">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9dbXCLX0LwICy_lfT6QHQKT4sSKxvKC0zl3lxT9e2giqf_Y5CO6SHu8YMNAnHPSe_Vfmi1_9NMCmYcdJ3oDHQfcfhcNalQnMSNzj6IdfqCGoc84H3f5q3HcxYUk8KHGPjCI2fVLxgNgCmqTwVGO3Y9qXSf1fhgut85W8v4qPywTVhyphenhyphentFiy8vSNFFn_aY9/s3543/DWDAWDAWD.png" alt="Logo" className="w-full h-full object-cover rounded-full bg-black" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-white">Ultra</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">Graphic</span>
          </h1>
          <div className="flex justify-end pr-1 z-50">
            <button onClick={() => { setActiveTab('user'); setActiveModal(clientData ? 'profile' : 'register'); }}
              className="relative p-0 transition-transform duration-300 hover:scale-105 active:scale-95">
              {clientData?.photoURL ? (
                <img src={clientData.photoURL} alt="User" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-white/20 object-cover shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                  <IconUser size={18} className="text-white flex-shrink-0" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Section */}
      <section className="pt-4 pb-0 relative z-10 max-w-7xl mx-auto">
        <div className="px-6 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Catálogo Estelar</h2>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Calidad que impacta</p>
          </div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 px-6 pb-8 snap-x snap-mandatory scroll-container py-2">
          {/* Card 1 */}
          <div onClick={() => openProduct('Avisos Acrílico 3D', 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[350px] md:min-w-[500px] h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
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
            className="relative min-w-[350px] md:min-w-[500px] h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
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
            className="relative min-w-[350px] md:min-w-[500px] h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
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
            className="relative min-w-[350px] md:min-w-[500px] h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
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
            className="relative min-w-[350px] md:min-w-[500px] h-[480px] md:h-[550px] rounded-[2.5rem] overflow-hidden group bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.5)] snap-center shrink-0 cursor-pointer border border-white/10 hover:border-primary/30 transition-colors">
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
      <section className="pt-0 pb-0 relative z-10 max-w-7xl mx-auto">
        <div className="px-6 mb-4">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-1">Nuevos Lanzamientos</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Servicios Pro</p>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 px-6 pb-8 snap-x snap-mandatory scroll-container py-2">
          <div onClick={() => openProduct('Tarjetas Elite', 'https://images.unsplash.com/photo-1589041127530-ebab8790089f?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1589041127530-ebab8790089f?q=80&w=800&auto=format&fit=crop" alt="Cards" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Tarjetas Elite</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Mate y Brillo UV</span>
            </div>
          </div>
          <div onClick={() => openProduct('Reconocimientos', 'https://images.unsplash.com/photo-1622668579708-25039f997cb6?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1622668579708-25039f997cb6?q=80&w=800&auto=format&fit=crop" alt="Awards" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Reconocimientos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Trofeos 3D</span>
            </div>
          </div>
          <div onClick={() => openProduct('Sellos Automáticos', 'https://images.unsplash.com/photo-1588147285627-7cdfc80c10b4?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1588147285627-7cdfc80c10b4?q=80&w=800&auto=format&fit=crop" alt="Sellos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Sellos Automáticos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Trodat / Colop</span>
            </div>
          </div>
          <div onClick={() => openProduct('Carnets PVC', 'https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=800&auto=format&fit=crop" alt="Identificacion" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Carnets Alta Calidad</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">PVC y Lanyards</span>
            </div>
          </div>
          <div onClick={() => openProduct('Mugs Personalizados', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop" alt="Mugs" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Mugs y Termos</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Sublimación Pro</span>
            </div>
          </div>
          <div onClick={() => openProduct('Empaques Ecológicos', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" alt="Empaques Ecos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Cajas Ecológicas</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-green-400">Kraft & Cartón</span>
            </div>
          </div>
          <div onClick={() => openProduct('Ropa Corporativa', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop" alt="Ropa corporativa" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Ropa Corporativa</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">T-Shirts y Gorras</span>
            </div>
          </div>
          <div onClick={() => openProduct('Empaques de Lujo', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop" alt="Cajas de Lujo" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Empaques Elite</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Acabados Especiales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Third Scroll Section */}
      <section className="pt-0 pb-0 relative z-10 max-w-7xl mx-auto">
        <div className="px-6 mb-4">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-1">Tendencias Exclusivas</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FF8C42]">Novedades Premium</p>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 px-6 pb-8 snap-x snap-mandatory scroll-container py-2">
          <div onClick={() => openProduct('Brochures Premium', 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop" alt="Brochures" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Brochures Premium</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Diseño Editorial</span>
            </div>
          </div>
          <div onClick={() => openProduct('Stickers Troquelados', 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=800&auto=format&fit=crop" alt="Stickers" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Stickers Personalizados</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Corte a láser</span>
            </div>
          </div>
          <div onClick={() => openProduct('Bolsas Kraft Print', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" alt="Bolsas Kraft" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Bolsas Ecológicas</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Tintas Eco-Friendly</span>
            </div>
          </div>
          <div onClick={() => openProduct('Agendas Corporativas', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop" alt="Agendas" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Agendas Corporativas</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Tapa Dura & Cuero</span>
            </div>
          </div>
          <div onClick={() => openProduct('Sellos Secos', 'https://images.unsplash.com/photo-1620600020165-3733dd11795c?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1620600020165-3733dd11795c?q=80&w=800&auto=format&fit=crop" alt="Sellos Secos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Sellos en Relieve</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Papel y Documentos</span>
            </div>
          </div>
          <div onClick={() => openProduct('Fotografía Producto', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop" alt="Fotografia" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Fotografía de Producto</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-green-400">Estudio Profesional</span>
            </div>
          </div>
          <div onClick={() => openProduct('Diseño 3D', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop" alt="Render 3D" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Modelado y Render 3D</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Stands y Stands</span>
            </div>
          </div>
          <div onClick={() => openProduct('Instalaciones Profesionales', 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop', false)}
            className="relative min-w-[380px] md:min-w-[500px] h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden group border border-white/10 bg-card cursor-pointer shrink-0 snap-center shadow-2xl">
            <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop" alt="Instalaciones" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <h4 className="font-display font-bold text-xl md:text-2xl mb-1">Servicio de Instalación</h4>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">Trabajo en Alturas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none animate-fade-in-up transition-transform duration-700">
        <nav className="bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-8 py-3 flex gap-12 md:gap-16 items-center pointer-events-auto hover:bg-black/80 hover:border-white/20 transition-all cursor-pointer">
          <button onClick={() => setActiveTab('home')} className={`relative p-2 transition-all duration-300 ${activeTab === 'home' ? 'text-primary scale-110' : 'text-white/40 hover:text-white/80 hover:scale-105'}`}>
            <IconHome size={24} className={activeTab === 'home' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
            {activeTab === 'home' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,125,38,1)]" />}
          </button>

          <button onClick={() => setActiveModal('removeBg')} className={`relative p-2 transition-all duration-300 ${activeModal === 'removeBg' ? 'text-primary scale-110' : 'text-white/40 hover:text-white/80 hover:scale-105'}`}>
            <IconWand size={24} className={activeModal === 'removeBg' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
          </button>

          <button onClick={() => setActiveModal('qr')} className={`relative p-2 transition-all duration-300 ${activeModal === 'qr' ? 'text-primary scale-110' : 'text-white/40 hover:text-white/80 hover:scale-105'}`}>
            <IconQr size={24} className={activeModal === 'qr' ? "drop-shadow-[0_0_8px_rgba(242,125,38,0.8)]" : ""} />
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
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center animate-fade-in-up pointer-events-auto text-center p-8 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <svg className="w-10 h-10" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            </div>
            <h3 className="font-display font-bold text-white text-2xl mb-2">Ingresa con Google</h3>
            <p className="text-sm text-white/50 mb-8">Accede al panel de clientes de Ultra usando tu cuenta de Google.</p>
            <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continuar con Google
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === 'profile' && clientData && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center animate-fade-in-up pointer-events-auto relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><IconX size={20} /></button>
            {clientData.photoURL ? (
              <img src={clientData.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-24 h-24 rounded-full border-4 border-white/10 mb-4 shadow-[0_0_20px_rgba(242,125,38,0.4)] object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-yellow-500 p-1 mb-6 shadow-[0_0_20px_rgba(242,125,38,0.4)]">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">{clientData.name.substring(0, 2).toUpperCase()}</span>
                </div>
              </div>
            )}
            <h3 className="text-2xl font-display font-bold text-white mb-1">{clientData.name}</h3>
            <p className="text-white/40 font-medium mb-8 text-sm">{clientData.email}</p>

            <button onClick={handleLogout} className="w-full py-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all font-bold">
              Cerrar Sesión Google
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {activeModal === 'qr' && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up pointer-events-auto">
            <div className="p-6 border-b border-white/5 relative">
              <h3 className="font-display font-bold text-white text-xl flex items-center gap-2"><IconQr className="text-primary" /> Generador QR</h3>
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
              Sube cualquier imagen para remover el fondo al instante. <br />(Función Pro, requiere integración API habilitada).
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
            <button onClick={() => {setActiveModal(null); setCurrentImageIndex(0);}} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-50 border border-white/10 hover:bg-white/10 transition-colors">
              <IconX size={20} />
            </button>

            {/* Image Side - Carousel */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden bg-black shrink-0 group">
              <img 
                src={[selectedProduct.img1, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop'][currentImageIndex]} 
                alt={selectedProduct.title} 
                className="w-full h-full object-cover transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r" />
              
              {/* Carousel Controls */}
              <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? 2 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><IconArrowRight className="rotate-180" size={20} /></button>
              <button onClick={() => setCurrentImageIndex(prev => prev === 2 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><IconArrowRight size={20} /></button>
              
              {/* Carousel Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {[0, 1, 2].map(idx => (
                  <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentImageIndex === idx ? 'bg-primary w-4' : 'bg-white/50'}`} />
                ))}
              </div>

              <div className="absolute top-6 left-6">
                <span className="backdrop-blur-md bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white px-4 py-2 rounded-full border border-white/20 shadow-lg">Ultra PRO</span>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-6 md:p-10 flex flex-col min-h-0 relative z-10 -mt-6 md:mt-0 bg-[#111] rounded-t-[2rem] md:rounded-none">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">{selectedProduct.title}</h2>
                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6">El diseño moderno requiere materiales y acabados que resalten tu marca por encima del resto. Descubre por qué los expertos prefieren Ultra.</p>

              </div>

              {/* Call to Action */}
              <button onClick={() => window.open(`https://wa.me/573027502695?text=Hola, quiero agendar mi: ${selectedProduct.title}`, '_blank')}
                className="mt-auto w-full group relative flex justify-center items-center gap-3 bg-gradient-to-r from-[#F27D26] to-[#E55A00] text-white font-bold py-5 px-8 rounded-full shadow-[0_10px_30px_rgba(242,125,38,0.4)] hover:shadow-[0_15px_40px_rgba(242,125,38,0.6)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                <span className="relative z-10 text-lg uppercase tracking-wider">Comprar por WhatsApp</span>
                <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.436-9.88 9.88-9.88 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.88-9.881 9.88zm8.508-18.395A11.859 11.859 0 0012.052 0C5.461 0 .092 5.36.09 11.956c0 2.106.55 4.161 1.594 5.975L0 24l6.216-1.63a11.865 11.865 0 005.836 1.517h.005c6.589 0 11.958-5.36 11.961-11.956a11.86 11.86 0 00-3.498-8.487z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl relative animate-fade-in-up">
            <button onClick={() => setShowInstallModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white">
              <IconX size={20} />
            </button>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-primary to-yellow-500 rounded-2xl p-[2px] shadow-[0_0_20px_rgba(242,125,38,0.4)]">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9dbXCLX0LwICy_lfT6QHQKT4sSKxvKC0zl3lxT9e2giqf_Y5CO6SHu8YMNAnHPSe_Vfmi1_9NMCmYcdJ3oDHQfcfhcNalQnMSNzj6IdfqCGoc84H3f5q3HcxYUk8KHGPjCI2fVLxgNgCmqTwVGO3Y9qXSf1fhgut85W8v4qPywTVhyphenhyphentFiy8vSNFFn_aY9/s3543/DWDAWDAWD.png" className="w-full h-full rounded-2xl object-cover bg-black" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Instala Ultra Graphic</h3>
            <p className="text-sm text-white/60 mb-8">Instala Ultra Graphic en tu celular, y resive el mejor contenido publicitario para tu negocio.</p>
            <button onClick={async () => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  setDeferredPrompt(null);
                  setShowInstallModal(false);
                }
              } else {
                // Para iOS
                alert('Para instalar en iOS: Toca el botón Compartir y luego "Agregar a inicio".');
              }
            }} className="w-full bg-gradient-to-r from-primary to-[#E55A00] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(242,125,38,0.4)]">
              Instalar Ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

