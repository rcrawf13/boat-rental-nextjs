# Supabase + Vercel (booking)

## Database

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/20260321120000_bookings.sql` (SQL Editor or CLI).
3. Add Row Level Security policies when you know your auth model (or insert only from Next.js using the **service role** key in a Route Handler).

## Environment variables (Vercel)

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client (limited by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — Route Handlers / server actions |

Never commit the service role key. In Vercel, add it under Project → Settings → Environment Variables (Production / Preview).

## Next steps

- Implement `submitBookingToSupabase` in `src/lib/bookingSubmit.placeholder.ts` (or replace with a server module).
- From `/booking/checkout`, call your API after creating a Stripe session or before, depending on your flow.

## Stripe (later)

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` (server)
- Webhook signing secret for `checkout.session.completed`

See comments in `src/app/booking/checkout/CheckoutPlaceholderClient.tsx`.
