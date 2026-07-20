/**
 * One-time (or re-runnable) import of the Telegram bot's existing JSON data
 * into MongoDB, so the website launches with your current character cards,
 * build guides, and boss list already in place.
 *
 * Usage:
 *   npm run seed
 *
 * Requires MONGODB_URI to be set (in .env.local or the shell environment).
 *
 * Notes:
 *  - cards.json / guides.json already contain public imgbb image URLs (the
 *    bot uploads there), so those import cleanly with real images.
 *  - bosses.json only stores Telegram file_id values, which aren't public
 *    URLs, so bosses are seeded with names only — add boss images from the
 *    admin panel afterwards.
 *  - special_media.json only has public image_url values for "next:theatre";
 *    everything else in that file is Telegram-only and is skipped. Set the
 *    Abyss/Theatre/Stygian countdown times yourself from /admin/endgame.
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // fallback to .env if .env.local isn't present
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in first.");
  process.exit(1);
}

const dataDir = path.join(__dirname, "data");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf-8"));

const CharacterSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const GuideSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BossSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const EndgameSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Character = mongoose.model("Character", CharacterSchema);
const Guide = mongoose.model("Guide", GuideSchema);
const Boss = mongoose.model("Boss", BossSchema);
const Endgame = mongoose.model("Endgame", EndgameSchema);

async function seedCharacters() {
  const cards = readJson("cards.json");
  let count = 0;
  for (const card of cards) {
    if (!card.character_key || !card.image_url) continue;
    await Character.findOneAndUpdate(
      { characterKey: card.character_key },
      {
        name: card.name,
        characterKey: card.character_key,
        imageUrl: card.image_url
      },
      { upsert: true }
    );
    count++;
  }
  console.log(`Characters seeded: ${count}`);
}

async function seedGuides() {
  const guides = readJson("guides.json");
  let count = 0;
  for (const g of guides) {
    if (!g.character_key || !g.image_url) continue;
    const exists = await Guide.findOne({ characterKey: g.character_key, imageUrl: g.image_url });
    if (exists) continue;
    await Guide.create({
      name: g.name,
      characterKey: g.character_key,
      imageUrl: g.image_url
    });
    count++;
  }
  console.log(`Guides seeded: ${count}`);
}

async function seedBosses() {
  const bosses = readJson("bosses.json");
  let count = 0;
  for (const b of bosses) {
    if (!b.name) continue;
    await Boss.findOneAndUpdate(
      { name: b.name },
      { name: b.name, imageUrl: "", guideImages: [] },
      { upsert: true }
    );
    count++;
  }
  console.log(`Bosses seeded: ${count} (add images from /admin/bosses)`);
}

async function seedEndgameDefaults() {
  let special;
  try {
    special = readJson("special_media.json");
  } catch {
    special = {};
  }

  const nextTheatreImages = (special["next:theatre"] || [])
    .map((e) => e.image_url)
    .filter(Boolean);

  const modes = [
    { mode: "abyss", label: "Spiral Abyss" },
    { mode: "theatre", label: "Imaginarium Theater" },
    { mode: "stygian", label: "Stygian Onslaught" }
  ];

  for (const m of modes) {
    await Endgame.findOneAndUpdate(
      { mode: m.mode },
      {
        $setOnInsert: {
          mode: m.mode,
          label: m.label,
          currentEnd: { Asia: null, EU: null, NA: null },
          nextStart: { Asia: null, EU: null, NA: null },
          currentImages: [],
          nextImages: m.mode === "theatre" ? nextTheatreImages : []
        }
      },
      { upsert: true }
    );
  }
  console.log("Endgame placeholder documents ensured (set countdown times from /admin/endgame).");
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "collei" });
  console.log("Connected to MongoDB. Seeding…");

  await seedCharacters();
  await seedGuides();
  await seedBosses();
  await seedEndgameDefaults();

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
