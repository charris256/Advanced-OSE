import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url)).replace(/[\\/]$/,'');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf'};
const server=createServer(async(req,res)=>{try{const path=resolve(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html');if(!path.startsWith(root+sep))throw Error('Path outside application');const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
server.listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log(`The Adventurer’s Ledger: http://127.0.0.1:${server.address().port}\nPrivate local server. Press Ctrl+C to stop.`));
