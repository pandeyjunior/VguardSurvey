# V-Guard Survey — Setup Guide (~10 minutes)

You have three files that work together:

| File | What it does | Who opens it |
|---|---|---|
| `vguard_survey_live.html` | The survey people fill in (8 languages) | Your respondents |
| `AppsScript_Backend.gs` | Records each response into a Google Sheet | Google (runs invisibly) |
| `vguard_admin.html` | Your private analytics dashboard | Only you |

The survey **writes** responses to a Google Sheet; the dashboard **reads** from it. Both talk to the sheet through one small Google Apps Script. Here's how to wire it up.

---

## Step 1 — Create the Google Sheet (1 min)
1. Go to <https://sheets.google.com> and create a **blank spreadsheet**.
2. Name it something like *V-Guard Survey Responses*.
3. Leave it empty — the script creates the header row automatically.

## Step 2 — Add the backend script (3 min)
1. In that sheet, click **Extensions → Apps Script**. A new tab opens.
2. Delete whatever code is in the editor (usually an empty `function myFunction(){}`).
3. Open `AppsScript_Backend.gs` (from this bundle) in any text editor, copy **all** of it, and paste it into the Apps Script editor.
4. Click the **💾 save** icon.

## Step 3 — Deploy it as a Web App (3 min)
1. Top-right, click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** anything (e.g. "v1")
   - **Execute as:** *Me*
   - **Who has access:** **Anyone**  ← important, or respondents can't submit
4. Click **Deploy**.
5. Google asks you to **authorise** — click through, choose your account. If you see "Google hasn't verified this app," click **Advanced → Go to (your project) → Allow**. (This is normal for your own scripts.)
6. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfy...long.../exec`

**Keep this URL handy — you'll paste it into two files next.**

## Step 4 — Connect the survey (1 min)
1. Open `vguard_survey_live.html` in a text editor (Notepad, TextEdit, VS Code — anything).
2. Near the top of the `<script>` section, find:
   ```
   const ENDPOINT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Replace the placeholder with your URL (keep the quotes):
   ```
   const ENDPOINT_URL = "https://script.google.com/macros/s/AKfy.../exec";
   ```
4. Save.

## Step 5 — Connect the dashboard (1 min)
1. Open `vguard_admin.html` in a text editor.
2. Find:
   ```
   const FEED_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Paste the **same** URL. Save.

Done. 🎉

---

## How to run the survey
- **Share the survey** by sending people `vguard_survey_live.html`. Two easy ways to host it as a link:
  - **Netlify Drop** (<https://app.netlify.com/drop>) — drag the file in, get a public link in seconds. Free.
  - **GitHub Pages**, **Google Sites**, or any static host also work.
  - You can even open the file locally and use it in person on a phone/tablet — responses still save to your sheet as long as the device is online.
- Every submission appears as a new row in your Google Sheet within a second or two.

## How to see results
- Open `vguard_admin.html` in your browser (double-click works). It pulls live data and draws all the charts. Click **↻ Refresh** any time to pull the latest.
- Filter by region or language, and use **Export CSV** to pull the filtered data into Excel/Sheets for your report exhibits.

---

## Optional — lock the dashboard with a passphrase
By default anyone with the feed URL could read the raw JSON. To restrict it:
1. In `AppsScript_Backend.gs`, set `var ADMIN_KEY = 'somephrase';` and **re-deploy** (Deploy → Manage deployments → edit → Deploy).
2. In `vguard_admin.html`, set `const ADMIN_KEY = "somephrase";` to match.

*(For a class competition this is usually unnecessary — skip it unless you want to.)*

---

## Troubleshooting
- **"Couldn't load data" on the dashboard** → the URL is wrong, or the deployment access isn't set to "Anyone." Re-check Step 3.4 and Step 5.
- **Responses not appearing** → make sure you pasted the URL into the *survey* (Step 4) and that it ends in `/exec` (not `/dev`).
- **Changed the script?** → you must **re-deploy** (Deploy → Manage deployments → ✏️ edit → Deploy) for changes to take effect. A brand-new "New deployment" gives a *different* URL — if you do that, update both files.
- **Test it yourself first** → fill in the survey once; you should see a row land in the sheet and the count tick up on the dashboard.

## A note on the data
Every answer is stored as a stable English code (e.g. `electrician`, `stab`) regardless of the language the respondent used — so all 8 languages pool into one clean, analysable dataset. The dashboard and CSV translate those codes back into readable labels for you.
