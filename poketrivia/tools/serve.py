#!/usr/bin/env python3
"""Dev server for PokeTrivia Island.

Same job as `python3 -m http.server`, with one addition: it sends no-store so the
browser re-fetches ES modules on every reload. Module caching is keyed by URL, so
without this a changed js/world.js keeps serving the stale copy no matter how you
bust the query string on index.html.

Production is a plain static host (GitHub Pages); nothing here is needed there.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "GET" in (args[0] if args else ""):
            return  # quiet: one line per asset is noise during a reload storm
        super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8155
    handler = partial(NoCacheHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"PokeTrivia Island on http://localhost:{port}  (serving {ROOT})")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
