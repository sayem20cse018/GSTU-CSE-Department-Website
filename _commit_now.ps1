Set-Location "f:\CSE Department Website Project"
git add -A backend/src/modules/faculty/faculty.service.ts
git add -A "frontend/src/app/(admin)/admin/faculty/page.tsx"
git add -A "frontend/src/app/(public)/faculty/page.tsx"
git add -A "frontend/src/app/(public)/faculty/on_leave/page.tsx"
git add -A "frontend/src/app/(public)/faculty/faculty-directory.tsx"
git add -A "frontend/src/app/(public)/officer_staff/page.tsx"
git status --short
git commit -m "fix: employmentStatus bug + remove hero banners + improve forms

Status bug (root cause + fix):
  The save() payload loop used 'if (v === empty) skip', which could
  drop employmentStatus if the form value was somehow falsy. Backend
  also had '|| full_time' fallback that would silently overwrite
  on_leave. Both fixed: payload now always includes employmentStatus
  explicitly; backend fallback only triggers on genuinely empty string.

Hero banners removed:
  /faculty, /faculty/on_leave, /officer_staff now show a compact
  page header (breadcrumb + h1 + description) instead of the full
  SectionHero banner. Users see the listing immediately after clicking
  the nav link.

Form improvements:
  Education: degree and institution each get full-width inputs stacked
  vertically; year gets a proper 128px wide field (was col-span-1 = ~60px).
  Awards: title+awardedBy in 2-col grid; description upgraded to textarea.
  All year fields are now comfortably readable.

Card design:
  Faculty cards use 3:4 portrait ratio, white card with border, hover
  lift+shadow+green border, designation pill above name. Consistent
  across /faculty, /faculty/on_leave, /officer_staff."
git push origin main
