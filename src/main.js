import { products } from './data.js';

let currentView = 'vitrina';
const liked = new Set();

let heroTimer = null;
let heroIdle = null;

function $(id) {
  return document.getElementById(id);
}

function heroCard(product) {
  return `
    <a href="#catalogo" class="shrink-0 w-[20rem] sm:w-[26rem]">
      <div class="thumb h-[28rem] sm:h-[34rem] rounded-3xl bg-gradient-to-br ${product.grad}">
        <span class="icon">${product.icon}</span>
        <div class="scrim"></div>
        <div class="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 class="font-extrabold text-2xl leading-tight">${product.name}</h3>
          <p class="text-sm font-medium text-white/80 mb-3">${product.desc}</p>
          <span class="inline-block px-4 py-1.5 rounded-full bg-naranja text-white text-sm font-bold">${product.price || 'Cotiza aquí'}</span>
        </div>
      </div>
    </a>`;
}

function renderHero() {
  $('hero-track').innerHTML = products.map(heroCard).join('');
}

function heroStep() {
  const track = $('hero-track');
  const first = track?.firstElementChild;
  if (!track || !first) return;

  const stepX = first.getBoundingClientRect().width + 20;
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 12) {
    track.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    track.scrollBy({ left: stepX, behavior: 'smooth' });
  }
}

function heroPlay() {
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(heroStep, 4000);
}

function heroPauseThenResume() {
  window.clearInterval(heroTimer);
  window.clearTimeout(heroIdle);
  heroIdle = window.setTimeout(heroPlay, 4000);
}

function initHeroAuto() {
  const track = $('hero-track');
  if (!track) return;

  ['wheel', 'touchstart', 'pointerdown'].forEach((eventName) => {
    track.addEventListener(eventName, heroPauseThenResume, { passive: true });
  });

  heroPlay();
}

function heartButton(index) {
  const isLiked = liked.has(index);
  const totalLikes = products[index].likes + (isLiked ? 1 : 0);

  return `<button onclick="toggleLike(${index})" aria-label="Me gusta"
    class="flex items-center gap-1.5 text-sm font-bold ${isLiked ? 'text-naranja' : 'text-white'} hover:text-naranja transition">
    <svg class="${isLiked ? 'liked' : ''}" width="22" height="22" viewBox="0 0 24 24" fill="${isLiked ? '#FF6A00' : 'none'}" stroke="currentColor" stroke-width="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
    </svg>
    <span>${totalLikes}</span>
  </button>`;
}

function ctaPill(product, fullWidth) {
  const label = product.price ? `Comprar ${product.price}` : 'Solicitar cotización';
  return `<button class="${fullWidth ? 'w-full ' : ''}px-4 py-2 rounded-full bg-naranja text-white text-sm font-bold hover:brightness-110 active:scale-95 transition">${label}</button>`;
}

function productCard(product, index, isFeed) {
  if (isFeed) {
    return `
      <article class="thumb aspect-[4/5] rounded-[2rem] bg-gradient-to-br ${product.grad} shadow-md">
        <span class="icon">${product.icon}</span>
        <div class="absolute top-0 inset-x-0 p-4 flex items-center gap-2 text-white">
          <span class="font-bold text-sm lowercase drop-shadow">nano banana</span>
          <span class="ml-auto text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">Patrocinado</span>
        </div>
        <div class="scrim"></div>
        <div class="absolute inset-x-0 bottom-0 p-5 text-white space-y-3">
          <div>
            <h3 class="font-extrabold text-xl leading-tight">${product.name}</h3>
            <p class="text-sm font-medium text-white/80">${product.desc}</p>
          </div>
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-4">
              ${heartButton(index)}
              <button aria-label="Compartir" class="text-white hover:text-naranja transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
              </button>
            </div>
            ${ctaPill(product, false)}
          </div>
        </div>
      </article>`;
  }

  return `
    <article class="thumb aspect-square rounded-[2rem] bg-gradient-to-br ${product.grad} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
      <span class="icon">${product.icon}</span>
      <div class="absolute top-3 right-3">${heartButton(index)}</div>
      <div class="scrim"></div>
      <div class="absolute inset-x-0 bottom-0 p-4 text-white space-y-2.5">
        <div>
          <h3 class="font-extrabold text-base sm:text-lg leading-tight">${product.name}</h3>
          <p class="text-xs font-medium text-white/80 line-clamp-2">${product.desc}</p>
        </div>
        ${ctaPill(product, true)}
      </div>
    </article>`;
}

function renderCatalog() {
  const wrap = $('products');
  const isFeed = currentView === 'feed';
  wrap.className = isFeed ? 'grid grid-cols-1 gap-6 max-w-xl mx-auto' : 'grid grid-cols-2 gap-3 sm:gap-4';
  wrap.innerHTML = products.map((product, index) => productCard(product, index, isFeed)).join('');
}

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function findProduct(text) {
  return products.find((product) => product.kw.some((keyword) => text.includes(keyword)));
}

