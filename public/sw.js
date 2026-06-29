// LayerLab Service Worker - estrategia "rede primeiro" para sempre pegar a versao nova
const CACHE = "layerlab-v2";
const PRECACHE = ["/manifest.json", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  // ativa a versao nova imediatamente, sem esperar
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  // apaga caches antigos (v1 etc) e assume o controle na hora
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Chamadas Supabase: sempre rede, nunca cache
  if (req.url.includes("supabase.co")) {
    e.respondWith(fetch(req));
    return;
  }

  // Navegacao (HTML) e scripts/estilos: REDE PRIMEIRO.
  // Assim o app sempre carrega a versao mais recente quando online.
  const isDoc = req.mode === "navigate" || req.destination === "document";
  const isAsset = req.destination === "script" || req.destination === "style";

  if (isDoc || isAsset) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          // guarda uma copia fresca pra funcionar offline depois
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("/")))
    );
    return;
  }

  // Imagens e demais recursos: cache primeiro (sao estaveis)
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type !== "basic") return res;
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(req, clone));
        return res;
      });
    })
  );
});
