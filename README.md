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

The app is for a trusted school operator on a protected device. Cached records are accessible to anyone with access to that browser profile. Use account/device locks and a private OneDrive folder. No app-level role restrictions or immutable server audit are included. Every user with Can edit access to the shared records has the same app deletion and restoration controls. Payment deletion removes the payment from active totals after confirmation and keeps a recoverable copy in Activity history.

## Local preview

Run `python3 -m http.server 8000` in this directory, then open http://localhost:8000. Folder access needs HTTPS or localhost. For Microsoft sign-in in local development, register http://localhost:8000/ as another SPA redirect URI. Opening a file:// URL does not support cloud sign-in.

## Install on Android or Windows

After GitHub Pages has finished deploying, open https://sreenivassarma82.github.io/preschoolapp/ in Chrome (Android or Windows) or Edge (Windows). Use the live HTTPS website, not the github.com code page or an extracted local file.

- Android Chrome: refresh the website while online, then tap the app's “Install app” button when it appears, or Chrome's ⋮ menu → Add to Home screen → Install. Menu labels vary by Chrome version. Chrome may require a little interaction with the page before offering installation.
- Windows Chrome: use “Install app” in the page or the install icon in the address bar. Edge also offers ⋯ → Apps → Install this site as an app.
- Open Little wings preschool ledger from your home screen or Start menu. The installed app uses the same records/storage settings as its browser profile. Microsoft may require sign-in again, especially when switching between browser and installed app.

The manifest uses relative URLs so GitHub's repository subdirectory works correctly. App icons include 192px, 512px and maskable variants. The service worker caches only application files. It does not cache records, tokens, Microsoft requests or OAuth callback URLs. Offline mode opens the interface and allows browser-only records to be viewed/edited; cloud saves still require internet and loaded OneDrive records. Keep backups.

If Chrome still offers only a shortcut, confirm that deployment has finished, close and reopen the live website, and refresh online. Do not clear browser storage merely to refresh the app, because that can remove locally stored student records and settings. Native APK/EXE packages are not required for this installable web app.

## Troubleshooting setup

Academic years use separate numeric Start year and End year fields. The end year fills automatically when you change the start year; the two years must be consecutive.

Saving OneDrive settings does not activate cloud storage. Browser or local-folder storage stays available until you successfully connect and load/initialize OneDrive records. If an older incomplete setup blocks changes, use “Use browser storage for now” near the academic-year form. This is an explicit storage change, not a promise of automatic later synchronization. Loading existing cloud records may replace browser-only changes; download a JSON backup first.

After a first Microsoft sign-in, the app opens the OneDrive folder browser. After choosing a folder, it asks whether to load existing records or initialize a new file. Signing back into an already connected account reloads the remembered folder. Existing records are not overwritten just because you sign in. OAuth's short-lived PKCE verifier/state is temporarily stored in localStorage so a callback in another same-origin tab can finish sign-in; it is removed when the callback arrives and cannot be accepted after 15 minutes. Microsoft access/refresh tokens remain in sessionStorage.

If sign-in reports AADSTS50011, add the exact app URL shown in Settings under Microsoft Entra → Authentication as a Single-page application (SPA) redirect URI. AADSTS9002326 or a client-secret requirement commonly means the registration uses Web instead of SPA. Check Application (client) ID and supported account types for AADSTS700016. Consent errors may require approval of Files.ReadWrite delegated permission by your school administrator. The app displays Microsoft’s error details with relevant setup guidance.

## Choose a OneDrive folder from the app

In Year & storage settings → OneDrive cloud:

1. Save your Microsoft Application (client) ID and account type, then sign in with Microsoft. The one-time Microsoft app registration is still required.
2. Tap “Browse OneDrive folders”. On first sign-in the browser opens automatically.
3. Tap folder names to open them. Use the breadcrumb buttons to return to a parent folder. You can enter a new folder name and tap “Create folder”.
4. Once inside your desired folder, tap “Use this folder”. The OneDrive root cannot be selected: choose a dedicated subfolder for preschool records.
5. Confirm loading existing records or creating a records file from the current browser records. Existing records are never overwritten merely by selecting a folder.

