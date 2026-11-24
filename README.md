# Nestguard

A roguelike nest defence game by crowdude. You are a crow, and everything in the forest wants your eggs.

<p align="center">
  <a href="https://github.com/crowdudess/crowmec2/releases/latest"><img alt="Download for Windows" src="https://img.shields.io/badge/Download-Windows-e8b84a?style=for-the-badge&logo=windows&logoColor=1a1408&labelColor=e8b84a&color=1d261b"></a>
  <a href="https://github.com/crowdudess/crowmec2/releases/latest"><img alt="Download for Linux" src="https://img.shields.io/badge/Download-Linux-e8b84a?style=for-the-badge&logo=linux&logoColor=1a1408&labelColor=e8b84a&color=1d261b"></a>
  <a href="https://crowdudess.github.io/crowmec2/play/"><img alt="Play in your browser" src="https://img.shields.io/badge/Play-in%20your%20browser-9fd0a8?style=for-the-badge&labelColor=9fd0a8&color=1d261b"></a>
</p>

<p align="center"><b><a href="https://crowdudess.github.io/crowmec2/">Visit the Nestguard website</a></b></p>

![Nestguard trailer](media/trailer.gif)

▶ **[Watch the trailer in full quality (MP4)](media/trailer.mp4)**

## What's in the game

- Hold the nest against waves of monsters. Your crow shoots by itself; press **Space** (or tap the field) to caw.
- Shop between waves for random upgrades: common, rare, epic and wild **mythic** ones like the Thunder Crown and Raven Legion.
- 13 worlds, from Whispering Wood to The Void, plus a secret DLC office. Each has its own monsters, scenery, weather and a boss on wave 30, with mini bosses on waves 10 and 20 and 3 challenge runs per world.
- The **Chaos Rift**: an endless mode with monsters and bosses from every biome, and 10 chaos levels you buy with coins.
- Pick up to 5 spells to take into each run. Every crow skin has its own passive, projectile, nest and caw.
- Spend coins on permanent upgrades in the Upgrades tab. Fill the monster and item index, and unlock skins and achievements.
- Plays in English, French, Spanish and German.

## Screenshots

| | |
|---|---|
| ![Silkshade Hollow](media/screenshots/world-spider.jpg) | ![Glimmer Glade](media/screenshots/world-fairy.jpg) |
| ![Sunscorch Dunes](media/screenshots/world-dunes.jpg) | ![The Void](media/screenshots/world-void.jpg) |
| ![Banana Jungle](media/screenshots/world-jungle.jpg) | ![Murkwater Marsh](media/screenshots/world-marsh.jpg) |
| ![The Frost Bear](media/screenshots/boss-snow.jpg) | ![The Magma Dragon](media/screenshots/boss-volcano.jpg) |
| ![The Chaos Rift](media/screenshots/chaos-rift.jpg) | ![Choosing a biome](media/screenshots/01-menu.png) |

## Play

- **In a browser:** open `index.html`.
- **Installed on your computer:** download the installer for your system from the [Releases](../../releases) page.

| System | File |
|---|---|
| Windows | `Nestguard-<version>-win-x64.exe` |
| Linux | `Nestguard-<version>-linux-x86_64.AppImage` |

The installers are not code-signed. On Windows, click **More info → Run anyway** if SmartScreen warns. On Mac, play in your browser.

## Make a release

GitHub Actions builds the three installers and publishes them on a release by itself whenever the game or the desktop app changes on `main`. The release is named after the `version` in `desktop/package.json` (for example `v1.0.0`):

- Change that version (to `1.0.1`, `1.1.0` and so on) to make a new release.
- Leave it the same and the existing release gets the new installers.

Pushing a tag such as `v1.2.0` also builds a release with that name. You can run the **Nestguard installers** workflow by hand from the Actions tab to get the installers without making a release.

## Project layout

- `index.html` is the whole game: one file, no images or libraries.
- `media/` holds the trailer and screenshots.
- `site/` is the download website. `.github/workflows/website.yml` publishes it with GitHub Pages, together with a playable copy of the game at `/play/`. Turn it on once in **Settings → Pages → Source: GitHub Actions**.
- `desktop/` packages the game as a desktop app with Electron (`npm install`, then `npm start` to play or `npm run dist` to build an installer).
- `.github/workflows/nestguard-installers.yml` builds the installers.
