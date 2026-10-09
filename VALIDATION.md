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
