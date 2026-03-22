# README

## About

This is the official Wails React-TS template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.

## PostgreSQL (Docker)

`data.dbml` に対応したテーブルを、Docker起動時に自動で初期化できます。

### Start

```bash
docker compose -f infra/compose.yml up -d --build
```

### Stop

```bash
docker compose -f infra/compose.yml down
```

### Reinitialize

初期化SQLは初回起動時のみ実行されます。再初期化する場合はボリュームも削除してください。

```bash
docker compose -f infra/compose.yml down -v
docker compose -f infra/compose.yml up -d --build
```

### Connection

- Host: `localhost`
- Port: `5432`
- Database: `chat_graph`
- User: `app`
- Password: `app`

### Verify Schema

```bash
docker compose -f infra/compose.yml exec db psql -U app -d chat_graph -c "\\dt"
docker compose -f infra/compose.yml exec db psql -U app -d chat_graph -c "\\di"
```
