## Development

```bash
$ cp .env.example .env # Copy and set environment variables
$ yarn
$ yarn dev
```

## Secrets

1. Create bot and get token for telegram
2. Create project and setup account for GCP

## Demo

[![Demo](https://user-images.githubusercontent.com/729374/156602024-0266f853-f2ca-4175-9ff6-b3762fed1458.png)](https://user-images.githubusercontent.com/729374/156603671-aadf0f50-ae10-4949-90f3-b158c40544b8.mp4)

## Usage

1. Make your spreadsheets public or share them with special email (ask admin).
2. Open the [app](https://sheets-matcher-ui.vercel.app).
3. Enter id of spreadhseet and name of sheet for requests and proposals.
4. For advanced settings use this [url](https://sheets-matcher-ui.vercel.app/?config=true).

### Telegram notifications

1. Add @sheetsmatcher_bot to your group.
2. Use this [url](https://sheets-matcher-ui.vercel.app/?config=true&connect=true&chatid=true) for app.
3. Set your group chat id in text field (could be found at [web.telegram.org](https://web.telegram.org)).
4. Click Connect to make bot send a message to chat with contacts of people matched.
