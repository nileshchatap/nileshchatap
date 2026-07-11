## Scope

Extend the existing admin panel with CRUD for six new areas and send an email to the admin whenever a contact form is submitted.

## 1. Database migration

New tables (all with admin-only write policies via `is_admin(email)`, public read where relevant):

- `site_achievements` — title, description, date, icon, sort_order
- `site_services` — title, description, icon, price (nullable), sort_order
- `site_gallery` — title, image_url, caption, sort_order
- `site_testimonials` — author_name, role, company, quote, avatar_url, sort_order
- `site_seo` — single-row: meta_title, meta_description, og_image_url, keywords
- `site_settings` — single-row: site_name, favicon_url, primary_color, accent_color

Each table gets: GRANTs (anon SELECT + authenticated ALL + service_role ALL), RLS enabled, admin-write policies mirroring the existing `site_*` pattern.

New storage bucket: `gallery` (public).

## 2. Email notification on contact submission

- Edge function `notify-contact` sends an email to the admin (nileshchatap25@gmail.com) via Lovable's built-in email (Resend gateway through `LOVABLE_API_KEY`) with the submitter's name, email, phone, and message.
- `ContactForm.tsx` invokes the function after a successful insert into `submissions`.

## 3. Admin dashboard UI

Add new tabs to `AdminDashboard.tsx`: Achievements, Services, Gallery, Testimonials, SEO, Settings. Each reuses the existing card + dnd-kit sortable pattern already used for Experiences/Projects/etc. Gallery upload uses the new bucket. SEO + Settings are single-row edit forms.

## 4. Public rendering

Skipped per your answer — data management only.

## Technical notes

- Storage: reuse pattern from `certificates`/`profile-photos` buckets.
- Email: use the Resend connector path via `LOVABLE_API_KEY` (built-in, no user setup); sender `onboarding@resend.dev`. This only delivers to the account owner's verified email — matches "notify the admin" use case.
- No changes to public portfolio sections.

Confirm and I'll implement.