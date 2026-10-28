# OSE Advanced Fantasy Character Builder

Private, local-first Old-School Essentials Advanced Fantasy character generator. Built from the supplied Player’s Tome v1.1, second printing September 2021. This application is independent of the Gamma Solo application in the parent directory.

## Start the finished application

Requires Node.js 22.18+ (Node 24 recommended). The generated `dist` folder needs no npm dependencies or internet connection.

- Double-click `Launch-Ledger.cmd`, or run `node serve.mjs` in this directory.
- Open http://127.0.0.1:4174 in your browser. Keep that address and browser profile to retain the same IndexedDB library.
- After the first production visit, the service worker caches all application assets. The app can reload without network access. Browser data must be retained. The development server does not install the offline worker.
- Do not open `dist/index.html` via a file URL; use the included loopback-only server.

## Use

1. Enter a name, alignment and creation tradition. Advanced separates race and class; Classic offers the seven traditional classes. Custom records house rules explicitly.
2. Roll abilities or explicitly select manual input. Assigned rolls can be moved using adjacent swap controls. Original, racial and traded scores are displayed separately. All dice are logged; nothing silently re-rolls on load.
3. Select an eligible race and class (up to three with the optional multiclass rule). Roll starting HP after deciding the build. This locks the build so historical HP cannot change when scores change. Start a new adventurer to rebuild.
4. Roll wealth and purchase gear. Equip one armour, shield and primary weapon. A two-handed weapon prevents shield use. Currency and inventory remain editable. Half-price resale is explicitly a convenience house rule.
5. Record arcane spells with referee approval, memorize available spells and mark each casting. Prepared duplicates consume separate capacity. After sleep and an hour of study/prayer, clear memorization and select again. There are no full spell descriptions; consult your Tome.
6. Use the sheet for play. Enter session XP; advance eligible classes individually. The app preserves fractional multiclass HP and old rolls, applies class-specific XP modifiers, and caps each award at one level per session.
7. Export JSON backups and import from Saved characters. Choose Print character sheet → Download character PDF to fill the supplied character-record form, then open the download and print it. Browser print remains available as an alternative.

Auto-save uses IndexedDB with atomic revision checks and local recovery drafts. JSON imports validate schema and ruleset version, ability ranges, IDs, inventory, nested records, spell lists and capacities. Illegal combinations remain visible as eligibility warnings; only Custom enables a referee override. Uploaded names and notes are rendered as text.

Campaign profiles are reusable on this browser. Full campaign configuration is embedded in each exported character. Chronicle entries preserve a pre-action snapshot. Restoring one returns to that state; it does not merge later events.

## Source and scope

Read [RULES_AUDIT.md](RULES_AUDIT.md) for source versions and decisions. Rules are separated into `src/rules.json` (versioned data), `src/engine.ts` (deterministic calculations and actions), `src/storage.ts` (IndexedDB) and UI files. Dice accept an injected random generator for deterministic tests. `Math.random` is used for tabletop dice, not security.

The pack contains all thirteen separate classes, ten races, 22 underlying class progressions, seven Classic choices, 212 spell list entries and 52 equipment entries. It covers the supplied Tome through its class level caps. It is not an audit of a separately supplied Classic book or the 2026 update.

Referee adjudication remains necessary for demihuman clergy, sizing beyond explicit weapon bans, languages, class duties, situational bonuses, advanced druid challenges and optional human compensation when restrictions are lifted. Basic and detailed encumbrance are supported. Detailed gear uses one shared 80-coin allowance; missile weapon weight includes ammunition. Fractional gp balances are counted as gp/sp/cp coin denominations.

Advanced spell-book copying and weapon specialisation are deliberately disabled, as recorded in the audit. Proficiencies and secondary skills are supported. Human compensation for lifting limits is not automated; record any additional ruling in campaign notes. High-level advancement needing a druid challenge is blocked pending adjudication.

Rulebook PDFs and full extracted text remain local and are excluded from application assets. The privately supplied character-record template is the exception: its prepared copy is served only by the loopback app and cached for offline printing. Both private/ and output/ are ignored by Git. Do not publish the private rules pack. The app makes no claim of affiliation with Necrotic Gnome.

## Development

