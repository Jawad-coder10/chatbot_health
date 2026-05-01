FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY app ./app

EXPOSE 8000

CMD ["python", "-m", "app.main"]