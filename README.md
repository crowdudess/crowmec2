# Nestguard

A roguelike nest defence game. You are a crow, and everything in the forest wants your eggs.

- Hold the nest against waves of enemies. Your crow shoots by itself; press **Space** (or tap the field) to caw.
- Shop between waves for random upgrades.
- Ten biomes, from Whispering Wood to The Void. Each has its own enemies, a boss on wave 10, and 3 challenge runs that unlock a skin.
- Pick up to 5 spells to take into each run.
- After a boss, fly home with your coins or stay for endless waves.
- Spend coins in the Roost on permanent upgrades and placeable spells. Unlock skins and achievements.

## Play

- **In a browser:** open `index.html`.
- **Installed on your computer:** download the installer for your system from the [Releases](../../releases) page.

| System | File |
|---|---|
| Windows | `Nestguard-<version>-win-x64.exe` |
| macOS | `Nestguard-<version>-mac-universal.dmg` |
| Linux | `Nestguard-<version>-linux-x86_64.AppImage` |

The installers are not code-signed. On Windows, click **More info → Run anyway** if SmartScreen warns. On macOS, right-click the app and choose **Open** the first time.

## Make a release

GitHub Actions builds the three installers and publishes them on a release by itself whenever the game or the desktop app changes on `main`. The release is named after the `version` in `desktop/package.json` (for example `v1.0.0`):

- Change that version (to `1.0.1`, `1.1.0` and so on) to make a new release.
- Leave it the same and the existing release gets the new installers.

Pushing a tag such as `v1.2.0` also builds a release with that name. You can run the **Nestguard installers** workflow by hand from the Actions tab to get the installers without making a release.

## Project layout

- `index.html` is the whole game: one file, no images or libraries.
- `desktop/` packages the game as a desktop app with Electron (`npm install`, then `npm start` to play or `npm run dist` to build an installer).
- `.github/workflows/nestguard-installers.yml` builds the installers.
