import { useState, useEffect } from 'react';

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
    if (!clientData) {
      setActiveModal('register');
    }
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

  const handleUserNav = () => {
    setActiveTab('user');
    setActiveModal(clientData ? 'profile' : 'register');
  };

  const openProduct = (title: string, img1: string, img2: string, img3: string, audio: string, isVinyl: boolean = false) => {
    setSelectedProduct({ title, img1, img2, img3, audio, isVinyl });
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
        total = areaM2 * 50000; // Mock standard price
        if (calcInstallation) total += areaM2 * 15000; // Mock inst price
      }
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total);
    }
    return '$0';
  };

  return (
    <div className="min-h-screen pb-24 text-white relative overflow-x-hidden bg-black font-sans">
      
      {/* Welcome Overlay */}
      {welcomeVisible && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center transition-opacity duration-1000">
          <div className="text-center mb-16 px-4">
            <p className="text-white text-3xl md:text-5xl font-bold mb-2 tracking-wide drop-shadow-lg">Bienvenido a</p>
            <h1 className="text-7xl md:text-9xl font-display font-black animate-ultra-reveal leading-none mt-4">
              <span className="text-white drop-shadow-2xl block md:inline">Ultra</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] via-orange-500 to-yellow-500 max-sm:ml-2">Graphic</span>
            </h1>
          </div>
          <button 
            onClick={handleStart}
            className="group relative px-12 py-6 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-2xl mt-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-shadow">
                <i className="fas fa-arrow-right text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase text-white/90 group-hover:text-white transition-colors">Iniciar</span>
            </div>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-8 pb-2 sticky top-0 z-50 flex justify-center">
        <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-md border border-white/10 pl-2 pr-4 py-2 rounded-full flex items-center justify-between w-full shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="animated-gradient-border w-12 h-12 flex items-center justify-center orange-glow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9dbXCLX0LwICy_lfT6QHQKT4sSKxvKC0zl3lxT9e2giqf_Y5CO6SHu8YMNAnHPSe_Vfmi1_9NMCmYcdJ3oDHQfcfhcNalQnMSNzj6IdfqCGoc84H3f5q3HcxYUk8KHGPjCI2fVLxgNgCmqTwVGO3Y9qXSf1fhgut85W8v4qPywTVhyphenhyphentFiy8vSNFFn_aY9/s3543/DWDAWDAWD.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest whitespace-nowrap absolute left-1/2 -translate-x-1/2">
            <span className="animate-header-reveal">
              Ultra <span className="text-primary">Graphic</span>
            </span>
          </h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Featured Section */}
      <section className="py-4">
        <div className="px-8 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Productos publicitarios</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-4 snap-x snap-mandatory scroll-container">
          {/* Card 1 */}
          <div 
            onClick={() => openProduct('Avisos Publicitarios', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoqaDmm69PFaes5PDpXDfOkTQr7MeJmxwAAd8rZcv5XYXI_7iWjjeDzgfSWJIdGQRpZuU3T1ArvA-B6GT-98rAsgsBiR4Wk6LP4R_DBga2YkjTkYtafAoP4bw1NwjjxcLrVqmBTGNAxqXvlubNT9AAV1Yk6T92ytlJzoQa2wcMnEEAtxRoC4kYUIfzRZSz/s1986/teyrtyrty.jpg', 'https://picsum.photos/seed/web2/400/300', 'https://picsum.photos/seed/web3/400/300', '#.mp3')}
            className="relative min-w-[350px] h-[480px] rounded-[3rem] overflow-hidden border border-white/5 group bg-card shadow-2xl snap-center shrink-0 cursor-pointer">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoqaDmm69PFaes5PDpXDfOkTQr7MeJmxwAAd8rZcv5XYXI_7iWjjeDzgfSWJIdGQRpZuU3T1ArvA-B6GT-98rAsgsBiR4Wk6LP4R_DBga2YkjTkYtafAoP4bw1NwjjxcLrVqmBTGNAxqXvlubNT9AAV1Yk6T92ytlJzoQa2wcMnEEAtxRoC4kYUIfzRZSz/s1986/teyrtyrty.jpg" alt="Avisos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Acrilico</span>
              <h4 className="font-display font-bold text-2xl leading-tight">Avisos Publicitarios</h4>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2"><i className="fas fa-star text-primary"></i> <span className="text-base font-bold">4.9</span> <span className="text-xs text-white/40">(124)</span></div>
                <div className="flex items-center gap-2 text-white/60"><i className="far fa-clock"></i> <span className="text-xs font-medium uppercase tracking-wider">2d entrega</span></div>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div 
            onClick={() => openProduct('Impresion de vinilo', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR6yfDvUAKZeCgwTM02QlMtJG7t7IsrKYMjDDv3v4tQTNjnz2szI-Z7SG5WIIxHCJRwAOGzxbvCwahVKuo3q1nn678CXrfn1i-PMb76a4WC1pdTqQHeZZVZOjYSkO4AbpB9cr9gN921Pk1S8PBCsVJq-5h5w85UqzRDxJWhg976wZXNcC6KCr-EIwHauBq/s1986/fghfghfh.jpg', 'https://gammatech.com.co/wp-content/uploads/2024/08/impresion-en-vinilo-adhesivo-1.jpg', 'https://www.expresatdigital.com/wp-content/uploads/2023/05/002928ad-f26d-44ec-85ef-f8fe0cc9e9ca.jpg', 'vinilo.mp3', true)}
            className="relative min-w-[350px] h-[480px] rounded-[3rem] overflow-hidden border border-white/5 group bg-card shadow-2xl snap-center shrink-0 cursor-pointer">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR6yfDvUAKZeCgwTM02QlMtJG7t7IsrKYMjDDv3v4tQTNjnz2szI-Z7SG5WIIxHCJRwAOGzxbvCwahVKuo3q1nn678CXrfn1i-PMb76a4WC1pdTqQHeZZVZOjYSkO4AbpB9cr9gN921Pk1S8PBCsVJq-5h5w85UqzRDxJWhg976wZXNcC6KCr-EIwHauBq/s1986/fghfghfh.jpg" alt="Vinilo" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Impresión</span>
              <h4 className="font-display font-bold text-2xl leading-tight">Impresion de vinilo</h4>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2"><i className="fas fa-star text-primary"></i> <span className="text-base font-bold">5.0</span> <span className="text-xs text-white/40">(89)</span></div>
                <div className="flex items-center gap-2 text-white/60"><i className="far fa-clock"></i> <span className="text-xs font-medium uppercase tracking-wider">2d entrega</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Pro */}
      <section className="py-2">
        <div className="px-8 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Nuevos Lanzamientos & Pro</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-6 pb-4 snap-x snap-mandatory scroll-container">
          <div onClick={() => openProduct('Tarjetas', '...', '...', '...', '#')} className="relative min-w-[340px] h-[230px] rounded-[2rem] overflow-hidden border border-white/5 bg-card shadow-xl snap-center shrink-0 cursor-pointer">
            <img src="https://i.pinimg.com/736x/6a/bd/3d/6abd3d064b884a558e60a6e66a7770f2.jpg" alt="Cards" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5"><h4 className="font-display font-bold text-sm">Tarjetas de Presentación</h4></div>
          </div>
          <div onClick={() => openProduct('Reconocimientos', '...', '...', '...', '#')} className="relative min-w-[340px] h-[230px] rounded-[2rem] overflow-hidden border border-white/5 bg-card shadow-xl snap-center shrink-0 cursor-pointer">
            <img src="https://i.pinimg.com/1200x/52/78/3f/52783f9fb87be6629ba7ef7542aa464f.jpg" alt="Awards" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5"><h4 className="font-display font-bold text-sm">Reconocimientos en Acrilico</h4></div>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-black via-black to-transparent">
        <nav className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex justify-between items-center shadow-2xl max-w-md mx-auto relative">
          <button onClick={() => setActiveTab('home')} className={`nav-btn flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-primary active' : 'text-white/40'}`}>
            <i className="fas fa-home text-xl"></i>
          </button>
          <button onClick={() => setActiveModal('removeBg')} className={`nav-btn flex flex-col items-center transition-colors ${activeModal === 'removeBg' ? 'text-primary active' : 'text-white/40'}`}>
            <i className="fas fa-magic text-xl"></i>
          </button>
          <button onClick={() => setActiveModal('qr')} className={`nav-btn flex flex-col items-center transition-colors ${activeModal === 'qr' ? 'text-primary active' : 'text-white/40'}`}>
            <i className="fas fa-qrcode text-xl"></i>
          </button>
          <button onClick={handleUserNav} className={`nav-btn flex flex-col items-center transition-colors ${activeTab === 'user' ? 'text-primary active' : 'text-white/40'}`}>
            <i className="far fa-user text-xl"></i>
          </button>
        </nav>
      </div>

      {/* Register Modal */}
      {activeModal === 'register' && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent relative">
              <h3 className="font-bold text-white text-xl mb-1">Regístrate como Cliente</h3>
              <p className="text-xs text-white/50">Únete a la familia Ultra Graphic</p>
              {clientData && (
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                  <i className="fas fa-times text-white/40"></i>
                </button>
              )}
            </div>
            <div className="p-6 space-y-5">
              <input type="text" placeholder="Nombre Completo" value={regName} onChange={e => setRegName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white" />
              <input type="text" placeholder="Tu Marca" value={regBrand} onChange={e => setRegBrand(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white" />
              <input type="tel" placeholder="Tu Teléfono" value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/[^0-9\s+]/g, ''))} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white" />
              <button 
                onClick={handleRegisterSubmit}
                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 mt-4">
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === 'profile' && clientData && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center animate-fade-in-up">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
              <i className="fas fa-times text-white/40"></i>
            </button>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">{clientData.name.substring(0,2).toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{clientData.name}</h3>
            <p className="text-primary font-medium mb-6">{clientData.brand}</p>
            <button onClick={handleLogout} className="text-white/40 hover:text-red-400 text-sm flex items-center gap-2">
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {activeModal === 'qr' && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <i className="fas fa-qrcode text-primary text-xl"></i>
                <h3 className="font-bold text-white text-lg">Generador QR</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <i className="fas fa-times text-white/40"></i>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <input type="text" placeholder="https://ejemplo.com" value={qrText} onChange={e => setQrText(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateQr()} className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white" />
              <button onClick={generateQr} className="w-full bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/5">Generar Código QR</button>
              {qrImageSrc && (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl mb-4 shadow-lg"><img src={qrImageSrc} className="w-48 h-48 object-contain" alt="QR Code" /></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Remove BG Modal */}
      {activeModal === 'removeBg' && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <i className="fas fa-magic text-primary text-xl"></i>
                <h3 className="font-bold text-white text-lg">Remove BG</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <i className="fas fa-times text-white/40"></i>
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-white/50 mb-4">La función de remover fondo requiere un servidor o backend conectado, pero la estructura visual está lista aquí.</p>
              <button className="bg-white/10 text-white font-bold py-3 px-6 rounded-xl border border-white/5">Subir Imagen</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {activeModal === 'product' && selectedProduct && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="relative w-full md:max-w-6xl bg-[#121212] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[82vh] md:h-[650px] animate-fade-in-up">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
              <i className="fas fa-times"></i>
            </button>
            <div className="relative h-[42vh] md:h-full md:w-1/2 w-full shrink-0 group overflow-hidden bg-black flex">
              <img src={selectedProduct.img1} className="w-full h-full object-cover" alt="Product" />
              <div className="absolute top-6 left-6 z-10">
                <span className="px-3 py-1 bg-primary/90 rounded-full text-[10px] font-bold uppercase text-white shadow-lg">Destacado</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col w-full md:w-1/2 overflow-hidden bg-[#121212] z-10 px-6 pt-6 pb-8 md:p-12 relative -mt-6 md:mt-0 rounded-t-[2rem] md:rounded-none">
              <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{selectedProduct.title}</h3>
                  <div className="flex items-center gap-2 mb-6 text-white/40 text-sm"><i className="fas fa-star text-primary"></i> <span className="text-white font-bold">4.9</span> <span>(128 reseñas)</span></div>
                  
                  <div className="mb-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><i className="fas fa-calculator text-primary"></i> Calculadora</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Ancho (cm)</label><input type="number" value={calcWidth} onChange={(e) => setCalcWidth(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white" /></div>
                      <div><label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Alto (cm)</label><input type="number" value={calcHeight} onChange={(e) => setCalcHeight(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white" /></div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 flex items-center justify-between bg-black/20 p-2 rounded-lg">
                        <span className="text-white/80 text-[10px] uppercase font-bold">Instalación</span>
                        <input type="checkbox" checked={calcInstallation} onChange={(e) => setCalcInstallation(e.target.checked)} className="accent-primary" />
                      </div>
                      {selectedProduct.isVinyl && (
                        <div className="flex-1 flex items-center justify-between bg-black/20 p-2 rounded-lg">
                          <span className="text-white/80 text-[10px] uppercase font-bold">Plastificado</span>
                          <input type="checkbox" checked={calcPlastificado} onChange={(e) => setCalcPlastificado(e.target.checked)} className="accent-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-white/60 text-[10px] uppercase font-bold">Total Est.</span>
                      <span className="text-xl font-bold text-primary">{calculatePrice()}</span>
                    </div>
                  </div>
              </div>
              <button onClick={() => window.open(`https://wa.me/573027502695?text=Hola, me interesa: ${selectedProduct.title}`, '_blank')} className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-orange-600 rounded-full font-bold text-sm text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                <span>Asesoría WhatsApp</span> <i className="fab fa-whatsapp text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
