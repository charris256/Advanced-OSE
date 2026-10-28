import {abilities,newCharacter,defaultConfig,rollAbility,die,rules,requirementErrors,classErrors,addHP,allowedItem,equipment,arcane,row,spellsFor,learn,prepare,validateImport,limit,proficiencyInfo} from './engine.ts';
import type {Character,Mode,Config,Scores} from './engine.ts';
import {equipItem} from './equipmentActions.ts';
export function randomName(rng=Math.random){const first=['Alda','Bram','Cora','Dain','Edda','Finn','Galen','Hesta','Ivo','Jora','Kest','Lysa','Marek','Nella','Orrin','Petra','Quill','Runa','Soren','Tamsin'],last=['Ashford','Blackthorn','Copperhill','Duskwood','Evenstar','Foxglove','Greybrook','Hawthorne','Ironwood','Lantern','Mossvale','Northwind','Oakheart','Reedwater','Silverleaf','Thornfield'];return first[die(first.length,rng)-1]+' '+last[die(last.length,rng)-1];}
// Use the supplied campaign configuration; dice are never silently rerolled.
export function randomCharacter(mode:Mode|Config='advanced',ac:Config['ac']='descending',rng=Math.random,manualScores?:Scores):Character{
 const c=newCharacter(),at=c.created;
 function choose<T>(xs:T[]):T{if(!xs.length)throw Error('No eligible random choice');return xs.length===1?xs[0]:xs[die(xs.length,rng)-1];}
 c.config=typeof mode==='object'?structuredClone(mode):{...defaultConfig,mode:mode==='classic'?'classic':'advanced',ac,name:mode==='classic'?'Standard Classic':'Standard Advanced'};
 validateImport(c);
 if(c.config.method==='manual'){if(!manualScores)throw Error('Enter manual ability scores before generating this campaign.');c.base={...manualScores};validateImport(c);}
 for(const ability of abilities){if(c.config.method==='manual'){c.rolls.push({at,ability,dice:[],total:c.base[ability],method:'Manual scores retained'});continue;}const r=rollAbility(c.config,rng);c.base[ability]=r.total;c.rolls.push({at,ability,...r,method:c.config.method});}
 c.alignment=choose<Character['alignment']>(['Lawful','Neutral','Chaotic']);
 const candidates=rules.races.filter(r=>c.config.mode==='classic'?r.id==='human':!requirementErrors(r.requirements,c.base).length).map(r=>{c.race=r.id;return {race:r.id,classes:rules.classes.filter(cl=>!classErrors(c,cl.id).length)};}).filter(r=>r.classes.length);
 const selected=choose(candidates);c.race=selected.race;const pool=[...selected.classes],count=c.config.multiclass&&c.config.mode!=='classic'?die(Math.min(3,pool.length),rng):1;for(let i=0;i<count;i++){const chosen=choose(pool);pool.splice(pool.indexOf(chosen),1);if(i===0)c.classes=[];c.classes.push({id:chosen.id,level:1,xp:0});}
 c.name=randomName(rng);
 for(const cs of c.classes){const level=c.config.mode==='custom'?Math.min(c.config.startingLevel,limit(c,cs.id)):1;for(let n=1;n<=level;n++){cs.level=n;addHP(c,cs,rng);}cs.xp=row(cs).xp;}const goldDice=[die(6,rng),die(6,rng),die(6,rng)],startingGold=c.config.mode==='custom'&&c.config.startingGold>=0?c.config.startingGold:goldDice.reduce((a,b)=>a+b,0)*10;c.gold=startingGold;c.goldRolled=true;c.rolls.push({at,ability:'Gold',dice:goldDice,total:startingGold,method:c.config.mode==='custom'&&c.config.startingGold>=0?'Custom starting gold':'3d6 × 10'});
 function buy(id:string){const e=equipment(id);if(e.cost>c.gold||!allowedItem(c,id))return false;c.gold-=e.cost;c.inventory.push({id,qty:1,equipped:false});return true;}
 // Reserve class essentials first; low purses receive only what they can afford.
 if(c.classes.some(cs=>cs.id==='cleric'))buy('holy symbol');if(c.classes.some(cs=>['thief','assassin'].includes(cs.id)))buy('thieves’ tools');
 const weapons=rules.equipment.filter(e=>e.kind==='weapon'&&e.qualities.includes('Melee')&&allowedItem(c,e.id)&&e.cost<=c.gold);const weapon=weapons.length?choose(weapons):undefined;if(weapon){buy(weapon.id);equipItem(c,'weapon',weapon.id);}
 for(const id of ['waterskin','torches (6)','rations (standard, 7 days)','tinder box (flint & steel)','backpack','rope (50’)'])buy(id);
 const armor=rules.equipment.filter(e=>e.kind==='armor'&&allowedItem(c,e.id)&&e.cost<=c.gold);if(armor.length){const item=choose(armor);buy(item.id);equipItem(c,'armor',item.id);}
 const shields=rules.equipment.filter(e=>e.kind==='shield'&&allowedItem(c,e.id)&&e.cost<=c.gold);if(!weapon?.qualities.includes('Two-handed')&&shields.length){const item=choose(shields);buy(item.id);equipItem(c,'shield',item.id);}
 for(const cs of c.classes)for(let level=1;level<=row(cs).slots.length;level++){const count=row(cs).slots[level-1];const choices=spellsFor(c,cs).filter(s=>s.level===level);for(let n=0;n<count;n++){const spell=choose(choices.filter(s=>!(c.known[cs.id]||[]).includes(s.id)));if(arcane(cs.id))learn(c,cs.id,spell.id);prepare(c,cs.id,spell.id);}}
 if(c.config.proficiencies){const pool=rules.equipment.filter(e=>e.kind==='weapon'&&allowedItem(c,e.id)).map(e=>e.id);if(weapon)c.proficient.push(weapon.id);while(c.proficient.length<Math.min(proficiencyInfo(c).count,pool.length)){c.proficient.push(choose(pool.filter(id=>!c.proficient.includes(id))));}}
 if(c.config.secondary){const roll=die(100,rng),pick=(n:number)=>rules.secondarySkills.find(s=>n<=s.max)?.name||'Referee chooses';c.secondary=roll>=99?[pick(die(98,rng)),pick(die(98,rng))]:[pick(roll)];}
 c.notes='Randomly generated using '+c.config.name+'. Manual abilities, if selected, were retained. Equipment was purchased from '+startingGold+' gp. Starting spells, class duties, deity and any demihuman clergy choices need referee review.';
 c.history.push({at,event:'Generated a random character using '+c.config.name+'; ability dice, HP and wealth recorded. Starting purse: '+startingGold+' gp.'});
 return validateImport(c);
}
