export type ReceiptType = 'music' | 'purchase' | string
export type Receipt = { id:string; type:ReceiptType; timestamp:string; title:string; subtitle?:string; category:string; source:string; amount?:number; duration?:number; tags:string[]; evidence?:Record<string,string> }
export type Connection = { a:Receipt; b:Receipt; score:number; reasons:string[] }
export type Thread = { id:string; title:string; summary:string; receipts:Receipt[]; reasons:string[]; date:string }
