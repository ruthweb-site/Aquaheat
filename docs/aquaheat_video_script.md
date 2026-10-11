# AquaHeat — 3-Minute Demo Video Script

> **Format:** Live screen recording of the running app + voiceover
> **Runtime:** 3:00 min
> **Tone:** Clear, calm, purposeful — not salesy
> **What to show:** The actual working frontend. No slides, no IDE, no AWS console.

---

## PRE-SHOOT SETUP

- [ ] Open AquaHeat frontend in Chrome — full screen, browser chrome hidden (F11)
- [ ] Set browser zoom to **90%** so all sections are visible without scrolling awkwardly
- [ ] Make sure the app is showing **live data** — confirm zone cards are loading real temperatures
- [ ] Hide browser bookmarks bar
- [ ] Turn on Do Not Disturb — no notification popups
- [ ] Test microphone levels
- [ ] Record at **1920×1080**

---

## SEGMENT 1 — THE HOOK (0:00 – 0:20) · *20 seconds*

**🖥️ ON SCREEN**
Static shot of the AquaHeat homepage — the six zone cards visible in the hero section, risk badges showing their live colours.
Don't move the mouse. Let the live data speak.

---

**🎙️ NARRATION — speak slowly**

> "Mumbai. Peak summer. Millions of people outside — delivery workers, construction crews, schoolchildren.
>
> Most of them have no idea how dangerous the heat is in their part of the city right now.
>
> This is AquaHeat."

---

## SEGMENT 2 — THE ZONE DASHBOARD (0:20 – 0:55) · *35 seconds*

**🖥️ ON SCREEN — do these actions as you speak**

1. Slowly move cursor to the **first zone card** — South Mumbai / Colaba
2. Hover to show the card highlight state
3. Point to the **risk badge** — "SAFE" or "LOW" — whichever is live
4. Move to **Ghatkopar (Eastern Suburbs)** — point to the higher risk badge (usually warmer inland)
5. Hover over the **temperature row** — point to the apparent temperature vs the actual temperature difference
6. Slowly scroll down to reveal the **24-hour forecast timeline** on one zone card

---

**🎙️ NARRATION**

> "The dashboard shows six Mumbai zones in real time — South Mumbai, Andheri, Ghatkopar, Dadar, Chembur, and Borivali.
>
> Each zone is pulling live weather data right now — temperature, feels-like temperature, humidity, wind speed.
>
> Notice Ghatkopar is already at a higher risk level than Colaba. Same city, same afternoon — but Ghatkopar is inland, more concrete, more heat trapped. That difference matters.
>
> And each zone shows a 24-hour forecast — so you can see not just how bad it is now, but when it peaks and when it eases."

---

## SEGMENT 3 — PERSONAL EXPOSURE (0:55 – 1:40) · *45 seconds*

**🖥️ ON SCREEN — do these actions as you speak**

1. Scroll down smoothly to the **Personal Exposure section**
2. The section heading: *"What are you doing today?"*
3. Click **"Outdoor Work"** card — delivery partners, construction, field staff
4. Pause 1 second — let the guidance panel animate in
5. Point to the **"Suggested Fluids"** badge — e.g. "800–1000 ml / hour"
6. Point to the **"Pacing Advice"** badge
7. Read the tips text on screen briefly
8. Now click **"Exercise"** — let it switch
9. Show the different hydration number, different tips
10. Click **"Walking"** — show it again switching

---

**🎙️ NARRATION**

> "AquaHeat doesn't just tell you the temperature. It tells you what to *do* with that information.
>
> Select your activity — and the app gives you a personalised plan for today's conditions.
>
> If you're doing outdoor labour — a delivery partner, a construction worker, anyone on-site — you're looking at up to a litre of fluids per hour, mandatory shaded rest breaks every 45 minutes, and specific times of day to avoid heavy continuous exertion.
>
> Switch to exercise and the guidance changes — earlier morning timing, different hydration targets, indoor alternatives flagged.
>
> Switch to walking and it adjusts again.
>
> Six activities. Each one calibrated to today's zone conditions. Not generic advice — specific numbers for today."

