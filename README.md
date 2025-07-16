# Bollywood Mood Music Player

A modern web app that detects your mood using your webcam and plays Bollywood songs tailored to your emotions! Built with React, face-api.js, and Deezer API.

## Features

- **Live Mood Detection:** Uses your webcam and face-api.js to detect your facial expression.
- **Bollywood Song Suggestions:** Fetches Bollywood tracks matching your mood from Deezer.
- **Random Song Playback:** Plays a random song from the top suggestions.
- **Recommended Tracks List:** Shows multiple suggestions with album art and play buttons.
- **Full Song Playback (with Deezer):** Uses the official Deezer widget for full playback (requires Deezer login).
- **Modern UI:** Clean, responsive, and interactive design with Tailwind CSS.

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **First-time CORS setup:**
   - Visit [cors-anywhere](https://cors-anywhere.herokuapp.com/) and click "Request temporary access" to enable Deezer API requests.

## Usage

- Click **Start Listening** to detect your mood and get Bollywood song suggestions.
- Click the play button next to any track to play it in the Deezer widget.
- For full song playback, log in to your Deezer account in the widget.

## Limitations

- **Deezer API only provides 30-second previews** via the `preview` link.
- **Full song playback** is only available through the Deezer widget and requires user login (and sometimes a Deezer Premium subscription).
- Song availability may vary by region.

## Credits

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for face detection and mood analysis.
- [Deezer API](https://developers.deezer.com/api) for music data and playback.
- [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/) for the frontend.

---

**Enjoy mood-based Bollywood music!**