Run `npm ci` for the local React/Vite and PDF export dependencies (internet or a populated npm cache required).

```
npm run dev
npm run build
npm run test:unit
npm run test:browser
```

`npm run build` checks TypeScript, builds static assets and generates a content-versioned precache worker. `node serve.mjs` serves only `dist`, including the private sheet template; rulebooks and working extracts are never served. No remote fonts, analytics or CDN scripts are used.

Browser tests require Playwright and a matching Chromium install. Install Playwright 1.62.1 with `npm install --no-save playwright@1.62.1` and `npx playwright install chromium`, or set `PLAYWRIGHT_MODULE` and `PLAYWRIGHT_BROWSERS_PATH` to an existing installation. Tests use a fresh browser context and temporary loopback server, not your live character library. QA screenshots and the print sample are ignored under `work/qa`.

## Multiclass HP and XP display

Usable HP are displayed as whole points with retained fractions separately. Old HP rolls are never rerolled during this correction. XP shares and prime bonuses retain fractions rather than losing small awards to rounding. The session preview shows class shares, credited XP and explicit cap losses. “Character award needed” means the unsplit award for this character, before prime bonuses, not the XP threshold for each class or the award for the entire party.

## Sheet and play-control improvements

The sheet now starts with current/maximum HP, the selected AC system, attacks, movement, saves, equipped gear and spells ready today. Quick damage/healing controls sit directly below HP. Original-score calculations, full inventory, class references and the chronicle are collapsible on screen; print includes the reference sections automatically.

Outfitting opens with equipped armour, shield and primary weapon, followed by the carried pack. Equip/Put away replaces items in the same slot, and two-handed weapons automatically put away shields. Category filters, name search, purchase quantity and an optional restricted-item filter simplify shopping. Drop/consume and half-price selling live in each item’s action menu. Treasure balances remain editable in the ledger.

Spellbook pages have per-caster tabs, per-level free capacity, a separate ready/cast list, spell name/level filters, and disabled controls explaining book or memorization limits. Rest clears memorization without erasing recorded spells. Duplicate copies cast independently. Links on the sheet open the relevant equipment or spell controls.

## OSE presentation and original-sheet printing

The interface uses black, white and pale green from the supplied sheet. Navigation uses plain action names. Completed saved records open directly on the play sheet. Armour, shield and primary weapon selectors equip owned, permitted items immediately; Equipment opens purchases and inventory. Spells opens memorization and casting. The play sheet omits the duplicate right-hand summary, and phone navigation shows every section without horizontal scrolling.

Print character sheet downloads an editable PDF using the original two-page form, with continuation pages for spells, complete inventory, long notes and multiclass details. It preserves 154 form widgets. Unsupported assignments (secondary weapon, container contents, portrait, title, running/overland movement) remain blank for manual completion. Only the verified attack-matrix source range, DAC 9 through -3, is filled. The sheet uses the selected ascending/descending AC notation. Fractional HP is stated separately; XP remains per class.

The original supplied PDF opens with an empty user password but uses encryption unsupported by pdf-lib. Its local working copy is prepared with pypdf, preserving pages, fields and artwork; the original file is unchanged. To prepare it again, install pypdf for your Python interpreter, run `python prepare-print-template.py "path/to/ADVANCED FANTASY CHARACTER RECORD SHEET.pdf"` (add `--replace` only to replace an existing prepared copy), then `npm run build`. Keep the private template when backing up this local app. Do not publish it or the private rules pack.

Print options also accept an unprotected fillable copy of the same form. That choice is stored separately in this browser’s IndexedDB. After one production visit, the prepared template and exporter are available offline. Names outside the PDF font’s supported character set should use Browser print.

## Full random character

Use Random character in the navigation panel. The generator saves the current character first, then creates a separate record using the selected campaign configuration, including its name and notes. It works offline.

Custom campaigns retain the selected ability method, HP method, starting gold and level, AC, encumbrance, multiclassing, racial-limit option, weapon proficiencies and secondary skills. Manual ability scores are copied from the current character; other methods roll new scores without hidden rerolls. Invalid dice stop generation without replacing the current character. Racial level caps still apply unless lifted. Multiclassing enabled allows a random one, two or three eligible classes, each with its own level, XP threshold, HP history and spells. Equipment respects the available funds, including an explicitly empty purse. Low funds may leave supply or equipment slots empty.

