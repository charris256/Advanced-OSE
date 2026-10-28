import {readdir,readFile,writeFile,mkdir,copyFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
let template=[];try{await access('private/character-record-sheet.pdf');await mkdir('dist/private',{recursive:true});await copyFile('private/character-record-sheet.pdf','dist/private/character-record-sheet.pdf');template=['./private/character-record-sheet.pdf'];}catch{}
const assets=(await readdir('dist/assets')).map(x=>'./assets/'+x);
const hash=createHash('sha256').update(await readFile('dist/index.html'));
for(const file of [...assets,...template])hash.update(file).update(await readFile('dist/'+file.slice(2)));
const version=hash.digest('hex').slice(0,12);
const files=['./','./index.html',...assets,...template];
await writeFile('dist/sw.js',`const CACHE='ose-ledger-${version}';const FILES=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ose-ledger-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())));});`);
console.log('Offline cache:',version,files.length,'assets');

