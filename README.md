# Collei — Traveler's Almanac

A companion website for the Collei Telegram bot: character build cards, boss
notes, artifact sets, and live countdowns for wish banners, Spiral Abyss,
Imaginarium Theater, and Stygian Onslaught — all editable from a password
protected admin panel, no coding required after setup.

Built with **Next.js** (App Router) + **MongoDB**. Both have generous free
tiers, so the whole site can run at **$0/month**.

---

## 1. What you're setting up

| Piece | Free service | What it does |
|---|---|---|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free M0 cluster) | Stores characters, guides, bosses, artifacts, banners, endgame countdowns |
| Hosting | [Vercel](https://vercel.com/signup) (free Hobby plan) | Serves the website, runs the admin API |
| Image hosting (optional) | [ImgBB](https://api.imgbb.com/) (free API key) | Lets the admin panel upload images directly instead of pasting URLs |

You don't need a credit card for any of these on the free tiers.

---

## 2. Create your MongoDB Atlas database (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **Project**, then click **Build a Database** → choose **M0 (Free)**.
3. Pick any cloud provider/region close to you and create the cluster (takes ~1-3 min).
4. Under **Security → Database Access**, add a database user with a username/password (save these).
5. Under **Security → Network Access**, click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`). This is required because Vercel's servers use rotating IPs.
6. Go to **Database → Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<username>`/`<password>` with the user you created. This is your `MONGODB_URI`.

---

## 3. (Optional) Get a free ImgBB key

This lets the admin panel's "Upload" button work. If you skip this, admins can
still add images by pasting a URL (e.g. from imgbb.com, Discord, Imgur).

1. Go to https://api.imgbb.com/ and sign up (free).
2. Copy your API key — this is `IMGBB_API_KEY`.

---

## 4. Run it locally first (recommended)

You'll need [Node.js 18+](https://nodejs.org/) installed.

```bash
cd collei-web
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/collei?retryWrites=true&w=majority
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pick-a-strong-password
JWT_SECRET=any-long-random-string-at-least-32-characters
IMGBB_API_KEY=your-imgbb-key-or-leave-blank
```

Import your existing bot data (character cards + build guides that already
have public image URLs, plus a boss list):

```bash
npm run seed
```

Start the dev server:

```bash
npm run dev
```

Visit http://localhost:3000 for the public site, and
http://localhost:3000/admin/login to sign in with the admin credentials you set above.

---

## 5. Deploy for free on Vercel

1. Push this `collei-web` folder to a GitHub repository (Vercel deploys from Git).
2. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**, and import the repo.
3. Before deploying, open **Environment Variables** and add the same values from your `.env.local`:
   - `MONGODB_URI`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `IMGBB_API_KEY` (optional)
4. Click **Deploy**. Vercel's free Hobby plan covers this comfortably.
5. Once deployed, run the seed script once against your production database
   (you can run `npm run seed` locally — it uses whatever `MONGODB_URI` is in
   `.env.local`, so point it at the same Atlas cluster you gave Vercel).
6. Visit `https://your-project.vercel.app/admin/login` to manage content.

That's it — the site is live, backed by a free database, with zero ongoing cost.

---

## 6. Using the admin panel

Go to `/admin/login` and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

- **Characters** — add a character card (name, key, element, weapon, rarity, image).
- **Build guides** — attach one or more guide images to a character.
- **Bosses** — add a boss card image and any number of fight-guide images.
- **Artifacts** — add artifact sets with 2pc/4pc bonus text and an image.
- **Endgame** — set the current/next reset time (per region: Asia/EU/NA) for
  Spiral Abyss, Imaginarium Theater, and Stygian Onslaught, plus optional
  lineup images. The public `/endgame` page shows a live, ticking countdown
  built from these times.
- **Banners** — set current/next wish banner characters, countdown times, and
  icons, plus an optional special event.

All image fields accept either a pasted URL or a direct upload (via ImgBB, if
you configured `IMGBB_API_KEY`).

---

## 7. Keeping the bot and website in sync (optional)

The bot's `cards.json` / `guides.json` already store public `image_url`
values (imgbb links) alongside each Telegram `file_id`. The `npm run seed`
script reads those same files, so anytime you add new cards/guides through
the bot, you can re-run `npm run seed` to pull the new entries into the
website too — it skips anything already imported.

`bosses.json` in the bot only stores Telegram `file_id`s (not public URLs),
so boss images need to be added once directly through `/admin/bosses`.

---

## 8. Project structure

```
collei-web/
  app/                 Pages (public site + /admin panel) and API routes
  components/          Shared UI: Navbar, Countdown, image inputs
  lib/                 MongoDB connection, Mongoose models, admin auth
  scripts/seed.js       One-time import of the bot's existing JSON data
  middleware.js         Protects /admin pages and write API calls
```

## 9. Changing the admin password later

Just update `ADMIN_PASSWORD` (and redeploy on Vercel, or restart locally).
There's a single shared admin login — if you want multiple named admins with
separate logins later, that's a natural next step to build on top of this.