The selected folder's path and stable OneDrive item ID are remembered in this browser. You do not need to select it every visit; its stable ID also survives a rename or move within the same account. A new device requires the same Microsoft setup and an initial folder selection. The ordinary folder browser lists the signed-in account’s folders. To use another user’s shared folder, paste its link into “Shared OneDrive folder link”. Access depends on Microsoft sharing permissions and organization policy; GitHub membership does not grant it. To change the folder, use “Browse OneDrive folders” again. The typed path option remains available.

## Collaborator sign-in on Android

The collaborator should open the live HTTPS site in Chrome (not a GitHub ZIP, embedded messaging browser or private/incognito window). The app now explicitly opens Microsoft's account chooser, supports PKCE callbacks arriving in another same-origin browser tab, and records connection failures locally without logging tokens.

1. On the owner's device: Settings → Download connection settings. Send the resulting little-wings-connection.json file to the collaborator. It contains only the public Microsoft client ID, account type and path; it does not contain tokens, shared links or student records.
2. Share the school’s OneDrive folder with the collaborator’s Microsoft email using **Can edit** access. Send the folder sharing link separately and have the collaborator accept the invitation. Prefer a link restricted to their account, not a public link exposing student records.
3. On Android: Settings → Import connection settings, then Sign in with Microsoft and choose the collaborator’s own Microsoft account. Do not share passwords.
4. In the OneDrive folder browser, paste the school’s folder link into **Shared OneDrive folder link** and tap **Open shared folder**. Tap **Use this folder**, then confirm loading the existing records.
5. For different users’ personal and school accounts, the Microsoft app registration must support “Accounts in any organizational directory and personal Microsoft accounts”; select common in the ledger. An organization's administrator may need to approve delegated Files.ReadWrite consent or guest access. A single-tenant app cannot be made multi-tenant merely by changing the app's tenant selector.

A GitHub collaborator invitation is separate from a OneDrive invitation. If sign-in still fails, capture the exact AADSTS code and error text; actual account/tenant policy cannot be repaired by the static web app. Live collaborator sign-in has not been verified with a real account.

## Deletion and Activity history

- Students tab → Delete: removes that year's enrolment and its payments from active records and fee totals. Other academic-year enrolments remain intact.
- Fees & payments → Delete/Void: removes an individual payment from totals. Its copy remains recoverable.
- Settings → Delete this academic year: allowed only when empty and another year exists.
- Activity history → Deleted records → Restore: restores deleted students with their payments, individual payments, or empty-year fee settings. Restore a missing year/student first when prompted. Conflicting admission numbers and duplicate active records are not overwritten.

Activity history records primary app actions including record creation/editing/deletion/restoration, fee/year changes, exports, navigation, searches, connection setup, sign-in outcomes and failed saves. Successful record-change entries are written atomically in the same preschool-records.json save as the change. The tab shows time, operator, action, item, year, details and outcome; it supports search, year filters and Excel export. The normal ledger workbook also includes Activity history and Deleted records sheets.

Set **Your name for activity history** in Settings. When a Microsoft session provides an account label, it is included alongside that name. A manually entered name and browser clock are not trusted identity or timestamp evidence.

GitHub Pages is static and has no server-side database. Activity entries are persisted with the ledger in OneDrive (or the local folder/browser when that mode is selected). Non-record actions and failed requests are queued locally and synced when the connected records become writable; use **Sync pending activity** to retry. Failed data writes never produce a successful record-change entry. Historical activity before this feature was added is not reconstructed. JSON restore preserves existing stored history and merges imported entries.

This is a shared operational history, not a tamper-proof backend audit: a person with access to the JSON file can modify its contents, older cached app versions may not log changes, and disconnected device events cannot reach OneDrive until reconnecting. Pending activity for a different ledger remains on that device rather than being sent to an unrelated ledger. Setup/sign-in events follow the ledger when a OneDrive connection is established. A server-enforced append-only audit and roles would need a separately hosted authenticated backend.

## Branches, staff and attendance

Refresh the app to load this update. Choose a branch in the header. Existing admissions migrate to Select branch without changing their payment references. Academic years and currency are shared; annual class fees can be set separately for each branch and year in Settings. Student summaries, admissions, contacts and fee reports follow the selected branch. Export all years means all years for that branch. Staff Excel contains the selected branch's master, transactions, attendance and salary summary. JSON backups include every branch.

