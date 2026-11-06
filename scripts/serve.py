"""Loopback-only static preview with optional road routing."""
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote, urlsplit, parse_qs
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from routing import fetch_route,RoutingError
import argparse, json, mimetypes, os, re, shutil, socket, webbrowser

PROJECT = Path(__file__).resolve().parents[1]
DIST = PROJECT / 'dist'
def confined(base, relative):
    base = base.resolve()
    candidate = (base / relative).resolve()
    return candidate if candidate.is_relative_to(base) else None

class Handler(BaseHTTPRequestHandler):
    server_version = 'HeritageLocal/1.0'
    def do_GET(self): self.respond(False)
    def do_HEAD(self): self.respond(True)
    def respond(self, head):
        path = unquote(urlsplit(self.path).path)
        if '\\' in path or '\x00' in path:
            self.send_error(400); return
        if path == '/api/route':
            if head:self.send_error(405);return
            params=parse_qs(urlsplit(self.path).query)
            try:
                result=fetch_route(params.get('stops',[''])[0]);status=200
            except ValueError as error:result={'error':str(error)};status=400
            except RoutingError as error:result={'error':str(error)};status=503
            body=json.dumps(result,ensure_ascii=False).encode('utf-8')
            self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
        target = confined(DIST, path.lstrip('/') or 'index.html')
        if target is None:
            self.send_error(403); return
        if not target.is_file():
            self.send_error(404, 'Resource unavailable'); return
        length = target.stat().st_size
        kind = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        if target.suffix in (".mjs", ".js"):kind="application/javascript"
        if target.suffix == ".glb":kind="model/gltf-binary"
        if kind.startswith("text/") or kind=="application/javascript":kind+="; charset=utf-8"
        start, end, status = 0, length-1, 200
        range_header = self.headers.get('Range')
        if range_header and target.suffix.lower()=='.mp4':
            match=re.fullmatch(r'bytes=(\d*)-(\d*)',range_header)
            if not match or not any(match.groups()):self.send_error(416);return
            left,right=match.groups()
            if left:start=int(left);end=min(int(right),end) if right else end
            else:start=max(0,length-int(right))
            if start>=length or end<start:
                self.send_response(416);self.send_header('Content-Range',f'bytes */{length}');self.send_header('Content-Length','0');self.end_headers();return
            status=206
        self.send_response(status)
        self.send_header('Content-Type',kind)
        self.send_header('Content-Length',str(end-start+1))
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','strict-origin-when-cross-origin')
        self.send_header('Cache-Control','no-cache')
        self.send_header('Last-Modified',self.date_time_string(target.stat().st_mtime))
        if target.suffix.lower()=='.mp4':self.send_header('Accept-Ranges','bytes')
        if status==206:self.send_header('Content-Range',f'bytes {start}-{end}/{length}')
        self.end_headers()
        if head:return
        try:
            with target.open('rb') as source:
                source.seek(start);remaining=end-start+1
                while remaining:
                    chunk=source.read(min(1024*1024,remaining))
                    if not chunk:break
                    self.wfile.write(chunk);remaining-=len(chunk)
        except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):pass

def main():
    parser=argparse.ArgumentParser(description='Local heritage explorer preview')
    parser.add_argument('--port',type=int,default=8767)
    parser.add_argument('--open',action='store_true')
    args=parser.parse_args()
    # Only loopback: this is a local preview, not a public deployment service.
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    url=f'http://127.0.0.1:{args.port}/'
    version=json.loads((PROJECT/'package.json').read_text(encoding='utf-8'))['version']
    print(f'Jingchu Heritage Explorer {version}\nLocal: {url}',flush=True)
    print('Press Ctrl+C to stop.',flush=True)
    if args.open:webbrowser.open(url)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()

if __name__=='__main__':main()
