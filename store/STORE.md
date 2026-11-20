# Nestguard store page kit

Everything needed to fill in a Steam or itch.io page. The images in this folder are made from the game itself.

## Name

**Nestguard**

## Short description (Steam allows 300 characters)

You are a crow, and everything wants your eggs. Hold the nest for 30 waves, crack the magpie's eggs for wild items, cast spells and face 12 bosses, each with its own tricks. A roguelike nest defence with 13 biomes, 105 items and an endless Chaos Rift.

## Long description

You are a crow. Your nest is in the middle of the map, and everything in the forest wants your eggs.

Beetles, snakes, raccoons, frogs, spiders, bats and much worse come from every side. Your crow fires feathers at anything that gets close. Caw to scare them off, cast spells, and hold on for 30 waves until the boss of the biome shows up.

**Crack the magpie's eggs.** After every wave the magpie leaves three eggs in your nest. Pick one and watch it roll, from Common all the way to Mythic. The other two crack open too, so you can see what you missed. Bosses drop golden eggs with much better odds.

**Build something broken.** 105 items stack together in strange ways. Bouncing feathers, a sun that sets everything on fire, magpies that fight for you, a nest that bites back. No two runs end with the same build.

**12 bosses with their own tricks.** A Frost Bear that freezes your crow in ice. A Maw that splits in two. A Magma Dragon that takes flight and rains fireballs. An Oni whose shockwave breaks your spells. Learn them, or lose your eggs.

**13 biomes.** From Whispering Wood to The Void, each with its own monsters, weather and music, played live by the game.

**Grow between runs.** Spend your coins on permanent upgrades, unlock 26 spells, 29 crow skins with their own passives, and challenges that unlock Legendary and Mythic items.

**The Chaos Rift.** An endless mode that mixes two biomes every round, with mini bosses and 10 chaos levels. How far can you go?

### Features

- 13 biomes and 12 bosses, plus mini bosses on waves 10 and 20
- 105 items across six rarities, hatched from eggs
- 26 spells, five slots per run
- 29 crow skins, each with its own passive, feathers, nest and caw
- Endless Chaos Rift with 10 chaos levels
- Three save slots, run history and stats
- Keyboard and mouse, touch, or controller
- Rebindable keys, rarity letters for colour-blind players, a low effects mode
- English, French, Spanish and German

## Tags (Steam)

Roguelike, Roguelite, Tower Defense, Action Roguelike, Bullet Hell, Arena Shooter, Casual, 2D, Cute, Indie, Singleplayer, Replay Value, Difficult, Top-Down

## Genre

Action, Indie, Casual, Strategy

## System requirements

| | Minimum | Recommended |
|---|---|---|
| OS | Windows 10 (64-bit), or a recent 64-bit Linux | Windows 10 or 11 (64-bit) |
| Processor | Dual core, 2 GHz | Quad core |
| Memory | 2 GB RAM | 4 GB RAM |
| Graphics | Any GPU with up-to-date drivers | Any GPU with up-to-date drivers |
| Storage | 300 MB | 300 MB |

## Images in this folder

| File | Use |
|---|---|
| `steam-header-920x430.png` | Steam header capsule |
| `steam-small-capsule-462x174.png` | Steam small capsule |
| `steam-main-capsule-1232x706.png` | Steam main capsule |
| `steam-vertical-capsule-748x896.png` | Steam vertical capsule |
| `steam-library-capsule-600x900.png` | Steam library capsule |
| `steam-library-hero-3840x1240.png` | Steam library hero (no text, as Steam asks) |
| `itch-cover-630x500.png` | itch.io cover image |

Screenshots (1280x720) are in `media/screenshots/`. The trailer is `media/trailer.mp4`.

Steam also wants a library logo, a transparent PNG of the title only. The title font is Grenze Gotisch (free on Google Fonts) in gold `#f4cf6a`.

## itch.io setup

1. Create a project, kind of project: **HTML**.
2. Upload a zip with the game's `index.html` inside, and tick **This file will be played in the browser**.
3. Viewport: 1280 x 720, tick **Mobile friendly** and **Fullscreen button**.
4. Also upload the Windows `.exe` and Linux `.AppImage` from the latest GitHub release as downloads.
5. Cover image: `itch-cover-630x500.png`. Add the screenshots and the trailer.
6. Pricing: free, or "No payments" / "Pay what you want", your choice.

## Steam setup (things only you can do)

1. Sign up on Steamworks and pay the app fee (100 USD per game, paid back after 1,000 USD in sales).
2. Fill in the tax and bank forms.
3. Create the store page with the text and images above, then the content survey (age rating).
4. Upload the build: the Windows installer is made by the "Nestguard installers" workflow on every version bump.
5. Steam needs the page to be live as "Coming soon" for at least 2 weeks before launch, and a review of both the page and the build.
6. Unsigned Windows builds show a SmartScreen warning outside Steam. Steam builds don't need code signing.
