/* =====================================================
   SERVICE WORKER — Agenda Contador Público v4
   ===================================================== */
const CACHE_NAME = 'agenda-cp-v4';
const ASSETS = ['./index.html', './sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_CHECK') checkAndNotify(e.data.payload);
});
async function checkAndNotify({ vencimientosHoy, vencimientosManana, fecha }) {
  if (vencimientosHoy?.length) {
    await self.registration.showNotification('📅 Vencimientos de HOY', {
      body: vencimientosHoy.slice(0,5).map(v=>`• ${v.org}: ${v.desc}${v.contribuyente?' ('+v.contribuyente+')':''}`).join('\n'),
      icon:'./icon-192.png', badge:'./icon-192.png', tag:'venc-hoy-'+fecha,
      requireInteraction:true, vibrate:[200,100,200], data:{url:'./'}
    });
  }
  if (vencimientosManana?.length) {
    await self.registration.showNotification('⏰ Vencimientos de MAÑANA', {
      body: vencimientosManana.slice(0,5).map(v=>`• ${v.org}: ${v.desc}${v.contribuyente?' ('+v.contribuyente+')':''}`).join('\n'),
      icon:'./icon-192.png', badge:'./icon-192.png', tag:'venc-manana-'+fecha,
      requireInteraction:false, vibrate:[100,50,100], data:{url:'./'}
    });
  }
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    if (clients.openWindow) return clients.openWindow('./');
  }));
});
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-vencimientos') e.waitUntil((async()=>{
    const list = await clients.matchAll({type:'window'});
    if (list.length) list[0].postMessage({type:'REQUEST_VENC_CHECK'});
  })());
});
