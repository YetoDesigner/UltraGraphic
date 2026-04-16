import re

html_template = """
        <!-- Video {id} -->
        <div class="relative w-full aspect-[9/16] max-h-[80vh] rounded-[2rem] overflow-hidden border border-white/5 bg-card shadow-2xl cursor-pointer group"
             onclick="var v = this.querySelector('video'); if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen(); if(v.paused) v.play(); this.querySelector('.video-overlay').classList.add('opacity-0'); var r = this.querySelector('.replay-btn'); if(r) r.classList.add('hidden', 'scale-50', 'opacity-0'); var q = this.querySelector('.quote-btn'); if(q) q.classList.add('hidden', 'translate-y-10', 'opacity-0');">
            
            <video src="{filename}#t=0.1" preload="auto" playsinline muted
                onended="if(document.fullscreenElement || document.webkitFullscreenElement){ if(document.exitFullscreen) document.exitFullscreen(); else if(document.webkitExitFullscreen) document.webkitExitFullscreen(); } var group = this.closest('.group'); var btn = group.querySelector('.quote-btn'); var replay = group.querySelector('.replay-btn'); btn.classList.remove('hidden'); replay.classList.remove('hidden'); requestAnimationFrame(() => { btn.classList.remove('translate-y-10', 'opacity-0'); replay.classList.remove('scale-50', 'opacity-0'); });"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>

            <!-- Boton Mute/Unmute -->
            <button onclick="event.stopPropagation(); var v = this.closest('.group').querySelector('video'); v.muted = !v.muted; this.querySelector('i').className = v.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';"
                class="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors pointer-events-auto">
                <i class="fas fa-volume-mute"></i>
            </button>
            
            <div class="video-overlay transition-opacity duration-300 absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                    <h4 class="font-display font-bold text-2xl text-white group-hover:text-primary transition-colors max-w-[70%] drop-shadow-lg">
                        Título del video {id}
                    </h4>
                    <button class="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(242,125,38,0.5)] group-hover:scale-110 transition-transform flex-shrink-0 pointer-events-auto">
                        <i class="fas fa-play text-xl ml-1"></i>
                    </button>
                </div>
            </div>

            <!-- Replay Button (Centro) -->
            <div class="replay-btn absolute inset-0 flex items-center justify-center z-20 transition-all duration-500 scale-50 opacity-0 hidden pointer-events-none">
                <button onclick="event.stopPropagation(); var group = this.closest('.group'); var v = group.querySelector('video'); v.currentTime = 0; v.play(); if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen(); group.querySelector('.replay-btn').classList.add('hidden', 'scale-50', 'opacity-0'); group.querySelector('.quote-btn').classList.add('translate-y-10', 'opacity-0'); setTimeout(()=>group.querySelector('.quote-btn').classList.add('hidden'), 500);"
                    class="w-20 h-20 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-primary/50 hover:bg-primary/90 transition-colors pointer-events-auto shadow-[0_0_30px_rgba(242,125,38,0.5)] transform hover:scale-110 active:scale-95">
                    <i class="fas fa-redo text-3xl"></i>
                </button>
            </div>

            <!-- Botón de cotizar (Aparece al terminar el video) -->
            <div class="quote-btn absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-20 transition-all duration-700 translate-y-10 opacity-0 hidden">
                <button onclick="event.stopPropagation(); window.open('https://wa.me/573027502695?text=Hi,%20I%20want%20to%20quote%20a%20sign', '_blank');"
                    class="w-full py-4 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(242,125,38,0.5)] hover:scale-105 active:scale-95 transition-transform border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 pointer-events-auto">
                    <span>Cotizar mi letrero ahora</span>
                    <i class="fab fa-whatsapp text-xl"></i>
                </button>
            </div>
        </div>
"""

videos = [
    ('avisoenacrilico.mp4', 2),
    ('avisoneon.mp4', 3),
    ('avisozona7.mp4', 4),
    ('cajaluz.mp4', 5)
]

output = []
for filename, i in videos:
    output.append(html_template.format(id=i, filename=filename).strip("\n"))

content = '\n\n'.join(output)

with open('videos.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '<!-- Video 2 -->'
end_marker = '</section>'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + content + '\n    ' + text[end_idx:]
    with open('videos.html', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully replaced.")
else:
    print("Could not find markers.")