function bubble(role, inner) {
  const wrap = $('chatMsgs');
  const mine = role === 'user';
  const el = document.createElement('div');
  el.className = `flex ${mine ? 'justify-end' : 'justify-start'}`;
  el.innerHTML = `<div class="max-w-[80%] px-3.5 py-2.5 rounded-2xl leading-snug ${
    mine ? 'bg-naranja text-white rounded-br-sm' : 'bg-white/90 dark:bg-neutral-800/90 text-[#1A1A1A] dark:text-white rounded-bl-sm'
  }">${inner}</div>`;
  wrap.appendChild(el);
  wrap.scrollTop = wrap.scrollHeight;
}

function botSay(html) {
  window.setTimeout(() => bubble('bot', html), 300);
}

function botReply(raw) {
  const text = normalizeText(raw);

  if (/\b(hola|buenas|buenos|hey|hi|que tal)\b/.test(text)) {
    return '¡Hola! Con gusto te ayudo. ¿Buscas algún producto en especial o te muestro el catálogo completo?';
  }

  if (/(catalogo|productos|que venden|que ofrecen|todo)/.test(text)) {
    return `Estos son nuestros productos:<br>• ${products.map((product) => product.name).join('<br>• ')}<br><br>¿Sobre cuál quieres precio o cotización?`;
  }

  const product = findProduct(text);
  if (product) {
    const priceText = product.price
      ? `El precio es <b>${product.price}</b> y podemos empezar hoy mismo.`
      : 'Se cotiza a medida según tamaño y cantidad. <b>Cuéntame medidas y cantidad</b> y te paso el valor al instante.';
    return `<b>${product.name}</b> — ${product.desc}<br>${priceText}<br>¿Te preparo la cotización? 🧡`;
  }

  if (/(precio|cuanto|vale|cuesta|valor)/.test(text)) {
    return 'Claro, dime el producto (por ejemplo: tarjetas, pendones, vinilos) y te doy el precio de una vez.';
  }

  if (/(cotiza|cotizacion|presupuesto)/.test(text)) {
    return '¡Perfecto! Para tu cotización dime: <b>producto, cantidad y medidas</b>. Con eso te doy el valor y el tiempo de entrega.';
  }

  if (/(envio|entrega|despacho|domicilio)/.test(text)) {
    return 'Hacemos entregas a domicilio y también puedes recoger. Dime tu ciudad y la cantidad para calcular tiempos. 🚚';
  }

  if (/(contacto|whatsapp|telefono|llamar|numero)/.test(text)) {
    return 'Podemos seguir por WhatsApp para agilizar tu pedido. Dime tu producto de interés y coordinamos pago y entrega. ✅';
  }

  if (/(gracias|listo|ok|vale)/.test(text)) {
    return '¡Con gusto! ¿Quieres que te arme la cotización ahora para asegurar el precio de hoy? 🧡';
  }

  return 'Puedo ayudarte con precios y cotizaciones. Escríbeme el producto que te interese (pendones, tarjetas, volantes, vinilos, camisetas, vallas, letreros, rotulación...) y lo resolvemos.';
}

function toggleLike(index) {
  if (liked.has(index)) {
    liked.delete(index);
  } else {
    liked.add(index);
  }
  renderCatalog();
}

function setView(view) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach((button) => button.classList.remove('bg-naranja', 'text-white'));
  $(view === 'feed' ? 'btn-feed' : 'btn-vitrina').classList.add('bg-naranja', 'text-white');
  renderCatalog();
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}

function toggleAttachMenu() {
  $('attachMenu').classList.toggle('hidden');
}

function toggleChat() {
  const panel = $('chatPanel');
  panel.classList.toggle('hidden-chat');
  $('attachMenu').classList.add('hidden');

  if (!panel.classList.contains('hidden-chat')) {
    const messages = $('chatMsgs');
    if (!messages.dataset.init) {
      botSay('¡Hola! 👋 Soy el asistente de <b>Nano Banana</b>. Te doy precios, resuelvo dudas y armo tu cotización. ¿Qué producto te interesa? Ej.: pendones, tarjetas, vinilos, camisetas...');
      messages.dataset.init = '1';
    }
    window.setTimeout(() => $('chatInput').focus(), 100);
  }
}

function sendMsg() {
  const input = $('chatInput');
  const text = input.value.trim();
  if (!text) return;

  bubble('user', text.replace(/</g, '&lt;'));
  input.value = '';
  botSay(botReply(text));
}

function sendImage(event) {
  const file = event.target.files?.[0];
  $('attachMenu').classList.add('hidden');
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    bubble('user', `<img src="${loadEvent.target.result}" class="rounded-xl max-h-40 w-auto" alt="Imagen subida">`);
    botSay('¡Recibí tu imagen! 📸 ¿La imprimimos tal cual, la usamos de referencia o la adaptamos a un producto (pendón, camiseta, vinilo)? Te armo la cotización.');
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

window.toggleLike = toggleLike;
window.setView = setView;
window.toggleTheme = toggleTheme;
window.toggleAttachMenu = toggleAttachMenu;
window.toggleChat = toggleChat;
window.sendMsg = sendMsg;
window.sendImage = sendImage;

renderHero();
initHeroAuto();
setView('vitrina');
