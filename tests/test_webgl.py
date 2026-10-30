import hashlib,json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import package_webgl

class SplitExportTests(unittest.TestCase):
    def test_split_reassembles_identical_export_without_modifying_source(self):
        with tempfile.TemporaryDirectory() as temp:
            source=Path(temp)/'original';build=source/'Build';build.mkdir(parents=True)
            data=b'\x1f\x8b'+bytes(range(70))
            for name in ('WebGL.loader.js','WebGL.framework.js.unityweb','WebGL.wasm.unityweb'):(build/name).write_bytes(b'engine')
            (build/'WebGL.data.unityweb').write_bytes(data)
            output=Path(temp)/'prepared'
            with patch.object(package_webgl,'CHUNK_BYTES',20):manifest=package_webgl.package(source,output)
            assembled=b''.join((output/p['path']).read_bytes() for p in manifest['parts'])
            self.assertEqual(assembled,data);self.assertEqual(manifest['sha256'],hashlib.sha256(data).hexdigest())
            self.assertEqual((build/'WebGL.data.unityweb').read_bytes(),data)
            self.assertFalse((output/'Build/WebGL.data.unityweb').exists())
            self.assertEqual(json.loads((output/'runtime-manifest.json').read_text()),manifest)
    def test_missing_export_and_existing_destination_are_not_overwritten(self):
        with tempfile.TemporaryDirectory() as temp:
            source=Path(temp)/'missing';source.mkdir();output=Path(temp)/'prepared';output.mkdir();marker=output/'keep';marker.write_text('keep')
            with self.assertRaises(ValueError):package_webgl.package(source,output)
            self.assertEqual(marker.read_text(),'keep')
            fresh=Path(temp)/'new'
            with self.assertRaises(ValueError):package_webgl.package(source,fresh)
            self.assertFalse(fresh.exists())
if __name__=='__main__':unittest.main()
