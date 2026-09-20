import {Receipt} from '@/types'
export function patterns(rs:Receipt[]){
 const music=rs.filter(r=>r.type==='music'), purchases=rs.filter(r=>r.type==='purchase'); const late=music.filter(r=>{const h=new Date(r.timestamp).getHours();return h<5}).length
 const artist=new Map<string,number>(); music.forEach(r=>artist.set(r.subtitle||r.title,(artist.get(r.subtitle||r.title)||0)+1))
 const top=[...artist.entries()].sort((a,b)=>b[1]-a[1])[0]
 const cats=new Map<string,number>(); purchases.forEach(r=>cats.set(r.category,(cats.get(r.category)||0)+1)); const cat=[...cats.entries()].sort((a,b)=>b[1]-a[1])[0]
 return [{label:'The late-hour signal',value:`${late} music receipts land between midnight and 5 AM.`,detail:'This is calculated directly from receipt timestamps.',ids:music.filter(r=>new Date(r.timestamp).getHours()<5).slice(0,8).map(r=>r.id)}, {label:'A long-term constant',value:top?`${top[0]} appears ${top[1]} times in this view.`:'No repeat artist found.',detail:'Grouped by the artist field in the music receipts.',ids:top?music.filter(r=>(r.subtitle||r.title)===top[0]).map(r=>r.id).slice(0,8):[]}, {label:'The everyday category',value:cat?`${cat[0]} is the most repeated purchase category.`:'No repeated purchase category found.',detail:'Grouped by the category field in the purchase receipts.',ids:cat?purchases.filter(r=>r.category===cat[0]).map(r=>r.id).slice(0,8):[]}]
}
