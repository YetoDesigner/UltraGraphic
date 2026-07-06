import React, { useState, useEffect, useRef } from 'react';
import { products, NANO_BANANA_LOGO } from '../data';
import { Product, ViewType, Message } from '../types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('vitrina');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const chatMsgsRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsAttachMenuOpen(false);
    if (!isChatOpen && messages.length === 0) {
      botSay("¡Hola! 👋 Soy el asistente de <b>Nano Banana</b> (anteriormente aison publicidad). Te doy precios, resuelvo dudas y armo tu cotización. ¿Qué producto te interesa?");
    }
  };

  const botSay = (text: string) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: text }]);
    }, 300);
  };

  useEffect(() => {
    if (chatMsgsRef.current) {
      chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
    }
    setLikedProducts(newLiked);
  };

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setChatInput('');
    
    const reply = botReply(text);
    botSay(reply);
  };

  const botReply = (raw: string): string => {
    const t = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if(/\b(hola|buenas|buenos|hey|hi|que tal)\b/.test(t))
      return "¡Hola! Con gusto te ayudo. ¿Buscas algún producto en especial o te muestro el catálogo completo?";
    if(/(catalogo|productos|que venden|que ofrecen|todo)/.test(t))
      return "Estos son nuestros productos:<br>• " + products.map(p=>p.name).join("<br>• ") + "<br><br>¿Sobre cuál quieres precio o cotización?";
    
    const p = products.find(prod => prod.kw.some(k => t.includes(k)));
    if(p){
      const precio = p.price
        ? `El precio es <b>${p.price}</b> y podemos empezar hoy mismo.`
        : `Se cotiza a medida según tamaño y cantidad. <b>Cuéntame medidas y cantidad</b> y te paso el valor al instante.`;
      return `<b>${p.name}</b> — ${p.desc}<br>${precio}<br>¿Te preparo la cotización? 🧡`;
    }
    
    if(/(precio|cuanto|vale|cuesta|valor)/.test(t))
      return "Claro, dime el producto (por ejemplo: tarjetas, pendones, vinilos) y te doy el precio de una vez.";
    if(/(cotiza|cotizacion|presupuesto)/.test(t))
      return "¡Perfecto! Para tu cotización dime: <b>producto, cantidad y medidas</b>. Con eso te doy el valor y el tiempo de entrega.";
    if(/(envio|entrega|despacho|domicilio)/.test(t))
      return "Hacemos entregas a domicilio y también puedes recoger. Dime tu ciudad y la cantidad para calcular tiempos. 🚚";
    if(/(contacto|whatsapp|telefono|llamar|numero)/.test(t))
      return "Podemos seguir por WhatsApp para agilizar tu pedido. Dime tu producto de interés y coordinamos pago y entrega. ✅";
    if(/(gracias|listo|ok|vale)/.test(t))
      return "¡Con gusto! ¿Quieres que te arme la cotización ahora para asegurar el precio de hoy? 🧡";
    return "Puedo ayudarte con precios y cotizaciones. Escríbeme el producto que te interese (pendones, tarjetas, volantes, vinilos, camisetas, vallas, letreros, rotulación…) y lo resolvemos.";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsAttachMenuOpen(false);
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMessages(prev => [...prev, { role: 'user', content: `<img src="${result}" class="rounded-xl max-h-40 w-auto">` }]);
      botSay("¡Recibí tu imagen! 📸 ¿La imprimimos tal cual, la usamos de referencia o la adaptamos a un producto (pendón, camiseta, vinilo)? Te armo la cotización.");
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Hero Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (heroTrackRef.current) {
        const t = heroTrackRef.current;
        const first = t.firstElementChild as HTMLElement;
        if (first) {
          const stepX = first.getBoundingClientRect().width + 20;
          if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 12) {
            t.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            t.scrollBy({ left: stepX, behavior: 'smooth' });
          }
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans bg-[#F5F5F2] text-[#1A1A1A] dark:bg-black dark:text-neutral-100 transition-colors duration-300 min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-transparent backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center shrink-0">
            <img src={NANO_BANANA_LOGO} alt="Nano Banana" className="h-10 w-auto" />
            <span className="ml-2 font-extrabold text-xl hidden sm:block">Nano Banana</span>
          </a>

          <div className="flex items-center gap-2">
            <button onClick={toggleChat} className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:brightness-110 active:scale-95 transition shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>
              <span className="hidden sm:inline">Chat</span>
            </button>

            <button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full border border-black/15 dark:border-white/25 hover:text-orange-600 hover:border-orange-600 transition">
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="pt-6 pb-10">
        <p className="max-w-5xl mx-auto px-4 sm:px-6 text-xs uppercase tracking-[0.3em] text-orange-600 font-bold mb-4">Destacados</p>
        <div ref={heroTrackRef} className="hscroll flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4">
          {products.map((p, i) => (
            <a key={i} href="#catalogo" className="shrink-0 w-[20rem] sm:w-[26rem]">
              <div className={`thumb h-[28rem] sm:h-[34rem] rounded-3xl bg-gradient-to-br ${p.grad}`}>
                <span className="icon">{p.icon}</span>
                <div className="scrim"></div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-extrabold text-2xl leading-tight">{p.name}</h3>
                  <p className="text-sm font-medium text-white/80 mb-3">{p.desc}</p>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-orange-600 text-white text-sm font-bold">{p.price || 'Cotiza aquí'}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CATALOGO */}
      <main id="catalogo" className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="font-extrabold text-2xl">Catálogo</h2>
          <div className="inline-flex p-1 rounded-full border border-black/15 dark:border-white/20">
            <button onClick={() => setView('vitrina')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition ${view === 'vitrina' ? 'bg-orange-600 text-white' : ''}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              Vitrina
            </button>
            <button onClick={() => setView('feed')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition ${view === 'feed' ? 'bg-orange-600 text-white' : ''}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/></svg>
              Feed
            </button>
          </div>
        </div>
        
        <div className={`grid gap-4 ${view === 'feed' ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-2'}`}>
          {products.map((p, i) => (
            <article key={i} className={`thumb rounded-[2rem] bg-gradient-to-br ${p.grad} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition ${view === 'feed' ? 'aspect-[4/5]' : 'aspect-square'}`}>
              {view === 'feed' && (
                <div className="absolute top-0 inset-x-0 p-4 flex items-center gap-2 text-white z-10">
                  <span className="font-bold text-sm lowercase drop-shadow">Nano Banana</span>
                  <span className="ml-auto text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">Patrocinado</span>
                </div>
              )}
              
              <span className="icon">{p.icon}</span>
              
              <div className={view === 'feed' ? "absolute bottom-5 inset-x-0 px-5 flex items-center justify-between gap-3 z-20" : "absolute top-3 right-3 z-20"}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(i)} className={`flex items-center gap-1.5 text-sm font-bold ${likedProducts.has(i) ? 'text-orange-600' : 'text-white'} transition`}>
                    <svg className={likedProducts.has(i) ? 'liked' : ''} width="22" height="22" viewBox="0 0 24 24" fill={likedProducts.has(i) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                    </svg>
                    <span>{p.likes + (likedProducts.has(i) ? 1 : 0)}</span>
                  </button>
                  
                  {view === 'feed' && (
                    <button aria-label="Compartir" className="text-white hover:text-orange-600 transition">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
                    </button>
                  )}
                </div>
                
                {view === 'feed' && (
                  <button className="px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:brightness-110 active:scale-95 transition">
                    {p.price ? `Comprar ${p.price}` : 'Solicitar cotización'}
                  </button>
                )}
              </div>

              <div className="scrim"></div>
              
              <div className={`absolute inset-x-0 bottom-0 p-4 text-white space-y-2.5 ${view === 'feed' ? 'pb-20' : ''}`}>
                <div>
                  <h3 className={`font-extrabold leading-tight ${view === 'feed' ? 'text-xl' : 'text-base sm:text-lg'}`}>{p.name}</h3>
                  <p className={`font-medium text-white/80 ${view === 'feed' ? 'text-sm' : 'text-xs line-clamp-2'}`}>{p.desc}</p>
                </div>
                {view === 'vitrina' && (
                  <button className="w-full px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:brightness-110 active:scale-95 transition">
                    {p.price ? `Comprar ${p.price}` : 'Solicitar cotización'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center text-sm text-black/50 dark:text-white/50 font-medium">
          © 2026 Nano Banana · Diseño e impresión.
        </div>
      </footer>

      {/* CHAT PANEL */}
      <div className={`${isChatOpen ? '' : 'hidden-chat'} fixed inset-0 z-50 flex flex-col bg-white/25 dark:bg-black/30 backdrop-blur-2xl transition-all duration-300`}>
        <button onClick={toggleChat} className="absolute top-4 right-4 z-10 w-11 h-11 grid place-items-center rounded-full bg-black/10 dark:bg-white/10 text-current hover:bg-black/20 dark:hover:bg-white/20 transition text-lg">✕</button>
        
        <div ref={chatMsgsRef} className="flex-1 overflow-y-auto px-4 pt-20 pb-4 w-full max-w-2xl mx-auto space-y-3 text-sm">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl leading-snug ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-br-sm' : 'bg-white/90 dark:bg-neutral-800/90 text-[#1A1A1A] dark:text-white rounded-bl-sm'}`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}
        </div>

        <div className="px-4 pb-6 pt-2 w-full max-w-2xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="relative">
              {isAttachMenuOpen && (
                <div className="absolute bottom-14 left-0 w-44 rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl">
                  <label className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-orange-600 hover:text-white transition text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
                    Subir imagen
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-orange-600 hover:text-white transition text-sm border-t border-black/10 dark:border-white/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    Tomar foto
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
              <button onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)} className="w-11 h-11 grid place-items-center rounded-full bg-white/60 dark:bg-white/10 hover:text-orange-600 transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>

            <div className="relative flex-1">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                placeholder="Escribe tu mensaje…"
                className="w-full pl-4 pr-14 py-3 rounded-full bg-white/70 dark:bg-black/40 text-[#1A1A1A] dark:text-white placeholder-black/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button onClick={sendMsg} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full bg-orange-600 text-white hover:brightness-110 active:scale-95 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
