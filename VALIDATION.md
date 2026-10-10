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

Branch and staff update: Node VM integration checks passed for legacy migration to Select branch, admission/fee isolation, staff master saves, payroll calculations, advance repayment limits, fixed monthly salary snapshots, attendance updates and duplicate validation, archived branch write guards, cascading branch deletion/restoration (including salary snapshots), and atomic cloud reset. Failed reset writes preserve local records/history. Existing financial, deletion/history, setup, PWA caching, and mocked shared-OneDrive authorization checks pass. Staff and branch workbooks use the existing OOXML exporter. These checks use mocked browser and Microsoft APIs; live Android/Windows installation and Microsoft account authentication were not performed in this session.

Run the branch/staff/reset regression suite with `node tests/admin.cjs`. The suite uses synthetic records and mocked Microsoft storage. The exported workbook was opened with openpyxl and verified to contain eleven sheets, including branch master, staff master, staff transactions, staff attendance and salary summary.

Branch-first admission regression checks: `node tests/admission-branch.cjs` passes selected-branch fee validation, branch-scoped admission numbers, post-save selection, locked branch on existing admissions, and rejection of archived/unknown branches.

Performance and navigation update: `node tests/performance.cjs` checks three primary modules, Admin master screens, per-branch/year/class subjects, frozen assessment maxima, achieved-mark limits, missing versus zero marks, grade thresholds, performance cascade deletion/restoration, legacy migration and reset. It exercises PDF pagination with a mocked canvas, including 20 subjects and long remarks. Its generated Excel was opened with openpyxl to verify report values, merges, print settings and the exact original logo bytes. The PDF container was read with pypdf to verify two A4 pages and embedded images. Existing branch, admission, history, financial, setup, PWA and shared-OneDrive mock suites pass.

Chromium launch is blocked by this environment's socket restrictions. Actual browser canvas rendering, device downloads and Android/Windows visual appearance were not tested here. Export files produced by the regression suite use synthetic records and are written to the OS temporary folder (or TEST_OUTPUT_DIR).

Automatic admissions: `node tests/admission-number.cjs` verifies read-only numbering, selected branch/year prefixes, separate sequences, preserved existing IDs, no reuse of deleted numbers, branch-code changes, next-year enrolments, failed-save counters and legacy backup migration. Branch, performance, history, financial and app-shell caching regression suites pass.

Admission errors: `node tests/admission-errors.cjs` passes inline required-field messages, fee/discount errors, oversized/unreadable photos, missing file values, disconnected OneDrive, rejected cloud saves, retained form and unchanged data on failure, successful close/Admissions navigation, captured native invalid-field messages and slow-save duplicate tap protection. Automatic admission numbers, branch selection, history, financial and PWA regression checks also pass. These checks use a mocked browser and storage; live device verification remains unavailable.

Log management: `node tests/log-management.cjs` checks deletion of stored and pending activities, clear-all without changing school records, cancellation, stale pending and backup suppression, new activity after clearing, and atomic cloud success/failure. History, admissions, performance and PWA regressions also pass. Live Microsoft storage and device UI were not tested in this session.

R14 admission fix: actual HTML button onclick tested through bootstrap and admission save, including validation, persisted student and success notice, missing handler and thrown error. Existing admission tests cover slow cloud saves and duplicate taps. Versioned shell assets and offline caching tested with mocked service worker. No live Android/browser verification available.

R15: Performance opens a branch/class/term roster showing status, total/out-of and percentage. Click a student name for the full-width form. Green requires all assessed marks and all 17 observations; other names stay black. Tests cover completion, partial records, empty classes and independent term summaries.
