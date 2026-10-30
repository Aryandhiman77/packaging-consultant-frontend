import {useEffect,useState} from 'react';
import {useApi} from '../context/ApiContext';
const fields=[['title','Contact Page Title'],['subtitle','Intro Heading'],['intro','Intro Paragraph'],['moreHeading','Project Review Heading'],['moreText','Project Review Paragraph']];
export default function ContactCopyAdmin(){const {request}=useApi();const [site,setSite]=useState(null);const [error,setError]=useState('');const [saved,setSaved]=useState('');const [busy,setBusy]=useState(false);
  useEffect(()=>{request('/api/admin/site-content').then(r=>setSite(r.data)).catch(e=>setError(e.message))},[request]);
  const edit=(key,value)=>setSite(prev=>({...prev,contact:{...prev.contact,[key]:value}}));
  async function save(){setBusy(true);setError('');setSaved('');try{const r=await request('/api/admin/site-content',{method:'PUT',body:JSON.stringify({home:site.home,contact:site.contact,footer:{address:site.footer.address,email:site.footer.email,links:site.footer.links.map(({label,href,column})=>({label,href,column}))}})});setSite(r.data);setSaved('Contact page text saved.')}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <section className="space-y-5"><div><p className="pc-eyebrow">Public site content</p><h1 className="text-2xl font-black">Contact Page Copy</h1><p className="text-sm text-slate-500">Contact page wording is managed here, separate from Home &amp; Footer. Form fields and backend validation stay unchanged.</p></div>
  {site&&<div className="pc-card grid gap-4 rounded-xl border p-5">{fields.map(([key,label])=><label key={key} className="grid gap-2 font-semibold">{label}<textarea className="pc-field w-full rounded-xl border px-3 py-2.5" rows={key==='intro'||key==='moreText'?4:2} value={site.contact?.[key]||''} onChange={e=>edit(key,e.target.value)}/></label>)}</div>}
  {error&&<p role="alert" className="pc-error p-3">{error}</p>}{saved&&<p role="status" className="pc-success p-3">{saved}</p>}{site&&<button type="button" disabled={busy} className="pc-primary px-6 py-3" onClick={save}>{busy?'Saving...':'Save Contact Copy'}</button>}
  </section>
}
