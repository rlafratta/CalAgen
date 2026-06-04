/* =====================================================
   SERVICE WORKER — Agenda Contador Público
   Maneja notificaciones push de vencimientos
   ===================================================== */

const CACHE_NAME = 'agenda-cp-v1';
const ASSETS = ['./index.html', './sw.js'];

// --- INSTALACIÓN ---
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// --- ACTIVACIÓN ---
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// --- FETCH (cache first) ---
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// --- NOTIFICACIONES PROGRAMADAS ---
// El SW recibe mensajes desde la app principal para programar alarmas
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_CHECK') {
    checkAndNotify(e.data.payload);
  }
});

// --- VERIFICAR Y NOTIFICAR ---
async function checkAndNotify(data) {
  const { vencimientosHoy, vencimientosManana, fecha } = data;

  if (vencimientosHoy && vencimientosHoy.length > 0) {
    await self.registration.showNotification('📅 Vencimientos de HOY', {
      body: vencimientosHoy.slice(0, 5).map(v =>
        `• ${v.org}: ${v.desc}${v.contribuyente ? ' (' + v.contribuyente + ')' : ''}`
      ).join('\n') + (vencimientosHoy.length > 5 ? `\n  ...y ${vencimientosHoy.length - 5} más` : ''),
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'venc-hoy-' + fecha,
      renotify: false,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { url: './', tipo: 'hoy' }
    });
  }

  if (vencimientosManana && vencimientosManana.length > 0) {
    await self.registration.showNotification('⏰ Vencimientos de MAÑANA', {
      body: vencimientosManana.slice(0, 5).map(v =>
        `• ${v.org}: ${v.desc}${v.contribuyente ? ' (' + v.contribuyente + ')' : ''}`
      ).join('\n') + (vencimientosManana.length > 5 ? `\n  ...y ${vencimientosManana.length - 5} más` : ''),
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'venc-manana-' + fecha,
      renotify: false,
      requireInteraction: false,
      vibrate: [100, 50, 100],
      data: { url: './', tipo: 'manana' }
    });
  }
}

// --- AL HACER CLICK EN LA NOTIFICACIÓN ---
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// --- SYNC EN BACKGROUND (para dispositivos que lo soporten) ---
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-vencimientos') {
    e.waitUntil(periodicCheck());
  }
});

async function periodicCheck() {
  // Obtiene datos del cliente activo y verifica vencimientos
  const clientList = await clients.matchAll({ type: 'window' });
  if (clientList.length > 0) {
    clientList[0].postMessage({ type: 'REQUEST_VENC_CHECK' });
  }
}
