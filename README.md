# Little wings preschool ledger — Android and Windows

A responsive browser application, ready for GitHub Pages. No build tools or dependencies are required. Use Chrome on Android, or Chrome/Edge on Windows.

## Included

- Admissions for each academic year, using the supplied form: student's three-part name, blood group, parents, address, mobile, class, admission date, photo and parent/staff signatory names.
- Optional DOB, admission number, additional contact and notes.
- Playgroup, Nursery, Jr. Kg and Sr. Kg.
- Annual fees per class/year, individual fixed-amount discounts, payment records, balances and overpayment credits.
- Student, parents/contact, fee/payment, overview and report tabs.
- Search, class and fee-status filters.
- Real .xlsx export: Students, Fees, Payments, Summary. Export a year, filtered records or all years.
- JSON backups and restore, preserving photos and every year's records.
- Enrolment carry-forward to the next configured year without moving previous payments or discounts.

## Host on GitHub Pages

1. Create a GitHub repository for the application code.
2. Upload all application files, including manifest.webmanifest, pwa.js, sw.js and the icons folder to the root of the main branch.
3. Under Settings → Pages, choose “Deploy from a branch”, main, / (root).
4. Open the Pages URL in Chrome on Android or Chrome/Edge on Windows.

Only upload application code to GitHub. Never commit records files, photos or JSON backups. GitHub Pages serves the code; records are kept in the chosen OneDrive account and browser cache. The public site has no student database or shared server-side login.

## One-time Microsoft setup for Android + Windows

Direct cloud storage needs a Microsoft Entra application registration. The app is a public Single-page application (SPA), using OAuth authorization code flow with PKCE. It never needs a client secret. No Microsoft credentials are shipped with this download.

1. Sign in to https://entra.microsoft.com and open App registrations → New registration. If your personal account cannot create an app registration, use an Entra tenant where you have registration rights or ask your administrator.
2. For a personal OneDrive account and/or school accounts, select “Accounts in any organizational directory and personal Microsoft accounts”. Name the app, for example “Preschool Ledger”.
3. Add the live GitHub Pages URL as a **Single-page application (SPA)** redirect URI. It must match exactly, including the repository path and trailing slash. Settings displays the exact URL to register. If you later open index.html explicitly, that is a different URL; consistently use the registered URL.
4. Under API permissions, add Microsoft Graph → Delegated permissions → Files.ReadWrite. The sign-in request also asks for offline_access to refresh the session while the app remains open. Grant consent if your organization requires it. Files.ReadWrite permits access to your files, although this app only uses the configured preschool folder. No application permissions or client secret are needed.
5. Copy the Application (client) ID from Overview. Open the live app's Year & storage settings and enter that ID, account/tenant and your folder path (e.g. School/Admissions). Choose “common” for both personal and organization accounts, “consumers” for personal only, or “organizations” for school/work only. Save cloud settings.
6. Click “Sign in with Microsoft”. After returning to the app, click “Connect folder / reload cloud data”. The app creates missing folders, then either loads existing records or asks to initialize a new records file using the current browser records.
7. On the other device, enter the same client ID and folder path, sign in with the same OneDrive account and connect. Each device remembers its own settings. A shared school account is not provisioned by this application.

The folder path is stored in local browser settings and need not be selected each use. Tokens are stored in sessionStorage, not permanent browser settings. Microsoft sign-in can be required when you reopen the app or the session expires; remembering a folder does not bypass Microsoft security. Device permissions and organization policy can also require renewed consent.

Cloud mode requires internet connectivity. Edits are blocked until the records have been loaded and while OneDrive is unreachable; there is no offline edit queue. Reload cloud data before editing on another device. The app checks file revisions and uses ETags for conditional updates. Use one editor at a time; this is not a collaborative transactional database.

## Windows-only alternative: locally synced OneDrive folder

If you do not want Microsoft API registration, install/sign in to OneDrive on Windows, open the app on HTTPS in Chrome/Edge, disconnect cloud mode, and choose a folder inside your computer's synced OneDrive directory. The app writes preschool-records.json; your computer handles OneDrive sync. Android browsers do not reliably support this local folder mechanism.

The folder handle is remembered in IndexedDB for this browser/profile/origin. Browser security may require a click to renew access: “Reload folder data”. Clearing browser data or changing devices requires choosing the folder again. Local OneDrive synchronization has delays; never edit concurrently on different computers. The app checks the local revision before saving but cannot guarantee cross-device conflict prevention.

## First admissions and fees

Set school name, currency and annual fees in Settings before entering discounts. Fees after discount are annual fee minus discount; the balance is net fee minus all recorded payments. Outstanding totals sum positive balances, and credits are shown separately. Changing a year's fees recalculates that year's student balances. Discounts remain fixed amounts. There is no instalment due-date schedule; “due” means unpaid annual balance, not overdue instalments.

Add an academic year and use “Enrol next year” to copy a student's details. Payments and discount start at zero, and class advances one level. Sr. Kg remains Sr. Kg for staff review. Previous years remain intact.

## Exports, backups and access

Excel export is for reporting. Photos are not embedded in the workbook; a column indicates their presence in the JSON backup. Phone numbers are exported as text to preserve leading zeroes. Text cells are strings, never formulas. Parent and staff signature fields store signatory names, not legally certified electronic signatures.

JSON restore replaces current records after confirmation, including the connected cloud/local folder. Download a backup before restoring. Photos are limited to 1 MB each; the browser cache has a quota, so keep regular JSON backups. Cloud/folder records remain authoritative when connected.

The app is for a trusted school operator on a protected device. Cached records are accessible to anyone with access to that browser profile. Use account/device locks and a private OneDrive folder. No role-based access, immutable accounting audit, or student portal is included. Payment “Void” removes a payment after confirmation.

## Local preview

Run `python3 -m http.server 8000` in this directory, then open http://localhost:8000. Folder access needs HTTPS or localhost. For Microsoft sign-in in local development, register http://localhost:8000/ as another SPA redirect URI. Opening a file:// URL does not support cloud sign-in.

## Install on Android or Windows

After GitHub Pages has finished deploying, open https://sreenivassarma82.github.io/preschoolapp/ in Chrome (Android or Windows) or Edge (Windows). Use the live HTTPS website, not the github.com code page or an extracted local file.

- Android Chrome: refresh the website while online, then tap the app's “Install app” button when it appears, or Chrome's ⋮ menu → Add to Home screen → Install. Menu labels vary by Chrome version. Chrome may require a little interaction with the page before offering installation.
- Windows Chrome: use “Install app” in the page or the install icon in the address bar. Edge also offers ⋯ → Apps → Install this site as an app.
- Open Little wings preschool ledger from your home screen or Start menu. The installed app uses the same records/storage settings as its browser profile. Microsoft may require sign-in again, especially when switching between browser and installed app.

The manifest uses relative URLs so GitHub's repository subdirectory works correctly. App icons include 192px, 512px and maskable variants. The service worker caches only application files. It does not cache records, tokens, Microsoft requests or OAuth callback URLs. Offline mode opens the interface and allows browser-only records to be viewed/edited; cloud saves still require internet and loaded OneDrive records. Keep backups.

If Chrome still offers only a shortcut, confirm that deployment has finished, close and reopen the live website, and refresh online. Do not clear browser storage merely to refresh the app, because that can remove locally stored student records and settings. Native APK/EXE packages are not required for this installable web app.
