# Nestguard

A roguelike nest defence game. You are a crow, and everything in the forest wants your eggs.

- Hold the nest against waves of enemies. Your crow shoots by itself; press **Space** (or tap the field) to caw.
- Shop between waves for random upgrades.
- Six biomes: Whispering Wood, Murkwater Marsh, Frostfang Pass, Ashen Alleys, Sunscorch Dunes and Silkshade Hollow. Each has its own enemies and a boss on wave 10.
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

Push a version tag. GitHub Actions builds the three installers and publishes them on a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

You can also run the **Nestguard installers** workflow by hand from the Actions tab to get the installers without making a release.

## Project layout

- `index.html` is the whole game: one file, no images or libraries.
- `desktop/` packages the game as a desktop app with Electron (`npm install`, then `npm start` to play or `npm run dist` to build an installer).
- `.github/workflows/nestguard-installers.yml` builds the installers.
