import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { getAdminAuthHeaders } from '../../services/adminAuth';
type Flyer = {store:string;auto:boolean;published:boolean;startDate?:string;endDate?:string;sourceUrl?:string;pages:{image:string}[];checkedAt?:string;error?:string};
const endpoint = `${Capacitor.isNativePlatform() ? 'https://sinsangpick.kr' : ''}/api/flyers`;
export function FlyerSection({admin=false}:{admin?:boolean}) {
 const [items,setItems]=useState<Flyer[]>([]),[selected,setSelected]=useState('전체'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[open,setOpen]=useState(false);
 async function request(body?:object){setBusy(true);setError('');try{const r=await fetch(endpoint,body?{method:'POST',headers:{'Content-Type':'application/json',...await getAdminAuthHeaders()},body:JSON.stringify(body)}:undefined);const data=await r.json();if(!r.ok)throw new Error(data.error||'불러오기 실패');setItems(data.items);}catch(e){setError(e instanceof Error?e.message:'요청 실패');}finally{setBusy(false);}}
 useEffect(()=>{void request(admin?{action:'list'}:undefined);},[admin]);
 const edit=(store:string,patch:Partial<Flyer>)=>setItems(old=>old.map(x=>x.store===store?{...x,...patch}:x));
 return <section className="bg-white text-gray-900 rounded-2xl p-5 my-3 border border-gray-100">
 <div className="flex justify-between items-center gap-3"><div><h2 className="text-lg font-bold">전단지</h2><p className="text-xs text-gray-500 mt-1">우리 동네 마트 행사 한눈에 · 점포별 상품과 가격이 다를 수 있어요</p></div>{!admin&&<button className="shrink-0 text-sm font-bold" onClick={()=>setOpen(!open)}>{open?'접기':'전단 보기'}</button>}</div>
 {admin&&<p className="text-sm my-3">자동 수집: 매일 오전 7시 (한국시간). 새 행사 기간은 자동 반영되고, 같은 전단의 수동 수정 기간은 유지됩니다. 종료된 전단은 자동으로 숨겨집니다.</p>}
 {error&&<p role="alert" className="text-red-600 my-3">{error} <button onClick={()=>request(admin?{action:'list'}:undefined)}>다시 시도</button></p>}
 {busy&&<p role="status">처리 중…</p>}
 {(admin||open)&&<><div className="flex flex-wrap gap-2 my-4">{['전체','홈플러스','이마트','롯데슈퍼','롯데마트'].map(s=><button key={s} onClick={()=>setSelected(s)} className={`px-3 py-2 rounded-full text-sm ${selected===s?'bg-gray-900 text-white':'bg-gray-100'}`}>{s}</button>)}</div>
 {!busy&&!items.filter(x=>selected==='전체'||x.store===selected).length&&<p className="py-6 text-gray-500">현재 공개된 전단지가 없습니다.</p>}
 <div className="grid gap-5 md:grid-cols-2">{items.filter(x=>selected==='전체'||x.store===selected).map(x=><article key={x.store} className="border rounded-xl p-4 min-w-0"><h3 className="font-bold">{x.store}</h3>
 <p className="text-sm my-2">{x.startDate&&x.endDate?`${x.startDate} ~ ${x.endDate}`:'수집 대기'}</p>
 {admin&&<div className="space-y-3 my-3"><div className="flex flex-wrap gap-2"><label>시작일 <input aria-label={`${x.store} 시작일`} type="date" value={x.startDate||''} onChange={e=>edit(x.store,{startDate:e.target.value})}/></label><label>종료일 <input aria-label={`${x.store} 종료일`} type="date" value={x.endDate||''} onChange={e=>edit(x.store,{endDate:e.target.value})}/></label></div><label className="mr-4"><input type="checkbox" checked={x.auto} onChange={e=>edit(x.store,{auto:e.target.checked})}/> 자동 수집</label><label><input type="checkbox" checked={x.published} onChange={e=>edit(x.store,{published:e.target.checked})}/> 공개</label><div className="flex gap-3"><button disabled={busy} className="bg-gray-900 text-white rounded px-3 py-2" onClick={()=>request({...x,action:'save'})}>설정 저장</button><button disabled={busy} onClick={()=>request({action:'collect',store:x.store})}>지금 수집</button></div><p className="text-xs">최근 확인: {x.checkedAt?new Date(x.checkedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'없음'}</p>{x.error&&<p className="text-red-600 text-sm">수집 실패: {x.error} (기존 전단 유지)</p>}</div>}
 <div className="flex gap-2 overflow-x-auto">{x.pages.map((p,i)=><a key={p.image} href={p.image} target="_blank" rel="noreferrer" className="shrink-0 w-56"><img src={p.image} alt={`${x.store} 전단 ${i+1}면 · 누르면 확대`} loading="lazy" className="w-full rounded border"/></a>)}</div>{x.sourceUrl&&<a className="inline-block mt-3 text-sm underline" href={x.sourceUrl} target="_blank" rel="noreferrer">공식 전단 보기 ↗</a>}</article>)}</div></>}
 </section>;
}
