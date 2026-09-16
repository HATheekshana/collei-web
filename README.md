# Collei shared library

This website and the supplied Collei bot patch share MongoDB content directly. Existing bot commands use shared loaders; this does not rely only on /library calling a website API.

Read [SHARED-DATABASE-SETUP.md](SHARED-DATABASE-SETUP.md) for installation, environment settings, data coverage and verification.

## Website

Node 24, Vercel Framework Preset Other, build `npm run build`, output `public`.

Install with `npm ci`, test with `npm test`, preview with `npm run dev`.

Set MONGODB_URI and MONGODB_DATABASE to the same values as the bot. Set ADMIN_PASSWORD, SESSION_SECRET and SITE_ORIGIN for the admin editor. Never expose credentials to browser code. Without MongoDB configuration the site displays the bundled public snapshot; it is not then connected to the bot.

The public library includes characters, guides/cards, weapons, artifacts, banners and endgame sections. Imported images and game data are snapshots unless updated by the bot or administrator. Admin publishing updates the shared content collection. Drafts are hidden from public website and bot lookups.

Private bot records are not returned by the public API. Complaints, broadcast data and cookie records are outside this content migration.

No live database migration, GitHub push or Vercel deployment was performed as part of preparing this patch. Deploy the updated files and configure both services before claiming a live connection.
