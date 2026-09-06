# Turn on cross-device sync (one-time, ~2 minutes)

Right now, each kid's checked-off lessons, notes, journal entries, habits, and
outings live only in the browser they were entered in — a different computer,
tablet, or browser starts with a blank slate. This turns that on so every
device stays in sync automatically.

Do this once on **your** (teacher) computer, signed into your Google account.
The kids' devices need **no** Google login at all — they just use the site
like normal, and their progress will quietly sync in the background.

## Step 1 — Make the Google Sheet
1. Go to https://sheets.new (creates a blank Google Sheet).
2. Name it something like **Learn Zone Sync** (top-left).

## Step 2 — Add the script
3. In that Sheet, click **Extensions → Apps Script**.
4. Delete whatever code is in the editor.
5. Open the file **AppsScript-Sync.gs** (in this `plan` folder), copy all of
   it, and paste it in.
6. Click the **Save** icon (💾).

## Step 3 — Deploy it as a web app
7. Click **Deploy → New deployment**.
8. Click the gear ⚙️ next to "Select type" → choose **Web app**.
9. Set:
   - **Description:** anything (e.g. "sync")
   - **Execute as:** **Me (your email)**
   - **Who has access:** **Anyone**
10. Click **Deploy**.
11. It will ask you to **Authorize access** → pick your Google account → if
    you see "Google hasn't verified this app," click **Advanced → Go to
    (your project) → Allow**. (Normal for your own scripts.)
12. Copy the **Web app URL** it gives you. It ends in **/exec**.

## Step 4 — Send me the URL
Paste that `/exec` URL back to me and say "wire it up." I'll drop it into
`plan/lz-sync.js`, commit it, and from then on every device that loads the
site stays in sync — a small "Synced ✓" pill will appear in the bottom-right
corner of the kids' checklist, calendar, master tracker, and journal pages.

---

### How it works, in plain terms
Every few seconds, each open page quietly checks: "did anything change here
since I last checked in?" and "did anything change elsewhere?" — pushing and
pulling only what's different. There's no manual "sync now" button to press;
it just keeps everything caught up on its own, the same way it already keeps
sibling tabs/iframes on one device in sync.

### Notes
- "Who has access: Anyone" means anyone with that exact (long, unguessable)
  link could read or change the data. For a homeschool checklist that's a
  reasonable tradeoff — tell me if you'd rather add a secret key.
- **Heads up on the very first sync**: if a device already has progress saved
  locally from before sync was turned on (e.g. a kid's laptop with lessons
  already checked off) and another device *also* has separate progress for
  that same kid, the two won't automatically merge — whichever device's data
  reaches the Sheet last will win for any keys both devices touched. If that
  might apply to you (i.e. the same kid has used more than one device before
  today), let me know which device has the most complete/current progress so
  I can make sure that one gets treated as the source of truth.
- If you ever change the script later, use **Deploy → Manage deployments →
  Edit → Deploy** to keep the same URL rather than creating a new one.
- The Sheet gets one tab, **sync**, that fills in automatically as data comes
  in — you generally never need to touch it directly.
