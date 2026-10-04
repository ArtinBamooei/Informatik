# Informatik — Learning Path

Personal learning and skill-tracking web app.

## Features

- Skill progress tracking with four states
- Subtopic checklists
- Notes per skill
- Study timer and per-skill study time
- Streak and activity tracking
- Statistics and achievements
- Focus mode
- Themes
- Local backup/restore
- Optional GitHub Gist synchronization
- Installable PWA with offline app-shell caching
- Advanced command center with analytics and activity heatmap
- Weekly learning goals independent from three-level skill targets
- Learning roadmap and dependency graph
- Portfolio / Research / GitHub overview
- Keyboard shortcuts, JSON/CSV export-import, and PWA install helper
- Optimized animated Focus Mode with reduced-motion support

## Architecture

- `index.html` — document shell
- `css/style.css` — UI styles
- `js/app.js` — application logic
- `manifest.json` — PWA metadata
- `sw.js` — service worker
- `icon.svg` — application icon

## Data and privacy

Normal learning data is stored locally in browser `localStorage`.

GitHub synchronization uses a token entered by the user. The token is kept only in the current page session and is not written to application state or backups. A token stored by older versions is removed from persisted state on load.

Gist synchronization is manual and does not provide automatic conflict resolution between multiple devices. Pulling data replaces the current local learning state after confirmation.

## Limitations

Browser reminders are page-driven and are not guaranteed background notifications when the page is fully closed.

The application is client-side and has no private backend.

## Live Demo

https://artinbamooei.github.io/Informatik/
