# 🤖「動畫生涯個人喜好表生成器」

一個生成 動畫生涯個人喜好表 的網頁工具

Forked from [itorr/anime-grid](https://github.com/itorr/anime-grid).

## Developing

You can open `html/index.html` to get started, but for a better experience, you can install yarn and run `yarn dev`.

```sh
yarn # install depenencies
yarn dev # start the dev server
yarn build # build static html at html/dist/ directory
```

## Config

While using the Annict API, you need to copy `html/.env.example` to `html/.env.local` and replace `your-api-token` with your own API token. (Actually once you build the static html, it will expose your API token to the client side, which is pretty bad.)

If you don't want to install vite, you should replace `import.meta.env.VITE_ANNICT_API_TOKEN` in `html/index.js` with your own token.

## Library Used

- [html-to-dom](https://github.com/bubkoo/html-to-image)

## API Used

- [MediaWiki](https://www.mediawiki.org/wiki/API:Main_page): Translates Chinese anime titles to Japanese.
- [Annict](https://developers.annict.com/docs): Retrieves anime images.

## Original Idea By [@itorr](https://github.com/itorr/anime-grid)
