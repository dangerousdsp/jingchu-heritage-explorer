import unittest,sys,json
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import routing
class RoutingTests(unittest.TestCase):
    def setUp(self):routing._cache.clear();routing._last_request=0
    def test_rejects_unknown_duplicates_and_arbitrary_urls(self):
        for value in ['', 'http://localhost/', 'hubei-museum,hubei-museum', 'hubei-museum,unknown']:
            with self.assertRaises(ValueError):routing.validated_points(value)
    def test_uses_wgs84_parking_access(self):
        points=routing.validated_points('hubei-museum,yellow-crane')
        self.assertEqual(points[1]['lon'],114.30265217142858)
        self.assertEqual(points[1]['coordinateSystem'],'WGS84')
    def test_simplifies_provider_data_and_caches(self):
        payload={'code':'Ok','routes':[{'distance':1200,'duration':240,'geometry':{'type':'LineString','coordinates':[[114.36,30.56],[114.30,30.54]]},'legs':[{'distance':1200,'duration':240,'steps':[]}]}],'waypoints':[{'distance':10},{'distance':8}]}
        class Response:
            def __enter__(self):return self
            def __exit__(self,*args):pass
            def read(self,*args):return json.dumps(payload).encode()
        with patch.object(routing,'urlopen',return_value=Response()) as fetch:
            first=routing.fetch_route('hubei-museum,yellow-crane');second=routing.fetch_route('hubei-museum,yellow-crane')
            self.assertEqual(first,second);self.assertEqual(fetch.call_count,1);self.assertFalse(first['includesLiveTraffic']);self.assertEqual(first['distance'],1200)
    def test_provider_failure_is_actionable(self):
        with patch.object(routing,'urlopen',side_effect=OSError('offline')):
            with self.assertRaisesRegex(routing.RoutingError,'高德'):routing.fetch_route('hubei-museum,yellow-crane')
