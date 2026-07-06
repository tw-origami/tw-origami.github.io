# Turn on cross-computer sync (one-time, ~2 minutes)

Do this once on **your** (teacher) computer, signed into your Google account.
The kids' computers need **no** Google login — they just use the dashboard.

## Step 1 — Make the Google Sheet
1. Go to https://sheets.new (creates a blank Google Sheet).
2. Name it something like **Learn Zone Sync** (top-left).

## Step 2 — Add the script
3. In that Sheet, click **Extensions → Apps Script**.
4. Delete whatever code is in the editor.
5. Open the file **AppsScript-Code.gs** (in this dashboard folder), copy all of it, and paste it in.
6. Click the **Save** icon (💾).

## Step 3 — Deploy it as a web app
7. Click **Deploy → New deployment**.
8. Click the gear ⚙️ next to "Select type" → choose **Web app**.
9. Set:
   - **Description:** anything (e.g. "sync")
   - **Execute as:** **Me (your email)**
   - **Who has access:** **Anyone**
10. Click **Deploy**.
11. It will ask you to **Authorize access** → pick your Google account → if you see "Google hasn't verified this app," click **Advanced → Go to (your project) → Allow**. (This is normal for your own scripts.)
12. Copy the **Web app URL** it gives you. It ends in **/exec**.

## Step 4 — Send me the URL
Paste that `/exec` URL to me here and say "wire it up." I'll drop it into the
dashboard, and from then on every computer stays in sync automatically.

---

### Notes
- "Who has access: Anyone" means anyone with that exact (long, unguessable) link could
  read or flip a check-off. For a homeschool checklist that's fine. Tell me if you ever
  want to add a secret key.
- If you change the script later, use **Deploy → Manage deployments → Edit → Deploy**
  to keep the same URL.
- The Sheet's **checkoffs** tab fills in automatically the first time a box is ticked.
