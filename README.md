# Collei website preview

This is a standalone, locally tested implementation prepared from the supplied Collei bot files. It has NOT been deployed over collei-web.vercel.app. That existing site already has cards, guides, bosses, banners and an admin login. Obtain its source and port these additions into that project before deploying; do not replace its database or authentication blindly.

## Included

- Public searchable character, weapon, artifact, banner and endgame categories.
- 150 imported character records (including variants), 246 weapons and six endgame image collections.
- Character cards/guides, skill/passive descriptions and collapsed constellation sections.
- Admin content editor with titles, descriptions, images, sections, drafts and publishing.
- MongoDB-backed content overrides, pooled connections, signed HttpOnly session cookie, origin validation and database-backed login throttling.
- Optional Telegram /site and /library search integration using the same published content API.

## Not yet connected

- No Vercel deployment or live MongoDB connection has been made. The source of the existing site is required for integration.
- Artifact and banner details were not present in the supplied bot ZIP. Their categories are ready to populate through the editor. No live banner or rotation feed is connected.
- Imported endgame cards are snapshots, not a claim about the current cycle.
- Weapon image files were not supplied; entries without a public URL show a reference tile.
- The supplied character data is preserved, including any source errors. Repeated character names are distinguished using their skill or record identifier.
- Complaint/user settings migration and dashboard support replies are not included in this preview. No private bot data was imported.
- Existing bot commands still use their existing data. The optional /library command reads website updates; this is not a replacement for every original handler.

## Local preview

Use Node 24. Run `npm ci`, `npm test`, `npm run build`, then `npm run dev`.
Open http://127.0.0.1:4173. Without database configuration the public API serves the bundled snapshot and admin access is disabled.

To test a configured environment, create .env from .env.example and run `node --env-file=.env scripts/dev.mjs`. Use SITE_ORIGIN=http://127.0.0.1:4173 locally. Never commit .env.

## Vercel configuration (after merging with the existing source)

This standalone version uses Framework Preset Other, build `npm run build`, output `public`, Node 24. The api/index.js function handles /api routes via vercel.json.

Set these environment variables in Vercel, not in browser JavaScript:

- MONGODB_URI: a database connection string with access only to the intended database.
- MONGODB_DATABASE: collei_site (separate from existing bot records by default).
- ADMIN_PASSWORD: a unique random password of at least 20 characters.
- SESSION_SECRET: a separate random secret of at least 32 characters.
- SITE_ORIGIN: https://collei-web.vercel.app, or the exact origin of the deployment being tested. A preview URL needs its own matching origin.

Generate each secret separately with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

MongoDB network access must allow the deployment to connect. Set the function region near your database. Sign in at /admin.html. New entries default to draft; publishing makes them publicly readable. Session secrets and passwords must never be supplied to public API consumers.

## Optional bot integration

Do not install this before the matching API is deployed.

1. Copy bot-integration/site_library.py to handlers/site_library.py in the bot.
2. Register its router before main_router in main():
   ```python
   from handlers.site_library import router as site_router
   dp.include_router(site_router)
   ```
   bot-integration/main.py contains that change against the supplied Collei version. If your bot has newer edits, merge those two lines instead of overwriting main.py.
3. Add COLLEI_SITE_URL=https://collei-web.vercel.app to the bot environment and restart.
4. Use /library Nahida or /site. Shared data is cached for 60 seconds. Telegram must support the rich-message API already used by this Collei version.

No Telegram token, MongoDB password, cookies, user data or complaint records are bundled.

## Validation

Offline tests check the public/draft boundary, input validation, session tampering, request origins and imported records. Local browser checks cover search and character cards/constellation tabs. Live MongoDB writes, deployment, and Telegram delivery still require integration testing with the intended services.
