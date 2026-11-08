// 전단지 코너 API. Vercel Hobby 함수 12개 한도 때문에 별도 함수가 아니라
// api/crawl-discounts.js 가 ?fn=flyers 로 이 핸들러를 호출합니다 (vercel.json 에서 /api/flyers 를 그쪽으로 연결).
import { verifyAdminRequest } from './adminAuth.js';
import { FLYER_SOURCES } from './martFlyers.js';
const prefix = '__flyer_';
const today = () => new Date(Date.now()+32400000).toISOString().slice(0,10);
const validDate = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0,10) === d;
export default async function flyersHandler(req,res) {
  try {
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY, url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL;
    if(!key||!url) throw new Error('서버 저장소 설정이 필요합니다.');
    const db=async(path,init={})=>{const r=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates',...init.headers}});if(!r.ok) throw new Error('전단지 저장소 요청 실패');const t=await r.text();return t?JSON.parse(t):null;};
    const read=async store=>(await db(`products?id=eq.${encodeURIComponent(prefix+store)}&select=nutrition`))?.[0]?.nutrition || {store,auto:true,published:true,pages:[]};
    const save=async data=>db('products?on_conflict=id',{method:'POST',body:JSON.stringify({id:prefix+data.store,name:'SYSTEM_SETTINGS_CONTAINER',brand:'신상픽_시스템',category:'시스템',price:0,image:'',nutrition:data})});
    const cron=req.query.action==='cron';
    if(req.method==='GET'&&!cron){const rows=await Promise.all(Object.keys(FLYER_SOURCES).map(read));return res.json({items:rows.filter(x=>x.published&&x.startDate<=today()&&x.endDate>=today())});}
    const cronAuth=cron&&req.method==='GET'&&process.env.CRON_SECRET&&req.headers.authorization===`Bearer ${process.env.CRON_SECRET}`;
    if(!cronAuth){const auth=await verifyAdminRequest(req);if(!auth.ok)return res.status(auth.status).json({error:auth.error});}
    if(!['GET','POST'].includes(req.method)) return res.status(405).end();
    const body=req.body||{};
    if(body.action==='list')return res.json({items:await Promise.all(Object.keys(FLYER_SOURCES).map(read))});
    if(body.action==='save'){
      if(!FLYER_SOURCES[body.store])return res.status(400).json({error:'매장을 확인하세요.'});
      const old=await read(body.store);
      if(!validDate(body.startDate)||!validDate(body.endDate)||body.startDate>body.endDate)return res.status(400).json({error:'올바른 시작일과 종료일을 입력하세요.'});
      await save({...old,startDate:body.startDate,endDate:body.endDate,auto:body.auto===true,published:body.published===true});
    }else if(cron||body.action==='collect'){
      const stores=body.store?[body.store]:Object.keys(FLYER_SOURCES);
      if(stores.some(s=>!FLYER_SOURCES[s]))return res.status(400).json({error:'잘못된 매장'});
      await Promise.all(stores.map(async store=>{
        const old=await read(store);if(cron&&!old.auto)return;
        try{const flyer=await FLYER_SOURCES[store]();if(!validDate(flyer.startDate)||!validDate(flyer.endDate)||flyer.startDate>flyer.endDate)throw new Error('행사기간 확인 실패');
          const pages=[...new Set(flyer.pages.map(p=>p.image).filter(Boolean))].map(image=>({image:new URL(image,flyer.sourceUrl).href})).filter(p=>p.image.startsWith('https://'));
          if(!pages.length)throw new Error('전단 이미지가 없습니다.');
          const same=old.sourceStart===flyer.startDate&&old.sourceEnd===flyer.endDate;
          await save({...old,...flyer,pages,startDate:same?old.startDate:flyer.startDate,endDate:same?old.endDate:flyer.endDate,sourceStart:flyer.startDate,sourceEnd:flyer.endDate,checkedAt:new Date().toISOString(),error:''});
        }catch(e){await save({...old,checkedAt:new Date().toISOString(),error:e.message});}
      }));
    }else return res.status(400).json({error:'잘못된 작업'});
    return res.json({items:await Promise.all(Object.keys(FLYER_SOURCES).map(read))});
  }catch(e){return res.status(500).json({error:e.message});}
}
