# Idle Legends Manager — Alpha 0.3.1 Build Stamp Update

Upload all files to GitHub repo root.

## Sprint 3 adds

- Real combat foundation
- Enemy stat definitions
- HP system
- Max HP calculation
- Weapon/armor combat stats
- Hit chance simulation
- Enemy damage simulation
- Automatic food usage
- Defeat/death stopping rules
- Partial HP recovery after defeat
- Monster Mastery XP from kills
- Boss component drops
- Griffin 1/1000 mount-bond backend hook
- Combat preview in activity panels
- Combat status UI
- Sprint 1 and Sprint 2 systems preserved

## Firestore rules

`firestore.rules` belongs in GitHub as source control, but it must also be deployed/applied in Firebase to actually protect the database.

Manual mobile path:

Firebase Console → Firestore Database → Rules → paste `firestore.rules` → Publish

Automated later:

```bash
firebase deploy --only firestore:rules
```

## Functions deploy

After upload:

```bash
npm install
firebase deploy --only functions
```

If using Firebase Hosting:

```bash
firebase deploy --only hosting
```


## Alpha 0.3.1 update

- Adds permanent visible build stamp to login screen.
- Adds build stamp to expedition creation screen.
- Adds client version to top bar after login.
- Build ID: ILM-A0.3.1-S3-STAMP
