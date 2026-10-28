# Rules audit

Selected ruleset: OSE Advanced Fantasy, Player’s Tome v1.1, second printing September 2021. No 2026 update is supplied or inferred. Printed page numbers below are two less than PDF page numbers.

## Source inventory
- Player’s Tome v1.1: 257 PDF pages, 2021 metadata; primary character rules (printed pp. 14–25, 28–87, 88, 90, 94–97, 122–131, 214–215).
- Referee’s Tome v1.1: 257 PDF pages, 2021 metadata; supporting reference, not a replacement character ruleset.
- Advanced Fantasy Reference Booklet v1.2: 36 PDF pages, 2023 metadata; secondary quick reference. Version difference is recorded; primary Tome tables govern this pack.
- Advanced Fantasy Character Record Sheet: 2 PDF pages, December 2024 metadata. Layout reference, not an independent rules authority.

## Verified decisions
- Advanced race and class selection, requirements before racial changes, racial changes clamped to 3–18: pp. 18–19.
- Basic creation uses race-as-class; no racial score adjustments are added separately: pp. 16–17.
- Ten separate races and individual class limits: pp. 78–87. Short races cannot use long bows or two-handed swords. Other size suitability is a referee decision.
- Multiclassing is optional, up to three classes, including humans; the book does NOT prescribe AD&D racial combination lists. Per-class requirements and racial availability still apply. XP split equally then prime adjustment; fractional HP retained; best saves and THAC0; best armour/weapons; stealth remains restricted: p. 15.
- Base AC 9 [10], shield improves by 1, DEX bonus improves AC. Ascending attack bonus is the explicit table value, not 20 minus THAC0: pp. 13, 16–21, 96.
- CON HP minimum 1 per die; no CON bonus on fixed post-name-level HP: p. 20 and class tables.
- 3d6 in order, 3d6 × 10 gp: pp. 18–19, 90. Assigned, 4d6, manual generation and custom dice are labeled campaign methods.
- Ability modifiers have different CHA and initiative progressions: p. 21.
- Arcane spell books use standard capacity by spell level; divine casters select from their list; clerics have no spells at first level. Preparation permits duplicates, casting erases one memorization: pp. 36–37, 122, 124, 128–131.
- Detailed encumbrance counts weapons, armour, currency and a single 80-coin miscellaneous gear allowance: p. 215. >1600 coins prevents movement.
- One level per session; excess XP capped one below a second level: p. 88.

## Ambiguities and deliberately bounded options
- Referee may disallow listed demihuman clergy as PCs; default permits them and the UI flags that decision.
- Weapon size beyond explicit prohibitions, religious obligations, knight’s liege, druid challenges at level 12+, and situational save/AC bonuses require referee adjudication.
- Standard spell books selected with referee approval. Full spell descriptions are not copied; use book/page references.
- Optional advanced spell-book learning and weapon specialisation are not enabled in this version. No 2026 pack is offered.
- Basic/Classic mode provides the seven Classic classes using their tables in the supplied Advanced Tome; it is not a separate Classic printing audit.

## Data provenance and privacy
Each class progression row and spell list carries printed source pages in the local JSON pack. The mechanical data is extracted for this owner’s private local use. Full text extraction is ignored under work/. Rulebook PDFs are never copied to application assets. A prepared copy of the owner’s character-record sheet is kept in ignored private/ and served only by the local app for PDF printing. This is not a licensing determination for redistribution; do not publish this private pack.
## Implementation verification

- Compared the reference booklet p. 18 racial requirements, modifiers and resilience categories with Tome pp. 79–87. Starred clergy entries are included, with the NPC-only referee option called out.
- Cross-checked the booklet p. 19 Elf save row against Tome p. 49: level-one spells save is 15. The initial test expectation of 12 was corrected; source data did not change.
- Source tables were extracted into mechanical JSON, then checked for contiguous levels, increasing XP, five save categories and page tags.
- Half-price resale is an explicit convenience house rule, not an attributed OSE mechanic.
- Standard spell books are enabled. Advanced copying and specialisation remain disabled. Human compensation when lifting limits is a recorded referee decision rather than an implicit bonus.
## Multiclass correction

Rechecked Player’s Tome pp. 15, 20 and 88 after a triple-class report.

- HP contributions are retained exactly as halves or thirds. Usable maximum/current HP are whole points; the remainder is displayed separately and becomes usable when it completes a whole point. Minimum starting HP remains 1.
- Existing raw HP rolls and recorded class contributions are preserved. Legacy fractional current HP is separated from the retained remainder on load, with a pre-migration snapshot in the chronicle.
- The text prescribes equal XP division and separate prime adjustments but supplies no rounding instruction. The previous unconditional floor discarded small awards. The implementation now preserves fractional class XP, using 1/120 XP units internally for the supported class counts and percentage steps.
- XP previews distinguish a class’s own threshold from the larger character award required before splitting. They show credited XP and any loss from the one-level-per-session cap.
- For Cleric/Knight/Magic-User with rolls 4, 8, 1 and CON modifier 0: recorded HP is 13/3, usable HP is 4, retained remainder is 1/3. With WIS 10, STR 15 and INT 15, a 4,500 XP award gives 1,500 / 1,575 / 1,575 class XP.


## Complete multiclass matrix follow-up

- Independently re-read all 268 XP/HD progression rows for all 22 classes from the private extracted Tome pages: no data mismatches.
- Tested 77,568 class HP contribution cases: all 16 CON scores, all die outcomes, every class level, division by one/two/three classes.
- Tested 81,536 cumulative HP states across every pair/triple of the thirteen professions, all CON scores and levels 1–14.
- Tested 97,344 XP states across the same 364 sets, all ability-score bands, repeated awards, independent bonus calculation and next-level requirements. These are arithmetic stress cases; they do not imply that every combination is legal for every race/alignment.
- Tested all 256 score pairs for each of eight two-prime classes.
- This found a further precision defect in the previous correction: 1 XP / 2 classes with +5% is 21/40 XP each. Sixtieths cannot represent fortieths. XP arithmetic and display now use 1/120 units, representing all supported divisors and prime bonuses exactly. Class XP totals already stored are preserved; unrecorded losses from old awards are not guessed or replayed automatically.
- Advancement follow-up: 11,664 class boundaries checked across all CON scores and one/two/three class divisors, including XP eligibility, session caps, fixed HP transitions, final levels and mandatory druid challenges. Final unit/matrix count is 37 passing tests; browser count is 6.


Original-sheet PDF export preserves the supplied form as a layout template, not a new rules authority. Long details and spells use continuation pages. Unrecorded assignments remain blank. Source attack-table values are filled only for DAC 9 through -3 (Player’s Tome p. 241); no additional matrix range is inferred.


Magic-item support: Referee’s Tome pp. 152–153 govern generic armour/shield +1 to +3 AC and armour-only weight reduction. Pages 222 and 228 govern enchanted sword/weapon attack and damage modifiers. The application supports referee-awarded generic enchantments; it does not assert that every base weapon/bonus combination is an entry on the printed random treasure tables. Magical shields retain their base weight pending a more explicit source/ruling. Normal restrictions and base-weapon training apply. Other magic items are notes/charge/weight records with no inferred stacking, curse handling or automated powers. Known charges are manually supplied; unknown counts are never generated or disclosed automatically (p. 206). All core mundane gear/weapon/armour/ammunition entries on Player’s Tome pp. 94–97 remain present; mounts and vehicles are not in the current outfitter.
