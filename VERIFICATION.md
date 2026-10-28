# Verification record

Verified locally on October 27, 2026 with Node.js 24.11.0, TypeScript 6.0.3, Vite 8.1.0 and Playwright 1.62.1 / Chromium.

- Production build: successful; TypeScript strict checking passes.
- 25 engine and distribution tests: pass.
- 4 browser scenarios: pass.
- Advanced creation: manual scores, racial adjustment, eligibility, HP and gold generation, purchasing restrictions, standard spell-book capacity, memorization, casting, persistence, JSON export, advancement, desktop/mobile layout and printing.
- Classic creation: seven choices, race-as-class, campaign profile save/load, rejection of invalid imports.
- Custom creation: explicit house rules, fighter/thief multiclass, maximum starting HP, customized gold and retained configuration.
- Offline: production service worker installs, precaches all assets, and reloads in a browser context with networking disabled while retaining the character library.
- Standalone launcher: serves production assets with Node’s standard library, without Vite dependencies; refuses source-file paths.
- Printed sheet and mobile screenshot visually inspected. Browser runtime errors: none in the full Advanced workflow.

Tests intentionally use isolated browser contexts and do not modify the user’s live character library. QA output stays under ignored work/qa. No deployment, source PDFs, rulebook extracts or public publication is part of this delivery.

See RULES_AUDIT.md for referee decisions and intentionally disabled optional rules. Passing tests are evidence for the checked behaviors, not a claim that every possible ruling or future source edition has been independently audited.

Multiclass correction verified: 31 engine/distribution tests and 5 isolated browser scenarios pass, including the 4/8/1 triple-class HP case, repeated 1-XP awards, independent prime bonuses, legacy-save normalization without rerolls, and the class-threshold / unsplit-award display. The open character was refreshed and visibly verified at 4 HP plus a retained 1/3, with XP totals unchanged.

Complete multiclass audit follow-up: all 268 source XP/HD rows agree with the supplied Tome. The test matrix checks 77,568 HP contributions, 81,536 cumulative HP states, 97,344 XP states, and all two-prime score pairs. A two-class +5% precision defect was found and corrected using 1/120 XP units. Final unit/matrix suite: 36 tests pass. Browser suite includes an additional two-class odd-XP regression.

Final follow-up suite: 37 unit/matrix tests and 6 browser scenarios pass. Advancement verification additionally covers 11,664 boundaries and checks source XP thresholds, session caps, HP increments, maximum levels and the druid challenge block. The app was rebuilt with the corrected XP denominator; existing character totals were preserved.

Sheet/control redesign: strict TypeScript production build passes; all 37 unit/matrix tests and 7 isolated browser scenarios pass. Added regression coverage for quantity purchases, armour/shield/primary-weapon swaps, two-handed shield exclusion, duplicate spell memorization, independent casting, rest preserving the book, quick HP controls, collapsed screen references, expanded print references and mobile overflow. The rules engine, rules pack, character schema and persistent storage format were not changed by the layout work. Existing saves remain compatible.


OSE presentation and PDF integration (October 28, 2026): strict production build and all 40 unit/matrix/PDF tests pass; all 8 isolated browser scenarios pass. Added coverage for direct sheet equipment selection, two-handed/shield swaps, original-template download, persisted optional template and downloads with networking disabled using both default and stored templates. PDF tests retain all 154 unique form widgets, match canonical and resolved widget values, verify nonempty appearances, and preserve long notes on continuation pages. The three-page sample and five-page long-note case were rendered; original pages and continuation layouts were visually inspected. Checkbox appearances were regenerated to preserve visible checkmarks and borders. Desktop and 390-pixel phone layouts were inspected after removing duplicate sheet headers and the duplicate summary. The live app was refreshed without changing the user’s active character. Private prepared template is ignored by Git and precached only for this local app. Offline versions include template contents so replacement templates invalidate the cache.


Random generation: strict production build and all 42 unit/matrix/PDF/generator tests pass. The seeded generator regression checks 3,000 Advanced/Classic characters and exercises all 13 Advanced classes and 10 races: eligibility, six original ability rolls, HP, starting XP, purse conservation, permitted equipped weapons/armour, two-handed/shield exclusion, prepared spell capacity and import validation. Lowest rolls/wealth and explicit Custom-to-standard behavior are covered. Browser coverage checks the button, saved-sheet result, preservation of the previous character, separate IDs on repeated generation, offline creation and mobile overflow.


Custom random generation follow-up: production build and 45 unit/matrix/PDF/generator tests pass. Added 300 seeded custom campaigns covering all one/two/three-class counts, level-five maximum HP, fixed starting purse, four-die ability rolls, proficiencies, secondary skills and exact configuration retention. Added manual-score retention, custom-sided dice, invalid-roll rejection, zero wealth, racial level caps and level-one HP rerolls. The UI now passes the complete selected campaign instead of reducing it to a standard-mode name. Existing records remain preserved.


Magic items and equipment audit (October 28): production build, all 48 unit/matrix/PDF/generator/magic tests, and all 11 isolated browser scenarios pass. Verified enhanced weapon attack/damage, base proficiencies and class/sizing restrictions; enchanted armour/shield AC in both notations; half-weight armour; two-handed shield exclusion; optional-record backwards compatibility; validation of charge/weight/count fields; charge tracking; persistence; unchanged gold for treasure awards; PDF form values and continuation records; and mobile overflow. The 52 mundane entries cover Player’s Tome core equipment tables, including the additional wooden-shield variant; transport remains outside the outfitter. Magic special powers/curses/conditional effects are explicitly manual.


Save-protection/dependency follow-up (October 28, 2026): strict build passes with Vite 8.3.5; 49 unit/matrix/PDF/generator/magic/backup-validation tests pass. Revision checks, tombstones, serial local writes and cross-tab notifications protect saves. New browser fault tests exercise simultaneous edits, conflict copies, a forced failed write followed by tab closure and draft recovery, inclusion of unsaved drafts in a full backup, malformed-backup rejection, whole-restore rollback across stores, non-destructive backup merge, trash recovery, failed Load latest after deletion without resurrection, and migration of legacy character/profile stores. The private live character library is not used by these tests.

Final save-protection verification: all 16 browser scenarios pass on the final build, including legacy migration, stale-tab deletion protection, simultaneous writes, failed-write draft backup/recovery and atomic restore rollback. Full npm audit reports 0 known vulnerabilities (production and development dependencies). Resolved versions include Vite 8.3.5, PostCSS 8.5.32, nanoid 3.3.20 and source-map-js 1.2.2. The loopback server was checked and is serving the final build.

Random-control visibility follow-up: strict production build, all 50 unit tests and all 17 browser scenarios pass. Shared random-name generation is available independently beside Character name. The regression verifies that renaming preserves the character ID, abilities, class levels, HP history/current HP, equipment, wealth, spells and campaign settings. Full random generation is visible in setup and navigation, preserves the prior saved record, and works at phone width without horizontal overflow.