---

## SEGMENT 4 — EMERGENCY SECTION (1:40 – 2:15) · *35 seconds*

**🖥️ ON SCREEN — do these actions as you speak**

1. Continue scrolling to the **Emergency Section**
2. The section header: *"Need help right now?"*
3. Point to the **108 Maharashtra Ambulance** call-to-action at the top
4. Move cursor slowly to the **Heat Exhaustion card** — hover
5. Move to the **Heat Stroke card** — let the "Call 108 Immediately" pulse badge be visible
6. Scroll down slightly to reveal the **four emergency helpline cards** — 108, 1916, 100, 101
7. Hover over the **"Call 108" button** on the ambulance card

---

**🎙️ NARRATION**

> "And this is the section that matters most.
>
> If someone near you is struggling — AquaHeat shows you exactly what to look for and exactly what to do.
>
> Heat Exhaustion — heavy sweating, dizziness, weakness — move them to shade, cool water, rest.
>
> Heat Stroke — confusion, hot dry skin, seizures — that is a medical emergency. Call 108 without delay.
>
> Every Mumbai emergency helpline is here — ambulance, civic disaster management, police, fire brigade — all with one-tap dial. You don't need to remember a number.
>
> This guidance is not AI-generated. It is written, reviewed, and fixed. It will not hallucinate under pressure."

---

## SEGMENT 5 — CLOSE (2:15 – 3:00) · *45 seconds*

**🖥️ ON SCREEN — do these actions as you speak**

1. Slowly scroll back up to the **top of the page** — the full hero with zone cards visible
2. At *"built on AWS"* line — pause on the zone dashboard
3. At the end — let the page sit static on the full zone dashboard view

---

**🎙️ NARRATION**

> "Everything you just saw is running live.
>
> The weather data is real — fetched from Open-Meteo every few minutes for each Mumbai zone by a scheduled AWS Lambda function. Stored in DynamoDB. Served through API Gateway. No cached dummy data.
>
> The entire platform is serverless on AWS — it costs nothing at midnight when no one is using it, and it handles a city-wide heat alert surge without any manual intervention.
>
> What's coming next: a machine learning model trained on historical Mumbai weather data to predict heat risk scores hours in advance — not just what the heat is right now, but where it's heading.
>
> AquaHeat is for the delivery partner doing ten runs in peak summer. The construction worker on exposed concrete at 2 PM. The student walking home with no shade.
>
> The heat in Mumbai is not equally dangerous everywhere. Now you can know exactly how dangerous it is — in your zone, for your activity, right now."

---

*[Optional: fade to black with the AquaHeat wordmark and tagline]*
> **AquaHeat — Mumbai Heat Safety Platform**

---

## TIMING SUMMARY

| Segment | Time | Length |
|---|---|---|
| Hook | 0:00 – 0:20 | 20 sec |
| Zone Dashboard | 0:20 – 0:55 | 35 sec |
| Personal Exposure | 0:55 – 1:40 | 45 sec |
| Emergency Section | 1:40 – 2:15 | 35 sec |
| Close | 2:15 – 3:00 | 45 sec |
| **Total** | | **~3:00** |

---

## RECORDING TIPS

| | |
|---|---|
| **Mouse** | Move slowly and deliberately — fast mouse movement is hard to follow on video |
| **Scroll** | Use smooth scroll (trackpad two-finger swipe) — not the scroll bar |
| **Pauses** | Pause 0.5 sec before clicking anything — gives viewers time to see what you're about to do |
| **Re-takes** | Record each segment in one take, then splice — it's easier than one long 3-min take |
| **Narration** | Record narration in a separate pass after the screen recording — sync in editing |
| **Music** | Optional ambient background at very low volume — something calm, no lyrics |
| **Captions** | Auto-caption in Descript or CapCut for accessibility |
