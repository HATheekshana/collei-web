# Connect Collei and collei-web to one database

Install both changed-file ZIPs: the bot ZIP in your Collei bot folder and the website ZIP in the root of HATheekshana/collei-web. Back up your current files first. These files target the Collei main.py version supplied in this conversation.

## 1. Use the same settings on both services

Add these to the bot's existing environment file (env or .env, whichever your deployment loads) and Vercel → project Settings → Environment Variables:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=collei_site
```

Use the exact same database name and cluster on both. These variables are server-only; do not put the URI in frontend code or a NEXT_PUBLIC variable. Existing MONGO_URL variables for other bots are not used automatically. No credentials are included in these archives.

Keep Vercel's existing ADMIN_PASSWORD, SESSION_SECRET and SITE_ORIGIN settings. SITE_ORIGIN should be https://collei-web.vercel.app for production. MongoDB must permit connections from your bot host and Vercel. Give the database user read/write permission to collei_site, not unrelated databases.

## 2. Install and start

In the bot's environment:

```powershell
python -m pip install -r requirements.txt
python shared_db_check.py
python main.py
```

The first shared-mode startup creates content indexes and imports missing seed records and the bot's content JSON snapshots. Existing MongoDB documents are never replaced by startup seeding. Startup fails if the configured database is unavailable, rather than quietly running from stale files.

Redeploy the updated website through your existing Vercel GitHub integration. No GitHub push or production deployment was performed by this patch.

## 3. How data is shared

- `content`: character cards/guides, skills/constellations, weapons, artifacts, banners and endgame content used by the website and bot.
- `bot_files`: native bot content records, including Telegram image file IDs and banner scheduling metadata. This collection is not returned by the public website API.
- Existing website `login_limits` remains private to its admin authentication.

The bot's existing loaders now read projected shared content. `/addcard`, `/addguide`, delete-card/guide operations, `/addarti`, banner updates and endgame media saves write back to the shared database. A media save updates media fields rather than replacing unrelated descriptions.

Website edits become visible in the bot on the first update arriving at least 10 seconds after its last refresh. Normal reads use an in-memory snapshot; refresh uses a background thread. Existing synchronous admin save functions wait for MongoDB to acknowledge writes and may pause briefly during database latency. After a failed refresh, the bot reports storage unavailable instead of displaying stale content.

Character cards and guides have separate image fields in the dashboard. Keep constellation headings as `C1 · Name` through `C6 · Name`, skills as `Elemental Skill · Name` / `Elemental Burst · Name`, and weapon refinements as `R1 · Name` through `R5 · Name`. These headings map into the existing bot models. Weapon base stats use `Level 90 stats` with lines like `Base ATK: 542` and `CRIT DMG%: 88.2`.

Shared banner entries are created from your bot's banner data on first startup or the next `/bsync`. `Featured characters` is a comma-separated list. `Asia`, `EU`, and `NA` section bodies hold ISO dates (current banner end / next banner start), or remain blank when unknown. Banner images are the character icon URLs. Existing bot endgame scheduling metadata remains in bot_files; shared endgame image entries update the existing current/next buttons. Site changes to arbitrary endgame descriptions are website content; the bot's separate computed countdown wording is not replaced.

Private complaints, broadcast targets, bans and cookie/login records are NOT migrated by this content patch. They remain in their existing storage. No user records are exposed to the website.

## 4. Verify the connection

1. Run shared_db_check.py after startup. It should show content and bot storage counts.
2. Edit a character's C1 description on the website and publish.
3. After 10 seconds, request that character in the bot and open More info → Cons.
4. Add a guide through the bot and refresh that character in the website. Public website images require HTTPS image links; Telegram-only file IDs remain bot-only until the bot's existing image-host upload supplies a URL.

Changing an existing website entry to Draft hides its shared content from the bot as well. Updates affect future requests; already-sent Telegram messages are not proactively rewritten.

## Validation and limits

Offline adapter and simulated database-flow tests cover both directions, draft hiding, stats conversion, image separation and preservation of unrelated concurrent updates. Website validation/session tests also pass. Live MongoDB, Vercel and Telegram behavior still needs the configuration and verification above. The code has not been connected to your real credentials in this session.

The bundled seed reflects the supplied website snapshot. It is not an automatic game-data feed. Artifact/banner records absent from the supplied source become available after their normal bot import/update or dashboard publication. Existing MongoDB content wins on startup; later edits to old local JSON files do not override shared content.
