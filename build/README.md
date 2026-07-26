# Build resources

Place your Windows application icon here as `icon.ico` (256x256 recommended,
multi-resolution .ico). electron-builder and electron/main.js both reference
`build/icon.ico`. Without it, electron-builder will fall back to its default
Electron icon for the generated EXE.

You can generate a proper multi-size .ico from a PNG logo using a tool like
https://icoconvert.com or the `electron-icon-builder` npm package.
