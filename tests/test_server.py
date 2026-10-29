import unittest,tempfile,threading,http.client,gzip,importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('heritage_server',Path(__file__).resolve().parents[1]/'scripts/serve.py')
server_module=importlib.util.module_from_spec(spec);spec.loader.exec_module(server_module)
class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory();cls.runtime=Path(cls.temp.name)/'runtime';(cls.runtime/'Build').mkdir(parents=True);(cls.runtime/'StreamingAssets').mkdir()
        (cls.runtime/'Build/WebGL.loader.js').write_text('/* fixture */')
        (cls.runtime/'Build/WebGL.wasm.unityweb').write_bytes(gzip.compress(b'\0asm\x01\0\0\0'))
        (cls.runtime/'StreamingAssets/video.mp4').write_bytes(b'0123456789')
        cls.server=server_module.ThreadingHTTPServer(('127.0.0.1',0),server_module.Handler);cls.server.runtime_dir=cls.runtime
        cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
    @classmethod
    def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.thread.join();cls.temp.cleanup()
    def request(self,path,method='GET',headers=None):
        connection=http.client.HTTPConnection('127.0.0.1',self.server.server_port,timeout=5);connection.request(method,path,headers=headers or {});response=connection.getresponse();result=(response.status,dict(response.getheaders()),response.read());connection.close();return result
    def test_static_modules_and_homepage(self):
        status,headers,body=self.request('/');self.assertEqual(status,200);self.assertIn('荆楚非遗'.encode(),body)
        status,headers,body=self.request('/app.mjs');self.assertEqual(status,200);self.assertIn('application/javascript',headers['Content-Type'])
    def test_native_gzip_and_wasm_head(self):
        status,headers,body=self.request('/runtime/Build/WebGL.wasm.unityweb');self.assertEqual(status,200);self.assertEqual(headers['Content-Encoding'],'gzip');self.assertEqual(headers['Content-Type'],'application/wasm');self.assertTrue(gzip.decompress(body).startswith(b'\0asm'))
        status,headers,body=self.request('/runtime/Build/WebGL.wasm.unityweb','HEAD');self.assertEqual(status,200);self.assertEqual(body,b'')
    def test_video_range_and_invalid_range(self):
        status,headers,body=self.request('/runtime/StreamingAssets/video.mp4',headers={'Range':'bytes=2-5'});self.assertEqual(status,206);self.assertEqual(body,b'2345');self.assertEqual(headers['Content-Range'],'bytes 2-5/10')
        self.assertEqual(self.request('/runtime/StreamingAssets/video.mp4',headers={'Range':'bytes=99-'})[0],416)
        self.assertEqual(self.request('/runtime/StreamingAssets/video.mp4',headers={'Range':'bytes=-3'})[2],b'789')
    def test_mount_does_not_expose_project_or_parent_files(self):
        for path in ['/../README.md','/%2e%2e/README.md','/runtime/Build/%2e%2e/%2e%2e/secret','/runtime/../README.md','/runtime/Build/%5csecret','/runtime/']:
            self.assertIn(self.request(path)[0],(400,403,404))
    def test_missing_build_has_real_404(self):self.assertEqual(self.request('/runtime/Build/absent.wasm','HEAD')[0],404)
if __name__=='__main__':unittest.main()
