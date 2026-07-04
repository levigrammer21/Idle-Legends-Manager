# ILM Architecture

Client reads Firestore state and sends intent to Cloud Functions.

Client action example:

1. Player taps Start Activity.
2. Client calls `startActivity`.
3. Cloud Function validates owner, character state, location, level, tools, inputs.
4. Function writes activity timer to expedition document.
5. Client displays realtime state.
6. Player taps Resolve Ready Action.
7. Cloud Function validates timer and awards output/XP.

This keeps gameplay server-authoritative.
