# Analytics Integration

## Status: NOT CONFIGURED

No analytics provider is currently integrated into this project.
This directory is a placeholder for a future real integration.

## Recommended options

| Provider | Self-hosted | Privacy-friendly | Free tier |
|---|---|---|---|
| [Umami](https://umami.is) | ✅ Yes | ✅ Yes | ✅ Yes |
| [Plausible](https://plausible.io) | ✅ Yes | ✅ Yes | ❌ Paid |
| Google Analytics 4 | ❌ No | ❌ No | ✅ Yes |

## How to integrate Umami (recommended)

1. Deploy Umami to your own server or use umami.is cloud.
2. Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in your Vercel environment variables.
3. Set `NEXT_PUBLIC_UMAMI_URL` to your Umami instance URL.
4. Add the script tag to `frontend/src/app/layout.tsx`:

```tsx
{process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
  <script
    defer
    src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
  />
)}
```

5. Use the Umami API to fetch page-view stats for the dashboard.

## IMPORTANT

Do NOT create fake visitor statistics in the dashboard.
The dashboard currently shows real data only from the PostgreSQL database.
Visitor analytics must come from a configured analytics provider.
