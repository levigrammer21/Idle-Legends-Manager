# Idle Legends Manager

Production-oriented Blaze build foundation.

## Current Build

Version: `0.1.0-dream-foundation`

This is not a static mockup. It is a Firebase-backed project foundation:

- React + Vite mobile-first client
- Firebase Auth email/password + Google
- Firestore read model
- Cloud Functions server-authoritative gameplay actions
- Firestore rules blocking direct gameplay writes
- Expedition creation
- First adventurer
- World map
- Cities and locked areas
- Skills
- Items
- Activities
- Combat starter loop
- Processing loop
- Bank/inventory
- King's Seal / Royal Charter server function
- Hardened market rule documented in UI

## GitHub Hosting First

If hosting with GitHub Pages for now:

1. Upload the whole repo to GitHub.
2. In GitHub repo settings, enable Pages.
3. Firebase Console > Authentication > Settings > Authorized domains.
4. Add your GitHub Pages domain.

For GitHub Pages, Vite may need a `base` path if your project is hosted at `username.github.io/repo-name` instead of a custom domain. If the page loads blank after deployment, tell me your GitHub Pages URL and I will set the exact `base` value.

## Firebase Deploy Later

When ready to deploy Firebase Hosting and Functions:

```bash
npm install
cd functions && npm install && cd ..
npm run build
firebase deploy
```

## Important

Cloud Functions are the game engine. The client does not directly write XP, drops, inventory, gold, or progression.