Proficiencies include the generated weapon; secondary skills are rolled when enabled. Race/class choices prefer eligible combinations; a recorded referee override does not require generating an illegal build. Referee review remains necessary for starting spells, languages, class duties, deity, high-level druid rank challenges and any demihuman clergy choices. Free-text campaign notes are preserved for the referee; they are not interpreted as executable rules.

## Equipment and magic items

The core Player’s Tome equipment tables (pp. 94–97) are present: 19 weapons, 3 armour types, 2 shield options (including the wooden-shield variant), 24 adventuring supplies and 4 ammunition entries. Mounts, vehicles and boats are outside this outfitter’s present scope.

Equipment → Manage magic items opens the magic-item section. Add +1 to +3 enchanted weapons, armour or shields as referee-awarded treasure, then equip them from Your pack or the sheet. These awards do not spend gold and have no automatic resale price. Bonuses affect weapon attack/damage or AC only when equipped. Normal class, sizing and two-handed/shield rules apply. Weapon training follows the base weapon. Enchanted armour has half its normal coin weight (Referee’s Tome pp. 152–153); shield weight is unchanged because the source specifies armour. The normal attack summary remains before weapon-specific modifiers; the equipped weapon reference shows the applied magic bonus.

Named potions, rings, wands, scrolls and miscellaneous magic items are recorded separately with referee-assigned weight, powers/restrictions, known charges and carried/worn status. Blank charges mean unknown; Spend 1 charge only updates the ledger. Special powers, conditional bonuses, curses and effects are resolved with the referee. This is item tracking plus generic equipment enchantments, not a complete magic-treasure catalogue or treasure-table roller. Random character creation does not grant free magic items.

Magic records appear on the sheet and PDF continuation pages and survive JSON backup/import. Old records without magicItems remain compatible. Older app versions cannot load enchanted-equipment IDs, so use the updated app when importing these backups.

## Save protection, backups and recovery

Refresh all app tabs after installing this update. Storage upgrades from version 1 to 2 without changing character rolls, XP, equipment or profiles. An older tab may need to close before a pending upgrade can finish; the loading screen explains this.

Character saves compare the revision originally read by the tab against the current stored revision in one transaction. A stale editor cannot overwrite a newer save or resurrect a deleted character. A conflict keeps the saved record and stores the unsaved edits for recovery. Use Load latest saved version, Save my edits as a new character, or Export my edits in the warning. Other open tabs receive a change notice; their active editors are not silently replaced.

Edits stage a synchronous local draft and begin saving immediately. Switching characters, importing, creating a character and downloading a backup flush the active save. Pending edits are staged again when the page is hidden; closing with an unconfirmed save triggers the browser’s leave-page warning where supported. Recovery drafts protect interrupted writes when local storage is available. Browser storage can still be cleared or unavailable; keep downloaded backups outside the browser.

Saved characters → Backups & recovery provides Download library backup, Restore library backup, Unsaved drafts and Trash. A backup contains saved characters, campaign profiles, trash and recoverable drafts (including the current draft if its save failed). It does not include the private PDF template, which should be backed up separately. Restore validates every entry first and writes all restored records in one transaction; failures roll back the operation. Restored characters and drafts get new IDs, and conflicting profile names are renamed. Nothing already saved is replaced. Imported single-character JSON also creates a copy. Files are limited to 50 MB for a library and 5 MB for a character.

Move to trash replaces immediate deletion. Restore from trash creates a new record; there is no permanent-purge control. Unsaved drafts can also be recovered as separate characters. Drafts may include another open tab; restoring one does not overwrite its saved character.

Dependency maintenance updated Vite to 8.3.5 and compatible PostCSS/nanoid/source-map-js versions. The final full npm audit reports zero known vulnerabilities as of this verification; this is a point-in-time audit, not a guarantee against future findings.


Random controls: Character setup now has Random name beside the name field; it changes only the current name. Generate a complete character is directly below the name/alignment fields and uses the selected campaign configuration while preserving the current record. Random character also appears directly below section navigation, above the save/backup note, on desktop and mobile.
