"""Shared website catalog. Copy to handlers/site_library.py and register before main_router."""
import asyncio
import html
import os
import re
import time
import aiohttp
from aiogram import Router, F, types
from aiogram.filters import Command

router = Router()
_cache = []
_expires = 0
_lock = asyncio.Lock()

def origin():
    url = os.getenv("COLLEI_SITE_URL", "").rstrip("/")
    if not url.startswith("https://"):
        raise ValueError("COLLEI_SITE_URL must be your HTTPS website URL")
    return url

async def catalog():
    global _cache, _expires
    async with _lock:
        if time.monotonic() < _expires:
            return _cache
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
            async with session.get(origin() + "/api/catalog") as response:
                response.raise_for_status()
                data = await response.json()
        _cache = [e for e in data["entries"] if e.get("status") == "published"]
        _expires = time.monotonic() + 60
        return _cache

def norm(value):
    return re.sub(r"[^\w]", "", value.casefold())

def content(entry):
    esc = html.escape
    body = f"<h2>{esc(entry['title'])}</h2><p>{esc(entry.get('summary', ''))}</p>"
    images = [u for u in entry.get("images", []) if u.startswith("https://")]
    if images:
        body += '<tg-slideshow>' + ''.join(f'<img src="{esc(u, quote=True)}">' for u in images) + '</tg-slideshow>'
    for section in entry.get("sections", []):
        description = esc(section["body"]).replace("\n", "<br>")
        body += f"<details><summary>{esc(section['title'])}</summary><p>{description}</p></details>"
    return body

@router.message(Command("library", "site"))
async def browse(message: types.Message):
    from handlers.media import _raw_api_request
    query = (message.text or "").partition(" ")[2].strip()
    try:
        url = origin()
        if not query:
            return await message.reply("Explore Collei’s shared library, or search with /library Nahida.", reply_markup=types.InlineKeyboardMarkup(inline_keyboard=[[types.InlineKeyboardButton(text="Open library", url=url)]]))
        entries = await catalog()
        exact = [e for e in entries if norm(e['title']) == norm(query)]
        matches = exact or [e for e in entries if norm(query) in norm(e['title'])]
        if not matches:
            return await message.reply("No matching published entry. Try another name.")
        if len(matches) == 1:
            return await _raw_api_request(message.bot, "sendRichMessage", {"chat_id": message.chat.id, "rich_message": {"html": content(matches[0])}, "reply_parameters": {"message_id": message.message_id}})
        rows = [[types.InlineKeyboardButton(text=e['title'][:60], callback_data=f"web|{message.from_user.id}|{e['id']}")] for e in matches[:12] if len(f"web|{message.from_user.id}|{e['id']}".encode()) <= 64]
        rows.append([types.InlineKeyboardButton(text="Browse all on the website", url=url)])
        await message.reply("Choose an entry (up to 12 matches shown):", reply_markup=types.InlineKeyboardMarkup(inline_keyboard=rows))
    except Exception:
        await message.reply("The shared library is unavailable right now. Please try again shortly.")

@router.callback_query(F.data.startswith("web|"))
async def select(callback: types.CallbackQuery):
    from handlers.media import _raw_api_request
    _, owner, entry_id = callback.data.split("|", 2)
    if str(callback.from_user.id) != owner:
        return await callback.answer("Please open your own /library search.", show_alert=True)
    await callback.answer()
    if not callback.message:
        return
    try:
        entry = next((e for e in await catalog() if e['id'] == entry_id), None)
        if not entry:
            return await callback.message.edit_text("This entry is no longer published.")
        await _raw_api_request(callback.bot, "editMessageText", {"chat_id": callback.message.chat.id, "message_id": callback.message.message_id, "rich_message": {"html": content(entry)}, "reply_markup": {"inline_keyboard": []}})
    except Exception:
        await callback.message.edit_text("Could not load this entry. Please try /library again.")
