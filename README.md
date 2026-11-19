<center>

![obsidian-export-image](https://socialify.git.ci/mistn/obsidian-export-image/image?custom_description=Easily+convert+your+article+to+image&description=1&font=KoHo&language=1&logo=https%3A%2F%2Fobsidian.md%2Fimages%2Fobsidian-logo-gradient.svg&name=1&owner=1&pattern=Charlie+Brown&stargazers=1&theme=Auto)

</center>

# Export Image (Fork)

![GitHub Release](https://img.shields.io/github/v/release/mistn/obsidian-export-image?include_prereleases&style=flat) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/mistn/obsidian-export-image/total?style=flat)

> **Maintenance fork.** The original [Export Image plugin](https://github.com/zhouhua/obsidian-export-image) by [Zhou Hua](https://github.com/zhouhua) has not been updated since April 2025. This fork keeps it compatible with current Obsidian versions, fixes long-standing bugs, and adds a few export options. All credit for the original plugin belongs to Zhou Hua. This fork is maintained by [miuarc](https://github.com/mistn).

This Obsidian plugin can easily help you export any article as an image.

## Features

- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Camera.png" alt="Camera" width="25" height="25" /> Export any article as an image, with the option to save it as a local image file or copy it to the clipboard.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked%20with%20Pen.png" alt="Locked with Pen" width="25" height="25" /> Support adding watermarks, both text and image watermarks, to protect your copyrights.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Identification%20Card.png" alt="Identification Card" width="25" height="25" /> Support adding author information (avatar, name, etc.) for easier sharing and dissemination.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mobile%20Phone.png" alt="Mobile Phone" width="25" height="25" /> Support outputting images at 1x, 2x, 3x or 4x resolution for clearer display on high PPI devices like smartphones.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Straight%20Ruler.png" alt="Straight Ruler" width="25" height="25" /> Support adjusting the image width and padding to cater to different scenarios, such as exporting images suitable for viewing on mobile devices or ensuring readability when embedding images in articles.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Level%20Slider.png" alt="Level Slider" width="25" height="25" /> Offer flexible configuration options with a convenient WYSIWYG (What You See Is What You Get) interface.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bookmark%20Tabs.png" alt="Bookmark Tabs" width="25" height="25" /> Support exporting selected content as an image.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Card%20Index%20Dividers.png" alt="Card Index Dividers" width="25" height="25" /> Support for batch exporting all notes in a folder as images.
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Receipt.png" alt="Receipt" width="25" height="25" /> Support displaying obsidian [metadata](https://help.obsidian.md/Editing+and+formatting/Properties).
- <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Yo-Yo.png" alt="Yo-Yo" width="25" height="25" /> Support split long articles into multiple images.
- Choose the output format (PNG, transparent PNG, JPG, WEBP or PDF) directly in the export preview.
- Customize the author avatar size, author name font size and author area spacing.
- Optionally override the body font size without changing the theme.

## Changes in this fork

Since the last upstream release (2.4.4):

- New: choose the output format in the export preview.
- New: author avatar size, author name font size and author area top padding settings.
- New: optional body font size override.
- Fix: file-menu and selection exports use the requested content instead of the active editor.
- Fix: reading-mode exports no longer produce empty images.
- Fix: folder exports keep theme styles, custom CSS snippets, title, padding, watermark and author info.
- Fix: embedded notes no longer keep scrollbars, and long code blocks are no longer clipped.
- Fix: callout icons, async code blocks and checked task list items are exported correctly.
- Fix: copy capability checks no longer leave the Copy button disabled, and failed image requests no longer hang the export.
- Fix: single-page PDF export uses the correct JPEG encoding.
- Fix: `split mode = none` no longer splits folder exports.
- Changed: updated jsPDF, lodash, jszip, esbuild and React; production dependency audit is clean.
- Changed: lint configuration is aligned with the code style, and `npm run lint` passes.
- Changed: releases are built, linted, audited and packaged automatically.

See [CHANGELOG.md](./CHANGELOG.md) and the [2.5.0 release notes](./release-notes/2.5.0.md) for the full list with upstream issue links.

## Usage

Use the command `export as a image` in command palette (Press cmd/ctrl+P to enter the command) to generate a image. You can download it to your file system, or copy to clipboard.

![](./assets/commad.png)

![](./assets/config.png)

Also, you can access this function from the editor menu:

![](./assets/menu.png)

> [!NOTE]
> Due to device limitations, exporting images on mobile can only be saved to the current vault.

## Installation

This fork is **not** in the community plugin directory. Install it with [BRAT](https://github.com/TfTHacker/obsidian42-brat):

1. Install and enable **BRAT** from Settings → Community plugins.
2. Open the command palette and run `BRAT: Add a beta plugin for testing`.
3. Enter `mistn/obsidian-export-image` and confirm.
4. Enable **Export Image (Fork)** in Settings → Community plugins.

Manual install: download `main.js`, `manifest.json` and `styles.css` from the [latest release](https://github.com/mistn/obsidian-export-image/releases/latest) and put them in `<vault>/.obsidian/plugins/obsidian-export-image/`.

> [!NOTE]
> This fork keeps the upstream plugin id `obsidian-export-image`, so it replaces the community version and keeps your existing settings. If you install the community plugin again, it may overwrite this fork; use BRAT to stay on the fork.

## Custom Styles

To help experienced users write their own CSS styles, here is the combined DOM structure of the exported image.

```html
<!-- Export Image Root -->
<div class="export-image-root markdown-reading-view">
  <!-- Watermark Container -->
  <div class="markdown-preview-view markdown-rendered export-image-preview-container">
    <!-- Inline Title -->
    <div class="inline-title"></div>
    <!-- Metadata -->
    <div class="metadata-container">
      <div class="metadata-content">
        <!-- Metadata Items -->
        <div class="metadata-property">
          <!-- Metadata Key -->
          <div class="metadata-property-key">
            <!-- Metadata Icon -->
            <span class="metadata-property-icon"></span>
            <!-- Metadata Name -->
            <span class="metadata-property-name"></span>
          </div>
          <!-- Metadata Value -->
          <div class="metadata-property-value"></div>
        </div>
      </div>
    </div>
    
    <!-- Note Content -->
    <div>...</div>
  </div>
  
  <!-- Author Info -->
  <div class="user-info-container">
    <!-- Author Avatar -->
    <div class="user-info-avatar"></div>
    <div>
      <!-- Author Name -->
      <div class="user-info-name"></div>
      <!-- Extra Info -->
      <div class="user-info-remark"></div>
    </div>
  </div>
</div>
```

## Star History

<a href="https://star-history.com/#mistn/obsidian-export-image&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mistn/obsidian-export-image&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mistn/obsidian-export-image&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mistn/obsidian-export-image&type=Date" />
 </picture>
</a>

## Credits

- [Zhou Hua](https://github.com/zhouhua) created the original [Export Image plugin](https://github.com/zhouhua/obsidian-export-image) that this fork is based on.
- [dom-to-image](https://github.com/tsayen/dom-to-image) and [dom-to-image-more](https://github.com/1904labs/dom-to-image-more): this plugin uses a vendored, modified copy for DOM-to-image rendering.

## License

MIT. See [LICENSE](./LICENSE). The original copyright notice is retained.
