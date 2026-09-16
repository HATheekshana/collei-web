import {createHash} from 'node:crypto';
import {authenticated,configured,equal,session,cookie,sameOrigin} from '../lib/auth.js';
import {db} from '../lib/db.js';
import {seed,merge,validate} from '../lib/catalog.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const send=(code,data)=>{res.statusCode=code;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
 const route=new URL(req.url,'http://localhost').pathname.replace(/^\/api\/?/,'');
 try{
  if(req.method==='GET'&&route==='session')return send(200,{authenticated:authenticated(req),configured:configured()&&Boolean(process.env.MONGODB_URI)});
  if(req.method==='GET'&&route==='catalog'){
   const admin=authenticated(req);let entries=seed,mode='snapshot';
   if(process.env.MONGODB_URI){entries=merge(await (await db()).collection('content').find({},{projection:{_id:0}}).toArray(),admin);mode='connected';}
   return send(200,{entries:entries.filter(x=>admin||x.status==='published'),mode,source:'Imported Collei snapshot; dates and availability are not live unless updated by an administrator.'});
  }
  if(!['POST','PUT'].includes(req.method))return send(405,{error:'Method not allowed.'});
  if(!sameOrigin(req))return send(403,{error:'Request origin is not allowed.'});
  if(!configured())return send(503,{error:'Admin access has not been configured.'});
  let body=req.body;
  if(typeof body==='string'){if(Buffer.byteLength(body)>1024*1024)return send(413,{error:'Content is too large.'});body=JSON.parse(body);}
  if(route==='login'&&req.method==='POST'){
   const database=await db();const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'unknown');
   const slot=Math.floor(Date.now()/900000);const key=createHash('sha256').update(ip+slot).digest('hex');
   const limit=await database.collection('login_limits').findOneAndUpdate({_id:key},{$inc:{attempts:1},$setOnInsert:{expiresAt:new Date(Date.now()+1800000)}},{upsert:true,returnDocument:'after'});
   if(limit.attempts>10)return send(429,{error:'Too many attempts. Try again in 15 minutes.'});
   if(!equal(body?.password,process.env.ADMIN_PASSWORD))return send(401,{error:'Incorrect password.'});
   res.setHeader('Set-Cookie',cookie(session()));return send(200,{ok:true});
  }
  if(!authenticated(req))return send(401,{error:'Sign in to continue.'});
  if(route==='logout'){res.setHeader('Set-Cookie',cookie('',0));return send(200,{ok:true});}
  if(route==='content'&&req.method==='PUT'){
   let item;try{item=validate(body);}catch(e){return send(400,{error:e.message});}
   await (await db()).collection('content').updateOne({id:item.id},{$set:item},{upsert:true});return send(200,{item});
  }
  return send(404,{error:'Not found.'});
 }catch(e){console.error('Collei API:',e.name);return send(503,{error:'The service is temporarily unavailable. Check the server configuration and retry.'});}
}
