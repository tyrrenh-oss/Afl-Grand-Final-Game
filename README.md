# Froffies at Dondads — AFL 2026 Grand Final Game

GitHub Pages-ready static web game.

## Pages
1. Home / six-player setup
2. Norm Smith — 3 points
3. Most Goals — 2 points
4. Winning Team + margin — winner 2 points, margin 1 point
5. Quarter 1 — first goal, last goal, most disposals (1 point each)
6. Quarter 2
7. Quarter 3
8. Quarter 4
9. Outcomes + every participant's selections
10. Final leaderboard

Every game page has a running leaderboard.

## Upload
Upload `index.html`, `app.js`, `styles.css`, `manifest.json`, `sw.js`, and this README to the root of your GitHub repository. Enable GitHub Pages from the repository's Pages settings.

## Notes
- Game state is saved in the browser using localStorage.
- Draft order is randomized separately for Norm Smith, Most Goals, Winning Team, and each quarter.
- Picks are unique within each category.
- The Outcomes page is used to enter the actual results after/during the Grand Final.
- The player list is in `app.js` and can be edited if the final teams change.
