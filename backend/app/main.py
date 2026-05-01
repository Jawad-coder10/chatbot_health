from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json


class HealthHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: dict[str, str]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/":
            self._send_json(200, {"message": "Chatbot Health backend is running"})
            return

        if self.path == "/health":
            self._send_json(200, {"status": "ok"})
            return

        self._send_json(404, {"detail": "Not Found"})

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), HealthHandler)
    server.serve_forever()