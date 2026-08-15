#!/usr/bin/env python3
"""Dev server for Monster Truck.

Same job as `python3 -m http.server`, with two additions:
  - no-store, so the browser re-fetches ES modules on every reload (module
    caching is keyed by URL; query-string busting on index.html doesn't help)
  - HTTP/1.1 keep-alive, because the game bursts ~10 parallel voice-clip
    fetches per round and 1.0's close-per-request drops some of them

Production is a plain static host (GitHub Pages); nothing here is needed there.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "GET" in (args[0] if args else ""):
            return  # quiet: one line per asset is noise during a reload storm

        super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8166
    handler = partial(NoCacheHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Monster Truck on http://localhost:{port}  (serving {ROOT})")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
