# Maintainer guide: 1:1 paid training

The portal has a **1:1 training** page (`?page=coaching`). It explains the offer and sends visitors to an external scheduling page where they pick a time and pay. This guide shows how to turn booking on.

**Time:** about 30 minutes, plus any payment-account verification by your provider.

## How it works

- The portal is a static site. It has **no server, no database, and no payment code**.
- Booking, calendar invitations, reminders, payment, refunds, and receipts are all handled by a scheduling provider you choose. Card details never touch this site.
- The portal reads three **public** build-time settings. If the booking URL is missing or invalid, the page safely shows **"Online booking is not open yet"** with a LinkedIn contact link.

| Setting | Example | Purpose |
| --- | --- | --- |
| `VITE_COACHING_BOOKING_URL` | `https://cal.com/your-name/vibe-coding-1-1` | Public `https://` booking link. Required to open booking. |
| `VITE_COACHING_PRICE` | `$49 USD` | Display-only label, 40 characters max. Leave empty to show "The price is shown before you pay." |
| `VITE_COACHING_DURATION_MINUTES` | `60` | Session length shown on the page (15–240). Defaults to 60. |

> ⚠️ Everything prefixed with `VITE_` is embedded in the browser bundle and visible to anyone. Never put API keys, Stripe secret keys, or tokens in these settings.

## Step 1: Create a paid event with a scheduling provider

Pick one provider that can **connect your calendar** and **collect payment at booking**. Two common options:

- **Cal.com:** create an event type, install the **Stripe** app, and set a price on the event. At the time of writing, paid events are available on the free individual plan; Stripe's processing fees still apply.
- **Calendly:** create an event type and connect **Stripe** or **PayPal** under payment settings. At the time of writing, payment collection requires a paid Calendly plan (Standard or higher).

Check the provider's current pricing and terms before you choose. Whichever you use:

1. Connect the calendar you actually use (for example, Outlook/Microsoft 365 or Google) so booked slots block your time.
2. Set the duration to match `VITE_COACHING_DURATION_MINUTES`.
3. Add a video-meeting location (for example, Microsoft Teams, Zoom, or Google Meet) so the invite includes a link.
4. Set the price to match `VITE_COACHING_PRICE`.
5. Write your **cancellation, rescheduling, and refund policy** in the event description. The portal tells visitors to read those terms on the booking page before paying.
6. Add intake questions such as "What would you like to work on?" and "Windows or Mac?". Do not ask for passwords or sensitive personal data.
7. Add buffer time between sessions and a minimum notice period.

**Expected:** you have a public booking link. Open it in a private browser window and confirm it shows the right price, duration, time zone, and policy.

## Step 2: Try it locally

1. Copy `.env.example` to `.env.local` in the portal folder (this file is ignored by Git).
2. Fill in the three values.
3. Run `npm run dev` and open the printed URL with `?page=coaching` added.
4. **Expected:** the page shows your price and duration, and **Choose a time and pay** opens your booking link in a new tab.

## Step 3: Turn it on for the live site

The Azure Static Web Apps workflow passes three GitHub **repository variables** into the build.

1. In GitHub, open the repository's **Settings → Secrets and variables → Actions → Variables** tab.
2. Create `COACHING_BOOKING_URL`, `COACHING_PRICE`, and (optional) `COACHING_DURATION_MINUTES`. Use **Variables**, not Secrets: these values are public anyway.
3. Re-run the latest **Azure Static Web Apps CI/CD** workflow on `main`, or push a new commit.
4. **Expected:** the live `?page=coaching` page shows your price and a working booking button.

To pause bookings, delete `COACHING_BOOKING_URL` (or pause the event in your provider) and redeploy.

## Before you take the first payment

- ✅ Book a test session yourself end to end, including the confirmation email, calendar invite, and a refund.
- ✅ Confirm the invite includes the video link and your time zone is correct.
- ✅ Decide how you will handle no-shows and late cancellations, and state it on the booking page.
- ✅ Check your tax, invoicing, and business-registration obligations for where you and your clients live. This guide is not legal or tax advice.
- ✅ If your employer has outside-work or conflict-of-interest rules, confirm paid training is allowed.

## Common issues

| Problem | Fix |
| --- | --- |
| Page still says "Online booking is not open yet" | The URL is missing, not `https://`, or contains a username/password. Check the variable name and redeploy; values are read at build time, not at page load. |
| Price shows the default text | `COACHING_PRICE` is empty or longer than 40 characters. |
| Price on the portal differs from checkout | The provider is authoritative. Update the repository variable to match and redeploy. |
| Local change not visible | Stop and restart `npm run dev` after editing `.env.local`. |

**Next:** review the page copy in `src/components/CoachingPage.tsx` if you change what sessions include.
