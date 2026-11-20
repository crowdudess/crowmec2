// Runs after "cap add android": sets the app version from package.json,
// signs release builds with nestguard.keystore (the same key every time, so updates keep your save),
// and keeps the screen awake-friendly full screen layout.
const fs = require('fs');
const path = require('path');
const v = require('./package.json').version;
const [a, b, c] = v.split('.').map(Number);
const code = a * 10000 + b * 100 + c;
const gradle = path.join(__dirname, 'android', 'app', 'build.gradle');
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode \d+/, 'versionCode ' + code).replace(/versionName "[^"]*"/, 'versionName "' + v + '"');
if (!g.includes('nestguardRelease')) {
  g = g.replace(/buildTypes \{/, `signingConfigs {
        nestguardRelease {
            storeFile file("../../nestguard.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
    buildTypes {`);
  g = g.replace(/release \{/, 'release {\n            signingConfig signingConfigs.nestguardRelease');
}
fs.writeFileSync(gradle, g);
const man = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
let m = fs.readFileSync(man, 'utf8');
if (!m.includes('android:screenOrientation')) m = m.replace('<activity', '<activity\n            android:screenOrientation="fullUser"');
fs.writeFileSync(man, m);
console.log('Android project set to version', v, '(code ' + code + ')');
