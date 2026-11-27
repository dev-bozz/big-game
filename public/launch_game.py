from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Event, Thread
import webbrowser

root = Path(__file__).resolve().parent
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
server = ThreadingHTTPServer(("127.0.0.1", 4173), handler)
url = "http://127.0.0.1:4173/"
print(f"Игра запущена: {url}\nЧтобы остановить сервер, нажмите Ctrl+C.")
Thread(target=server.serve_forever, daemon=True).start()
webbrowser.open(url)
try:
    Event().wait()
except KeyboardInterrupt:
    print("\nСервер остановлен.")
finally:
    server.server_close()
