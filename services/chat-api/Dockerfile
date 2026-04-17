FROM python:3.11-slim

WORKDIR /app

# 安装 uv
RUN pip install --no-cache-dir uv

# 先拷贝依赖声明，利用 Docker layer cache
COPY pyproject.toml uv.lock* ./

# 用 uv 创建项目虚拟环境并安装依赖
RUN uv sync --frozen --no-dev --no-install-project || uv sync --no-dev --no-install-project

# 再拷贝代码
COPY . .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]