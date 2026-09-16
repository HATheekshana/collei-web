import {createHmac,timingSafeEqual,randomBytes} from 'node:crypto';
export function equal(a,b){const x=Buffer.from(a||''),y=Buffer.from(b||'');return x.length===y.length&&timingSafeEqual(x,y);}
export function configured(){return (process.env.ADMIN_PASSWORD||'').length>=20&&(process.env.SESSION_SECRET||'').length>=32;}
export function sign(value){return createHmac('sha256',process.env.SESSION_SECRET).update(value).digest('base64url');}
export function session(){const value=`${Date.now()+8*3600000}.${randomBytes(16).toString('hex')}`;return `${value}.${sign(value)}`;}
export function authenticated(req){if(!configured())return false;const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('collei_session='))?.slice(15)||'';const p=token.split('.');return p.length===3&&Number(p[0])>Date.now()&&equal(p[2],sign(`${p[0]}.${p[1]}`));}
export function sameOrigin(req){const expected=process.env.SITE_ORIGIN;return Boolean(expected&&req.headers.origin===expected);}
export function cookie(value,maxAge=28800){return `collei_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.SITE_ORIGIN?.startsWith('https:')?'; Secure':''}`;}
