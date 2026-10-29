import unittest,tempfile,subprocess,sys,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from check_release import check_release
class PublicReleaseTests(unittest.TestCase):
    def test_public_package_disables_missing_media_and_preserves_source(self):
        original=(ROOT/'dist/deployment.mjs').read_bytes()
        with tempfile.TemporaryDirectory() as temp:
            target=Path(temp)/'site'
            result=subprocess.run([sys.executable,str(ROOT/'scripts/package_release.py'),'--public','--output',str(target)],capture_output=True)
            self.assertEqual(result.returncode,0,result.stderr.decode(errors='replace'))
            self.assertEqual(check_release(target),[])
            self.assertFalse((target/'runtime').exists())
            self.assertIn('LEGACY_MEDIA_ENABLED = false',(target/'deployment.mjs').read_text())
            self.assertIn('id="language-select"',(target/'index.html').read_text(encoding='utf-8'))
            self.assertEqual((ROOT/'dist/deployment.mjs').read_bytes(),original)
    def test_repack_refuses_to_overwrite_existing_output(self):
        with tempfile.TemporaryDirectory() as temp:
            marker=Path(temp)/'keep.txt';marker.write_text('original')
            result=subprocess.run([sys.executable,str(ROOT/'scripts/package_release.py'),'--public','--output',temp],capture_output=True)
            self.assertNotEqual(result.returncode,0);self.assertEqual(marker.read_text(),'original')
    def test_manifest_detects_tampered_files(self):
        with tempfile.TemporaryDirectory() as temp:
            target=Path(temp)/'site'
            subprocess.run([sys.executable,str(ROOT/'scripts/package_release.py'),'--public','--output',str(target)],check=True,capture_output=True)
            (target/'about.html').write_text('tampered',encoding='utf-8')
            self.assertTrue(any('mismatch' in e for e in check_release(target)))
if __name__=='__main__':unittest.main()
