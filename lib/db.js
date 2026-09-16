import {MongoClient} from 'mongodb';
let pending;
export async function db(){if(!process.env.MONGODB_URI)throw Error('Database is not configured.');if(!pending)pending=(async()=>{const c=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,serverSelectionTimeoutMS:5000});await c.connect();const d=c.db(process.env.MONGODB_DATABASE||'collei_site');await d.collection('content').createIndex({id:1},{unique:true});await d.collection('login_limits').createIndex({expiresAt:1},{expireAfterSeconds:0});return d;})().catch(e=>{pending=null;throw e;});return pending;}
