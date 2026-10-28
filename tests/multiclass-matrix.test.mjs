import test from 'node:test';
import assert from 'node:assert/strict';
import {rules,newCharacter,addHP,stats,awardXP,xpToNext,validateImport} from '../src/engine.ts';
const conBonus=[-3,-2,-2,-1,-1,-1,0,0,0,0,1,1,1,2,2,3];
const professions=rules.classes.filter(c=>!c.demihuman);
const combinations=[];
for(let a=0;a<professions.length;a++)for(let b=a+1;b<professions.length;b++){
 combinations.push([professions[a],professions[b]]);
 for(let d=b+1;d<professions.length;d++)combinations.push([professions[a],professions[b],professions[d]]);
}
const context=(classes)=>{const c=newCharacter();c.name='Matrix audit';c.config={...c.config,mode:'custom',override:true,ignoreLimits:true,multiclass:classes.length>1,hp:'maximum',method:'manual'};c.classes=classes.map(cl=>({id:cl.id,level:1,xp:0}));return c;};
function percentFor(id,score){if(['barbarian','paladin'].includes(id))return score>=16?110:score>=13?105:100;return score<=5?80:score<=8?90:score<=12?100:score<=15?105:110;}
test('all 22 class HP tables: every CON score, die result, level, and division by 1/2/3',()=>{
 let checks=0;
 for(const cl of rules.classes)for(let count=1;count<=3;count++){
  const fillers=professions.filter(p=>p.id!==cl.id).slice(0,count-1),c=context([cl,...fillers]);
  for(let con=3;con<=18;con++){
   c.base.CON=con;
   for(const level of cl.progression){
    const previous=cl.progression[level.level-2],fixed=level.hd.includes('+');
    for(let roll=1;roll<=cl.die;roll++){
     c.classes[0].level=level.level;c.hp=[];c.currentHP=0;
     const fixedIncrease=fixed?Number(level.hd.match(/\+(\d+)/)[1])-Number(previous.hd.match(/\+(\d+)/)?.[1]||0):null;
     c.config.hp='roll';addHP(c,c.classes[0],()=>(roll-.5)/cl.die);
     const expected=fixed?fixedIncrease:Math.max(1,roll+conBonus[con-3]);
     assert.equal(c.hp[0].gain,expected/count,`${cl.name} level ${level.level}, CON ${con}, d${cl.die}=${roll}, ${count} classes`);
     assert.equal(c.hp[0].con,fixed?0:conBonus[con-3]);checks++;
    }
   }
  }
 }
 console.log('HP contribution cases checked:',checks);
});
test('all 364 two/three-profession sets: HP totals through every level and CON score',()=>{
 let checks=0;
 for(const classes of combinations)for(let con=3;con<=18;con++){
  const c=context(classes);c.base.CON=con;
  for(let level=1;level<=14;level++){
   for(const cs of c.classes){cs.level=level;addHP(c,cs);}
   const numerator=classes.reduce((sum,cl)=>{const hd=cl.progression[level-1].hd.match(/^(\d+)d\d+(?:\+(\d+))?/);return sum+Number(hd[1])*Math.max(1,cl.die+conBonus[con-3])+Number(hd[2]||0);},0);
   const expectedWhole=Math.max(1,Math.floor(numerator/classes.length));
   const actual=stats(c);
   assert.equal(actual.hp,expectedWhole,classes.map(cl=>cl.id).join('/')+' CON '+con+' level '+level);
   assert.equal(c.currentHP,expectedWhole);
   assert.equal(actual.hpRemainder,(numerator%classes.length)/classes.length);checks++;
  }
 }
 console.log('Multiclass cumulative HP states checked:',checks);
});
test('all 364 two/three-profession sets: XP shares, bonuses, repeated awards and next thresholds',()=>{
 let checks=0;
 for(const classes of combinations)for(let score=3;score<=18;score++){
  const c=context(classes);for(const a of ['STR','INT','WIS','DEX','CON','CHA'])c.base[a]=score;
  let total=0;
  for(const award of [1,2,3,99,100,1000]){
   total+=award;awardXP(c,award);
   for(const cs of c.classes){
    const factor=percentFor(cs.id,score),ticks=total*120*factor/(100*classes.length);
    assert.ok(Number.isInteger(ticks));assert.equal(cs.xp,ticks/120,classes.map(cl=>cl.id).join('/')+' score '+score+' total '+total);
    const next=xpToNext(c,cs),expectedAward=Math.max(0,Math.ceil(((next.threshold*120-ticks)*classes.length*100)/(factor*120)));
    assert.equal(next.awardRequired,expectedAward);checks++;
   }
  }
  const restored=validateImport(JSON.parse(JSON.stringify(c)));assert.deepEqual(restored.classes,c.classes);
 }
 console.log('Multiclass XP states checked:',checks);
});
test('every two-prime class uses its source-specific bonus across all score pairs',async()=>{const {xpModifier}=await import('../src/engine.ts');const cases=[['barbarian','STR','CON',(a,b)=>a>=16&&b>=16?.1:a>=13||b>=13?.05:0],['paladin','STR','WIS',(a,b)=>a>=16&&b>=16?.1:a>=13||b>=13?.05:0],['drow','STR','WIS',(a,b)=>a>=13&&b>=16?.1:a>=13&&b>=13?.05:0],['elf','STR','INT',(a,b)=>a>=13&&b>=16?.1:a>=13&&b>=13?.05:0],['gnome','DEX','INT',(a,b)=>a>=13&&b>=16?.1:a>=13&&b>=13?.05:0],['half-elf','STR','INT',(a,b)=>a>=13&&b>=13?(a>=16||b>=16?.1:.05):0],['halfling','STR','DEX',(a,b)=>a>=13&&b>=13?.1:a>=13||b>=13?.05:0],['half-orc','STR','DEX',(a,b)=>a>=16&&b>=16?.1:a>=13&&b>=13?.05:0]];for(const [id,first,second,expected] of cases)for(let a=3;a<=18;a++)for(let b=3;b<=18;b++){const c=context([rules.classes.find(cl=>cl.id===id)]);c.base[first]=a;c.base[second]=b;assert.equal(xpModifier(c,id),expected(a,b),`${id}: ${first} ${a}, ${second} ${b}`);}});
test('two classes with +5% each retain exact fortieths for odd XP awards',async()=>{const {formatXP}=await import('../src/engine.ts');const c=context(professions.filter(cl=>['fighter','thief'].includes(cl.id)));c.base.STR=13;c.base.DEX=13;awardXP(c,1);assert.deepEqual(c.classes.map(cs=>cs.xp),[.525,.525]);assert.equal(formatXP(c.classes[0].xp),'21/40');awardXP(c,1);assert.deepEqual(c.classes.map(cs=>cs.xp),[1.05,1.05]);});
test('all class advancement boundaries enforce their XP threshold, session cap, HP step and final level',async()=>{const {advance,xpBreakdown}=await import('../src/engine.ts');let checks=0;for(const cl of rules.classes)for(let count=1;count<=3;count++)for(let con=3;con<=18;con++){const c=context([cl,...professions.filter(p=>p.id!==cl.id).slice(0,count-1)]);c.base.CON=con;for(let level=1;level<cl.progression.length;level++){c.hp=[];c.currentHP=0;const cs=c.classes[0];cs.level=level;cs.xp=cl.progression[level].xp-1/120;addHP(c,cs);assert.throws(()=>advance(c,cl.id),/Not enough experience/);const atThreshold=cl.progression[level].xp;cs.xp=atThreshold;const before=c.hp.length;if(cl.id==='druid'&&level>=11){assert.throws(()=>advance(c,cl.id),/challenge/);continue;}advance(c,cl.id);assert.equal(cs.level,level+1);assert.equal(c.hp.length,before+1);assert.equal(c.hp.at(-1).level,level+1);cs.level=level;cs.xp=cl.progression[level-1].xp;const preview=xpBreakdown(c,1000000000)[0],second=cl.progression[level+1]?.xp;if(second!==undefined)assert.equal(preview.after,second-1);checks++;}c.classes[0].level=cl.progression.length;c.classes[0].xp=1000000000;assert.equal(xpToNext(c,c.classes[0]),null);assert.throws(()=>advance(c,cl.id),/Level limit/);}console.log('Class advancement boundaries checked:',checks);});
