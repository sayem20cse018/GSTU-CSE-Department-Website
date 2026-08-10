/**
 * Strips Prisma read-only fields from any object before sending to the API.
 * These fields are auto-managed by Prisma and must NOT be in PATCH/POST bodies.
 */
const READONLY = new Set([
  'id', 'createdAt', 'updatedAt', 'key',
  // nested relation arrays returned by Prisma — never send these back
  'education', 'publications', 'awards', 'officeHours',
  'workExperience', 'higherEducation', 'achievements',
  'attachments', 'files', 'media', 'schedule',
  'speakers', 'projects', 'admissionRequirements', 'careerOpportunities',
  'equipment', 'images',
  'activityLog',
]);

export function stripReadonly<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !READONLY.has(k))
  ) as Partial<T>;
}
