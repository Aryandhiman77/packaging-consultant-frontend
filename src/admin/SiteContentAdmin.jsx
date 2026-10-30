import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useApi } from '../context/ApiContext';

const homeFields = [['heading','Main Heading'],['lead','Lead Paragraph'],['paragraph1','First Paragraph'],['paragraph2','Second Paragraph'],['saying','Saying Intro'],['quote1','First Quote'],['quote2','Second Quote']];
let nextId=0;
const decorate = (links=[]) => links.map(link => ({...link,_localId:link._id || `new-link-${++nextId}`}));
const newLink = () => ({ _localId:`new-link-${++nextId}`,label:'',href:'/',column:1 });

function animateReorder(nodes, update) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const old = new Map();
  if (!reduce) for (const [key, node] of nodes) if(node) old.set(key,node.getBoundingClientRect());
  flushSync(update);
  if(reduce) return;
  for (const [key,node] of nodes) {
    const prev=old.get(key); if(!prev||!node?.isConnected||!node.animate)continue;
    const next=node.getBoundingClientRect(); const x=prev.left-next.left, y=prev.top-next.top;
    if(Math.abs(x)<1&&Math.abs(y)<1)continue;
    node.animate([{transform:`translate(${x}px,${y}px)`,boxShadow:'0 12px 24px #0002'},{transform:'translate(0,0)',boxShadow:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  }
}
export default function SiteContentAdmin(){
  const {request}=useApi(); const [site,setSite]=useState(null); const [links,setLinks]=useState([]);
  const [saved,setSaved]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const [tab,setTab]=useState('home');const [drag,setDrag]=useState(null); const rowRefs=useRef(new Map());
  useEffect(()=>{request('/api/admin/site-content').then(r=>{setSite(r.data);setLinks(decorate(r.data?.footer?.links));}).catch(e=>setError(e.message));},[request]);
  const editHome=(key,value)=>setSite(prev=>({...prev,home:{...prev.home,[key]:value}}));
  const editFooter=(key,value)=>setSite(prev=>({...prev,footer:{...prev.footer,[key]:value}}));
  function editLink(id,key,value){setLinks(items=>items.map(l=>l._localId===id?{...l,[key]:value}:l));}
  function reorder(from,to){if(from<0||to<0||from===to||to>=links.length||from>=links.length)return;
    animateReorder(rowRefs.current,()=>setLinks(prev=>{const items=[...prev];const [moved]=items.splice(from,1);items.splice(to,0,moved);return items}));
  }
  async function save(){setBusy(true);setError('');setSaved('');try{
    const data={home:site.home,contact:site.contact,footer:{address:site.footer.address,email:site.footer.email,links:links.map(({label,href,column})=>({label,href,column}))}};
    const result=await request('/api/admin/site-content',{method:'PUT',body:JSON.stringify(data)});
    setSite(result.data);setLinks(decorate(result.data?.footer?.links));setSaved('Saved. Website content is now updated.');
  }catch(e){setError(e.message)}finally{setBusy(false)}}
  const input='pc-field w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900';
  return <section className="space-y-6">
    <div><p className="pc-eyebrow">Website settings</p><h1 className="text-2xl font-black">Home &amp; Footer</h1><p className="mt-1 text-sm text-slate-500">Plain text fields. The home hero, Project Review and Art Templates stay unchanged.</p></div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Website section">
      <button type="button" role="tab" aria-selected={tab==='home'} className={`pc-tab ${tab==='home'?'is-active':''}`} onClick={()=>setTab('home')}>Home Copy &amp; Quotes</button>
      <button type="button" role="tab" aria-selected={tab==='footer'} className={`pc-tab ${tab==='footer'?'is-active':''}`} onClick={()=>setTab('footer')}>Footer</button>
    </div>
    {site&&tab==='home'&&<div className="pc-card grid gap-4 rounded-xl bg-white p-5">{homeFields.map(([key,label])=><label key={key} className="grid gap-2"><span className="font-semibold">{label}</span><textarea rows={['paragraph1','paragraph2','lead'].includes(key)?5:2} className={input} value={site.home?.[key]||''} onChange={e=>editHome(key,e.target.value)}/></label>)}</div>}
    {site&&tab==='footer'&&<div className="pc-card space-y-5 rounded-xl bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 font-semibold">Mailing Address<textarea className={input} rows={3} value={site.footer?.address||''} onChange={e=>editFooter('address',e.target.value)}/></label><label className="grid gap-1.5 font-semibold">Contact Email<input className={input} type="email" value={site.footer?.email||''} onChange={e=>editFooter('email',e.target.value)}/></label></div>
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold">Footer links ({links.length})</h2><p className="text-xs text-slate-500">Drag the handle or use ↑ ↓ to reorder. Rows move smoothly.</p></div><button type="button" className="pc-primary px-3 py-2" onClick={()=>setLinks(prev=>[...prev,newLink()])}>+ Add Link</button></div>
      <div className="space-y-3">{links.map((link,i)=><div key={link._localId} ref={node=>{if(node)rowRefs.current.set(link._localId,node);else rowRefs.current.delete(link._localId)}} className={`pc-reorder-row grid gap-3 rounded-xl border p-3 sm:grid-cols-[auto_1fr_1.5fr_auto_auto] sm:items-end ${drag===i?'is-dragging':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag!==null)reorder(drag,i);setDrag(null)}}>
      <button type="button" draggable aria-label={`Drag ${link.label||'new link'} to reorder`} title="Drag to reorder" className="pc-drag-handle self-center rounded border px-3 py-3" onDragStart={e=>{e.dataTransfer.effectAllowed='move';setDrag(i)}} onDragEnd={()=>setDrag(null)}>☷</button>
      <label className="grid gap-1 text-xs font-semibold">Label<input className={input} value={link.label} maxLength={110} onChange={e=>editLink(link._localId,'label',e.target.value)}/></label>
      <label className="grid gap-1 text-xs font-semibold">Destination<input className={input} value={link.href} onChange={e=>editLink(link._localId,'href',e.target.value)}/></label>
      <label className="grid gap-1 text-xs font-semibold">Column<select className={input} value={link.column} onChange={e=>editLink(link._localId,'column',Number(e.target.value))}><option value={1}>1</option><option value={2}>2</option></select></label>
      <div className="flex gap-1"><button type="button" aria-label={`Move ${link.label} up`} disabled={!i} className="pc-action" onClick={()=>reorder(i,i-1)}>↑</button><button type="button" aria-label={`Move ${link.label} down`} disabled={i===links.length-1} className="pc-action" onClick={()=>reorder(i,i+1)}>↓</button><button type="button" aria-label={`Remove ${link.label}`} className="pc-action text-red-600" onClick={()=>setLinks(prev=>prev.filter(item=>item._localId!==link._localId))}>×</button></div></div>)}</div>
    </div>}
    {saved&&<p role="status" className="pc-success p-3">{saved}</p>}{error&&<p role="alert" className="pc-error p-3">{error}</p>}{!site&&!error&&<p>Loading...</p>}
    {site&&<button type="button" onClick={save} disabled={busy} className="pc-primary px-7 py-3 disabled:opacity-50">{busy?'Saving...':'Save Changes'}</button>}
  </section>
}
