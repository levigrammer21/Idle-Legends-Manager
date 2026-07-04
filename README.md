# Idle Legends Manager — Sprint 1 Complete Root Build

This is the permanent Sprint 1 foundation.

## Sprint 1 includes

- Email/password login
- Google login
- Firebase Auth integration
- Server-owned player save document
- Expedition creation
- First adventurer creation
- Mobile-first shell
- Living world map foundation
- Central city + four major cities
- Quest-locked side locations
- Visible road network
- Your adventurer marker
- Other expedition placeholder markers for world-life feel
- Travel timer and map movement
- Activity engine
- Active action UI
- 8 real hour hard stop
- Manual stop
- Collect/resolve progress
- Tool requirements
- Inventory
- Bank
- Deposit all
- Skill XP and levels
- Quest requirements and unlocks
- Hardened status display
- Royal Charter timer support
- King's Seal activation function
- Server-authoritative gameplay writes
- Locked Firestore rules

## Root-level workflow

All files are at repo root for easier mobile GitHub editing.

## Required Firebase setup

- Firebase Authentication enabled
  - Email/password
  - Google
- Cloud Firestore created in production mode
- Cloud Functions enabled
- Blaze plan enabled

## Deploy

From a PC or GitHub Actions later:

```bash
npm install
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting
```

If using GitHub Pages for client hosting, still deploy:
```bash
firebase deploy --only firestore:rules
firebase deploy --only functions
```

Then add your GitHub Pages URL to:
Firebase Console → Authentication → Settings → Authorized domains

## Important

The client does not write gameplay data to Firestore. Gameplay changes go through Cloud Functions.