- **Branch master:** add/edit branch code, name, manager, address, phone, email and notes. Archive/unarchive a branch to retain its records and restrict entry. Delete branch & data removes all its admissions, payments, staff, salary transactions, salary snapshots and attendance from active data, across all years. A recoverable copy appears in Activity history → Deleted records. At least one branch must remain. Restore the branch before restoring individual deleted admissions belonging to it. Restore missing academic years first.
- **Admin → Staff master:** maintain code, name, designation, contact/address, joining date, monthly base salary, status, payment details and notes. Mark departing staff Inactive to retain their history.
- **Staff → Salary & transactions → Salary:** select a month and save a salary snapshot to preserve the base salary for that month before changing the staff master salary. Existing snapshots are not overwritten. Net salary = base + salary adjustments − deductions − advance repayments. Record Salary payment separately to reduce the due amount. Negative due indicates a credit/overpayment. An advance does not deduct salary until an Advance repayment is entered. Outstanding advances uses all recorded transactions. Attendance has no automatic salary deduction or statutory tax calculation.
- **Staff → Salary & transactions → Advances & deductions:** record Advances, Advance repayments, Deductions, Salary payments and positive Salary adjustments with date, salary month, amount, reference and notes. Repayments above outstanding advances are blocked. Incorrect staff transactions can be deleted, with the action logged; use a JSON backup for recovery of individual staff transactions.
- **Staff → Attendance:** select a date, mark each staff member, then Save attendance. Statuses: Present, Absent, Half day, Paid leave, Unpaid leave, Holiday, Weekly off. Not marked removes that date's entry. Select a month to view status counts. Staff marked Inactive still have previously recorded attendance available for review.

All branch/staff edits and attendance changes use the same ledger save and activity history as admissions. The OneDrive file is still shared storage: use one editor at a time and reload before editing on another device. All collaborators with edit access have the same capabilities.

## Reset the shared ledger for all devices

The reset must be performed by someone signed in to the connected school OneDrive folder. Updating this repository does not clear your private OneDrive records.

1. Open Year & storage settings and use Connect folder / reload cloud data. Confirm that **OneDrive cloud connected** appears in the header and that the intended school records are loaded.
2. Optionally download a JSON backup. Under Reset all records and history, press Reset all records and history. Confirm and type `RESET ALL`.
3. On every other device, reload the connected folder from Settings. Until a device reloads, it can display previously cached records. A stale cloud save is rejected by the OneDrive file version check.

Reset removes all branches, students, payments, staff, salary transactions, salary snapshots, attendance, deleted records and activity history from the connected ledger. It creates an empty Select branch and default academic year with zero fees, retaining school name, currency and this device's OneDrive connection settings. New activity is logged after reset. Old downloaded backups and OneDrive file version history are outside the reset. If using browser storage instead of the connected folder, the reset affects that browser only.

New admissions start with a Branch selector, defaulting to the branch in the header. Choose any active branch before entering the student details. Fees and admission-number uniqueness use the chosen branch; the app opens that branch after a successful save. Existing admissions display their branch as a locked field to keep their payment history in the same branch.

## Students, Staff and Admin modules

The primary menu now has three modules, with section tabs beneath the header:

- **Students:** Overview, Admissions, Parents & contacts, Fees & payments, Reports, Performance.
- **Staff:** Salary & transactions, Attendance.
- **Admin:** Branch master, Staff master, Year/fees/storage setup, Subjects per class, Activity history.

All master-data screens are under Admin. Select the branch and academic year in the header before entering or reviewing records. Existing data, OneDrive configuration, deletions and backups continue to work.

## Subjects, marks and progress report cards

1. In **Admin → Subjects per class**, choose the branch, academic year and class. Set subject names and oral, written and assignment maximum marks, then Save class subjects. Set a component maximum to zero if it is not assessed. The initial subjects follow the supplied report card: English, Maths, Drawing, Hindi and EVS; oral/written/assignment maxima are 10/30/10, with Drawing 0/30/10. Set the appropriate syllabus separately for each class and branch. New academic years copy saved subject settings from the previous selected year.
2. In **Students → Performance**, choose the student and term (Term I, Term II or a custom assessment name). Enter achieved marks, personal/social observation grades, remarks, report date and school incharge name, then Save performance.
3. Use **Download marksheet PDF** or **Download marksheet Excel**. The preview and both exports follow the supplied report card's structure: logo, student/year/class/branch, optional admission photo, oral/written/assignment marks, totals and academic grade, grading code, 17 personal/social observations, remarks, signature line and date. The attached logo is used unchanged; the supplied student's sample marks/name/photo are not published or imported into the ledger.

