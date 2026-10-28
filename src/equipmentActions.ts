import type {Character} from './engine.ts';
import {allowedItem,equipment} from './engine.ts';
export type GearSlot='armor'|'shield'|'weapon';
export function equipItem(c:Character,slot:GearSlot,id:string){
 const item=id?c.inventory.find(i=>i.id===id):undefined;
 if(id&&(!item||equipment(id).kind!==slot||!allowedItem(c,id)))throw Error('Choose an allowed item from your pack.');
 c.inventory.forEach(i=>{const e=equipment(i.id);if(e.kind===slot)i.equipped=false;if(item&&equipment(id).qualities.includes('Two-handed')&&e.kind==='shield')i.equipped=false;if(item&&slot==='shield'&&e.qualities.includes('Two-handed'))i.equipped=false;});
 if(item)item.equipped=true;
}

