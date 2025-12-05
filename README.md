# Mini Quote Saver

Mini Quote Saver is a small web app that lets you capture, edit, and manage your favorite quotes in the browser using `localStorage`. It showcases core DOM manipulation, event delegation, and persistence without any backend.

## Problem Statement
- Provide a simple, offline-friendly quote notebook that persists between refreshes.
- Allow basic CRUD (create, read, update, delete) operations on quotes with an intuitive UI.
- Keep the implementation lightweight: plain HTML, CSS, and JavaScript only.

## What I Built
- A single-page app that stores quotes in `localStorage` as a JSON array.
- Dynamic rendering of the quote list with edit and delete controls.
- Inline edit flow that reuses the add form (button switches to “Update Quote”).
- Clear-all action with confirmation to wipe saved data.
- Empty-state and count indicator for better UX.
- Responsive, modern styling (no framework) with minimal animations.

## Tech & Concepts Used
- **HTML**: semantic structure for header, input section, stats, and list.
- **CSS**: custom layout, responsive tweaks, gradients, and light shadows; no external UI framework.
- **JavaScript (vanilla)**:
	- DOM selectors: `getElementById`, `querySelector`, `querySelectorAll` (with notes on HTMLCollection/NodeList).
	- Element creation & mutation: `createElement`, `append`, `appendChild`, `classList`, `setAttribute`, `dataset`.
	- Events: `addEventListener` for `click`, `input`, `keypress`; `preventDefault`, `stopPropagation`.
	- Event delegation: single listener on the list uses `event.target.closest` to route edit/delete.
	- Event propagation: bubbling demo via container listener (capturing noted in comments).
	- Local storage: `setItem`, `getItem`, `removeItem`, `clear` with JSON serialization.

## How It Works
1. On load, quotes are loaded from `localStorage` (or start as an empty array).
2. `renderQuotes()` builds the list each time data changes and toggles the empty-state and clear-all visibility.
3. Adding or updating uses the same form; when editing, the button label and style change to “Update Quote”.
4. List actions are handled by event delegation on the `<ul>` so newly added items need no extra listeners.
5. All mutations persist immediately to `localStorage` to survive refreshes.

## Running the App
1. **Live (GitHub Pages):** https://swapnilpatil28.github.io/Mini-Quote-Saver/
2. **Local:** Clone or download the repo, then open `index.html` in any modern browser (no build or server needed).

## Project Structure
- `index.html` — markup and layout
- `style.css` — styling and responsive rules
- `script.js` — app logic (DOM, events, localStorage)

## Notes & Decisions
- Kept dependencies at zero for simplicity and portability.
- Used alerts/confirms for quick feedback; no external notification library.
- Event delegation keeps the code lean even as the list grows dynamically.

## Possible Enhancements
- Add search/filter for quotes.
- Support tags or authors and sort/group.
- Export/import quotes (JSON file) for backup.