Blank achieved marks mean not assessed; enter `0` for a scored zero. Maximum marks of zero are excluded. Academic grade is Pending until every assessed component has a score. Grade bands follow the supplied workbook's calculation, rounding the percentage upward to the next whole percentage for grade lookup: 91–100 A+, 81–90 A, 71–80 B+, 61–70 B, 51–60 C+, 41–50 C, 35–40 D, below 35 F. The template's printed legend has a gap at 35%; this app uses D at 35%, matching its lookup table. Personal/social grades are AL (Always), ST (Sometimes), NV (Never) and R (Rarely).

Saved assessments keep their own subject/maxima snapshot, so changing the master does not recalculate earlier marksheets. Reopen the same student and term to update achieved marks and observations. Student or branch deletion includes their performance records in the restorable copy. Class changes on an admission do not change the class recorded on earlier assessments. The regular Excel report also includes performance summary and subject marks; JSON backups include all subject setups and assessments. Reset all records and history also clears them.

PDF downloads work without a print-service setup. PDFs contain a high-resolution image of each A4 report page; long subject lists or remarks continue on additional pages. Excel marksheets contain formatted editable cells, merged report headings, print settings and the unchanged embedded logo. Signature fields provide a signatory name and blank signature line, not a digital signature. Save changes before exporting a report.

## Automatic admission numbers

New admissions receive a read-only number on successful save: `BRANCHCODE-STARTYEAR-ENDYEAR-0001`, for example `LW01-2026-2027-0001`. The preview changes when a different branch is selected. Branch codes use uppercase letters and digits in the prefix; spaces and punctuation are removed. Set branch codes in Admin → Branch master. Each branch and academic year has its own running sequence. Deleted numbers remain reserved, counters are included in JSON backups and shared OneDrive records, and failed saves consume no number. Changing a branch code affects only future numbers and continues that branch/year sequence. Existing admission numbers are preserved when edited. Enrol next year generates a new number for the new academic year. Ordinary backup restoration preserves the highest counters already known to this ledger; Reset all records and history resets the counters too. OneDrive still requires one editor at a time and rejects stale saves.

## Admission save errors

Admission validation and storage failures appear inside the open admission form. Required or invalid fields also show a field-specific message. Errors identify the selected branch, discount/annual fee, invalid dates, photo size/type/read failures, missing OneDrive connection and failed cloud saves. Failed saves retain entered fields and do not consume an admission number. A photo is optional; the no-photo path also accepts a missing file value. While saving, the save button reads Saving… and repeated taps are ignored. A successful save closes the form, opens Students → Admissions and displays the student's saved number.

## Delete or reset activity logs

Open **Admin → Activity history**. Each activity row has **Delete log**. The toolbar has **Reset all activity logs**, which clears stored and pending activities across all branches and years in the current ledger. Both actions ask for confirmation. Student, payment, fee, staff, attendance, subject, performance, admission numbering and Deleted records recovery data are retained. New activities continue to be recorded after a reset.

When OneDrive or a folder is connected, the log changes save to that shared ledger; other devices must refresh the app and reload the shared folder. Browser-only storage changes affect that browser only. A failed save leaves the logs intact. Deleted-entry markers and a log generation prevent older pending queues or ordinary backup restores from reintroducing removed logs. Previously downloaded files and OneDrive version history remain separate copies.

Version r14: Save admission displays progress beside the button and reports validation or loading errors. Open https://sreenivassarma82.github.io/preschoolapp/?update=r14 online and confirm Version r14 in the header. Do not clear browser storage to update.

R15: Performance opens a branch/class/term roster showing status, total/out-of and percentage. Click a student name for the full-width form. Green requires all assessed marks and all 17 observations; other names stay black. Tests cover completion, partial records, empty classes and independent term summaries.

R16: Students → Bonafide certificate provides class/student selection, preview and PDF download in the supplied certificate format, using the existing unchanged logo. Admission records supply names, parents, birth date, class and academic year; missing required admission data produces a visible message. Date, place and principal name are configurable. Signature area is left for signing. The three original address lines appear on certificates, marksheet previews, every PDF page and Excel reports. Tests verify certificate data/validation and PDF page bounds, marksheet footer on every page, and exact address strings in Excel. Live Android rendering was not available. The attached sample student’s data and signature are not included in the app.
