# maslink

`maslink` is a tiny static redirect page for Apple App Store deep links.

GitHub README previews often strip custom protocols such as `macappstore://`, which makes direct Mac App Store links unclickable. This project provides a normal `https://` URL that can be used in README files and then converted back into a native App Store deep link in the browser.

## Use Case

Instead of linking to:

```text
macappstore://itunes.apple.com/app/6758053530
```

link to:

```text
https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=mac
```

When the page opens, it will:

1. Read the query parameters.
2. Build the correct App Store deep link.
3. Attempt to redirect automatically.
4. Show manual buttons for native open and web fallback.

## Query Parameters

- `id`: Apple app ID, numeric only, required.
- `l`: Apple storefront/locale segment, optional, default is `us`.
- `platform`: Target platform, optional, default is `mac`.

Supported `platform` values:

- `mac`
- `ios`
- `iphone`
- `ipad`

## Generated Links

For macOS:

```text
macappstore://itunes.apple.com/app/id<ID>?mt=12&l=<LOCALE>
```

For iOS:

```text
itms-apps://itunes.apple.com/app/id<ID>?l=<LOCALE>
```

Web fallback:

```text
https://apps.apple.com/<LOCALE>/app/id<ID>
```

## Deploy

This repository is designed to work as a plain static site, for example with GitHub Pages.

The default entry is [index.html](/Users/wong/git/github/maslink/index.html).

## Example

- macOS: [Open Example](https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=mac)
- iOS: [Open Example](https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=ios)
