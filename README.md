# Idle Legends Manager — Sprint 2 Complete Root Build

Upload all files to GitHub repo root.

## Sprint 2 adds

- Equipment screen
- Equipment slots: weapon, body, active tool
- Equip/unequip through Cloud Functions
- Crafting screen
- Location-based recipes
- Server-authoritative crafting
- Crafting consumes inputs from inventory/bank
- Crafting grants skill XP
- Tool upgrade chain
- Low-tier item sink examples:
  - Copper Axe requires Copper Bars + Oak Log + Crude Axe
  - Copper Pickaxe requires Copper Bars + Oak Log + Cracked Pickaxe
- Fletching recipe
- Tailoring recipe
- Cooking recipe
- Copper resource loop
- Better city services and local recipes
- Sprint 1 systems preserved

## Deploy after upload

```bash
npm install
firebase deploy --only firestore:rules
firebase deploy --only functions
```

If using Firebase Hosting:

```bash
firebase deploy --only hosting
```
