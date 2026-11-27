// Runs after "cap add android": sets the app version from package.json,
// signs release builds with the secret Nestguard key (the same key every time, so updates keep your save),
// and keeps the screen awake-friendly full screen layout.
const fs = require('fs');
const path = require('path');
const v = require('./package.json').version;
const [a, b, c] = v.split('.').map(Number);
const code = a * 10000 + b * 100 + c;
const gradle = path.join(__dirname, 'android', 'app', 'build.gradle');
let g = fs.readFileSync(gradle, 'utf8');
g = g.replace(/versionCode \d+/, 'versionCode ' + code).replace(/versionName "[^"]*"/, 'versionName "' + v + '"');
// The signing key is never in the repo. Release builds read it from these environment variables
// (GitHub Actions fills them from the repository's secrets):
//   NESTGUARD_KEYSTORE           path to the .keystore file
//   NESTGUARD_KEYSTORE_PASSWORD  NESTGUARD_KEY_ALIAS  NESTGUARD_KEY_PASSWORD
// Without NESTGUARD_KEYSTORE the release APK is built unsigned.
if (!process.env.NESTGUARD_KEYSTORE) console.warn('NESTGUARD_KEYSTORE is not set: the release APK will be unsigned.');
else if (!g.includes('nestguardRelease')) {
  g = g.replace(/buildTypes \{/, `signingConfigs {
        nestguardRelease {
            storeFile file(System.getenv("NESTGUARD_KEYSTORE"))
            storePassword System.getenv("NESTGUARD_KEYSTORE_PASSWORD")
            keyAlias System.getenv("NESTGUARD_KEY_ALIAS")
            keyPassword System.getenv("NESTGUARD_KEY_PASSWORD")
        }
    }
    buildTypes {`);
  g = g.replace(/release \{/, 'release {\n            signingConfig signingConfigs.nestguardRelease');
}
fs.writeFileSync(gradle, g);
const man = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
let m = fs.readFileSync(man, 'utf8');
if (!m.includes('android:screenOrientation')) m = m.replace('<activity', '<activity\n            android:screenOrientation="sensorLandscape"');
fs.writeFileSync(man, m);
// Keep the screen on while the game is open, so the phone doesn't dim and sleep mid-run.
const act = path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'com', 'crowdude', 'nestguard', 'MainActivity.java');
fs.writeFileSync(act, `package com.crowdude.nestguard;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
`);
console.log('Android project set to version', v, '(code ' + code + ')');
