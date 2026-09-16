import {readFileSync} from 'node:fs';
export const categories=['characters','weapons','artifacts','banners','endgame'];
export const seed=JSON.parse(readFileSync(new URL('./catalog.json',import.meta.url),'utf8'));
export function validate(input){
 const text=(v,max)=>typeof v==='string'&&v.length<=max;
 if(!input||!categories.includes(input.category)||!text(input.id,100)||!/^[a-z0-9-]+$/.test(input.id)||!text(input.title,150)||!input.title.trim()||!text(input.summary,3000)||!['published','draft'].includes(input.status))throw Error('Check the title, category and publication status.');
 if(!Array.isArray(input.images)||input.images.length>20||input.images.some(u=>{try{return new URL(u).protocol!=='https:'||u.length>2000;}catch{return true;}}))throw Error('Use up to 20 HTTPS image links.');
 if(!Array.isArray(input.sections)||input.sections.length>40||input.sections.some(s=>!text(s.title,200)||!text(s.body,20000)))throw Error('Check the section titles and descriptions.');
 const extra={};
 if(input.category==='characters'){
  for(const field of ['cardImages','guideImages']){
   const urls=input[field]??(field==='cardImages'?input.images:[]);
   if(!Array.isArray(urls)||urls.length>20||urls.some(u=>{try{return typeof u!=='string'||u.length>2000||new URL(u).protocol!=='https:';}catch{return true;}}))throw Error('Use valid HTTPS card and guide links.');
   extra[field]=urls;
  }
  input={...input,images:[...new Set([...extra.cardImages,...extra.guideImages])]};
  if(input.images.length>20)throw Error('Use up to 20 card and guide images in total.');
 }
 if(input.category==='banners'&&input.sections.some(s=>['Asia','EU','NA'].includes(s.title)&&s.body.trim()&&!Number.isFinite(Date.parse(s.body))))throw Error('Banner dates must be valid ISO dates, or blank when unknown.');
 return {id:input.id,category:input.category,title:input.title.trim(),summary:input.summary,images:input.images,sections:input.sections.map(s=>({title:s.title,body:s.body})),status:input.status,...extra,updatedAt:new Date().toISOString()};
}
export function merge(overrides,admin=false){const map=new Map(seed.map(x=>[x.id,x]));for(const item of overrides){const {_id,...entry}=item;map.set(entry.id,entry);}return [...map.values()].filter(x=>admin||x.status==='published');}
