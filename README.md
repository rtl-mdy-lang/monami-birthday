# Monami's Rose Garden — Birthday Website

A mobile-first 19th birthday surprise made with plain HTML, CSS, and JavaScript.

## Run locally
1. Extract `monami-birthday.zip`.
2. Open the folder.
3. Double-click `index.html`, or run a local server from this directory:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser.

## Customize
- Birthday date and wording: `index.html`
- Crush-friendly birthday letter: `letterText` in `script.js`
- Colors, layout, and animation: `style.css`
- Optional music: put a licensed/permissioned audio file named `music.mp3` in the folder, then change the audio element in `index.html` to `<audio id="birthdayAudio" src="music.mp3" loop preload="none"></audio>`.
- Photos are not required; this design uses a CSS rose-garden illustration, so it has no broken image placeholders.

## Free deployment with GitHub Pages
1. Create a GitHub repository, e.g. `monami-birthday`.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for the Pages URL to appear. Open it on your phone and share the link.

## Free deployment with Netlify
1. Visit https://app.netlify.com/drop
2. Sign in if asked.
3. Drag the extracted project folder onto the page.
4. Netlify will provide a public website URL.

Note: Google Fonts are optional external resources; system fallbacks are included. Background music intentionally does not autoplay.
