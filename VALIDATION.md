# Verification

Automated JavaScript logic checks passed for:
- Annual fee less fixed discount, payment totals, remaining balances and overpayment credits.
- Separate payments between academic-year enrolments.
- Overview/fee/contact/settings rendering and student search.
- Blocking cloud writes before loading cloud records.
- Keeping current records unchanged when a cloud save fails.
- PKCE sign-in parameters and absence of a client secret.
- Mocked Microsoft Graph reads, ETag conditional saves, changed-file rejection, offline errors and conflict-protected new-file upload.

Generated .xlsx was opened with openpyxl and checked for four sheets, numeric fee amounts, leading-zero phone numbers as text, credit balances and separate-year payment totals.

JavaScript syntax checks passed for app.js, cloud.js and excel.js.

Limitations: real browser/device QA was not run because the execution sandbox blocked Chromium startup. Actual Microsoft sign-in and live OneDrive operations have not been tested: they require the owner's Microsoft application registration and consent. Before using real student records, test sign-in and a dummy admission on Android and Windows, reload from the second device, record a dummy payment, export Excel, and verify backup/restore. Use one editor at a time.

Setup regression checks passed for saving unconnected OneDrive settings without blocking local academic years, numeric start/end year entry, consecutive validation, explicitly switching an incomplete cloud setup to local storage, activating cloud after load, cross-tab PKCE callbacks, and Microsoft SPA registration error guidance. Previous fee/export and mocked Graph checks also passed after these changes. Live account sign-in remains unverified.

Folder-picker regression checks passed for paginated folder-only listing, alphabetical sorting, validated conflict-protected creation, remembered stable folder IDs, folder resolution after rename, root-selection guard, nested navigation, parent breadcrumbs and selecting the current folder. Live account/device testing remains unverified.

Activity/deletion checks passed for recoverable student/payment/year deletion, restoration with payment totals, actor labels, atomic record/log saves, pending failed activity, stale edit protection, preserving history on restore and legacy schema migration. Mocked shared-OneDrive tests verified account chooser parameters, shared-link permission errors, owner-drive item routing and ETag-protected writes. Actual collaborator account sign-in, consent and device UI remain unverified.

Branch and staff update: Node VM integration checks passed for legacy migration to Main branch, admission/fee isolation, staff master saves, payroll calculations, advance repayment limits, fixed monthly salary snapshots, attendance updates and duplicate validation, archived branch write guards, cascading branch deletion/restoration (including salary snapshots), and atomic cloud reset. Failed reset writes preserve local records/history. Existing financial, deletion/history, setup, PWA caching, and mocked shared-OneDrive authorization checks pass. Staff and branch workbooks use the existing OOXML exporter. These checks use mocked browser and Microsoft APIs; live Android/Windows installation and Microsoft account authentication were not performed in this session.

Run the branch/staff/reset regression suite with `node tests/admin.cjs`. The suite uses synthetic records and mocked Microsoft storage. The exported workbook was opened with openpyxl and verified to contain eleven sheets, including branch master, staff master, staff transactions, staff attendance and salary summary.
