# amark-fr

个人站点 monorepo：前端（Vite + React）与聊天后端（FastAPI + RAG / Chroma）。

## 前置条件

- **后端**：Python 3.12、[uv](https://github.com/astral-sh/uv)
- **前端**：Node 20+、[pnpm](https://pnpm.io)

## 启动后端

```bash
cd services/chat-api
cp .env.exemple .env.local   # 编辑 .env.local，填入 OPENAI_API_KEY 等
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

默认 API 在 `http://127.0.0.1:8000`。

## 启动前端

另开一个终端（需先起后端，或把代理指到已有 API）：

```bash
cd frontend
pnpm install
pnpm dev
```

开发时 Vite 会把 `/api` 代理到本机 `http://127.0.0.1:8000`（可用环境变量 `VITE_API_PROXY_TARGET` 覆盖）。

## 构建向量库（Chroma 索引）

在 **`services/chat-api` 目录下**执行（与本地 `CHROMA_PATH` 一致，默认写入 `./.chroma`）：

```bash
cd services/chat-api
uv run python app/rag/indexer.py
```

需已配置 `.env.local` 中的 **`OPENAI_API_KEY`**（与当前 `OpenAIEmbeddings` 一致）。  
全量重建可先删除旧库再跑：

```bash
rm -rf .chroma
uv run python app/rag/indexer.py
```

线上若使用 Railway Volume，在平台里设置 **`CHROMA_PATH`**（例如 `/data/chroma`）后，在同一环境下运行上述 indexer，向量会写入该路径。

## 可选：Docker Compose

在项目根目录：

```bash
docker compose up --build
```

具体端口见 `docker-compose.yml`。
