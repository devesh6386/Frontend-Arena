import { Receipt, Connection, Thread } from '@/types'
const day=(r:Receipt)=>new Date(r.timestamp).toISOString().slice(0,10)
export function findConnections(receipts:Receipt[], limit=80):Connection[]{
 const out:Connection[]=[]
 for(let i=0;i<receipts.length;i++) for(let j=i+1;j<receipts.length;j++){
  const a=receipts[i],b=receipts[j]; const mins=Math.abs(new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime())/60000; const reasons:string[]=[]
  if(day(a)===day(b)) reasons.push('same date')
  if(mins<=45) reasons.push(`${Math.round(mins)} minutes apart`)
  const shared=a.tags.filter(x=>b.tags.includes(x)&&x.length>2)
  if(shared.length) reasons.push(`shared tag: ${shared[0]}`)
  if(reasons.length && a.type!==b.type){ const score=(day(a)===day(b)?3:0)+(mins<=45?3:0)+shared.length; out.push({a,b,score,reasons}) }
 }
 return out.sort((x,y)=>y.score-x.score).slice(0,limit)
}
export function buildThreads(receipts:Receipt[]):Thread[]{
 const cons=findConnections(receipts,200), used=new Set<string>(), threads:Thread[]=[]
 for(const c of cons){ if(used.has(c.a.id)&&used.has(c.b.id)) continue; const rs=[c.a,c.b]; used.add(c.a.id);used.add(c.b.id)
  const same=cons.filter(x=>rs.some(r=>r.id===x.a.id||r.id===x.b.id)).slice(0,4)
  same.forEach(x=>{[x.a,x.b].forEach(r=>{if(!rs.find(y=>y.id===r.id))rs.push(r);used.add(r.id)})})
  const d=day(c.a); threads.push({id:`thread-${threads.length}`,title:rs.length>2?'A day with a rhythm':'Two receipts, one moment',summary:`${rs.length} receipts converge on ${new Date(d+'T12:00').toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}.`,receipts:rs.sort((a,b)=>a.timestamp.localeCompare(b.timestamp)),reasons:[...new Set(same.flatMap(x=>x.reasons))],date:d})
  if(threads.length>=8)break
 }
 return threads
}
