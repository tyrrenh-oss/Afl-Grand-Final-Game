# AFL 2026 Grand Final Game

A polished, mobile-friendly AFL Grand Final prediction/draft game for six participants.

## Included
- Six participant name setup
- Randomised draft order
- Quarter 1–4 pages
- Separate unique drafts for first goal, last goal and most disposals
- Grand Final predictions: winner, margin bracket, Norm Smith and most goals
- Winner can be shared; Norm Smith and most-goals picks are locked to one participant each
- Live running leaderboard on every page
- Actual quarter-by-quarter data entry
- Automatic scoring
- Final leaderboard with 🥇 🥈 🥉
- Local browser saving with `localStorage`
- PWA manifest + service worker for install/offline caching
- Export current game data as JSON
- Print/save final leaderboard as PDF

## Scoring
- First goal each quarter: 1
- Last goal each quarter: 1
- Most disposals each quarter: 1
- Grand Final winner: 2
- Margin bracket: 1
- Norm Smith: 3
- Most goals: 2

## GitHub Pages
Upload all files to the root of a repository. GitHub Pages looks for `index.html` at the top level of the publishing source. Then enable Pages under the repository's Pages settings.

The 2026 Grand Final is Fremantle v Brisbane at the MCG, Saturday 26 September at 2:30pm AEST. Player list is based on the announced Grand Final teams available on 24 September 2026; update `PLAYERS` in `app.js` if a late change occurs.

This is a static site: no server or database is required. Each browser stores its own game state.
