import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import handler from '../api/index.js';
const root=path.resolve('public');
http.createServer(async(req,res)=>{try{if(req.url.startsWith('/api/')){let b='';for await(const part of req){b+=part;if(b.length>1048576){res.writeHead(413);return res.end();}}req.body=b||undefined;return await handler(req,res);}const u=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(4173,'127.0.0.1',()=>console.log('Collei: http://127.0.0.1:4173'));
