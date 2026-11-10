import json, math, sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent/'runtime-libs'))
from shapely.geometry import Polygon, MultiPolygon, shape
from shapely.ops import unary_union
from shapely import make_valid, transform
from pyproj import CRS, Transformer
from pyproj.crs import ProjectedCRS
from pyproj.crs.coordinate_operation import LambertConformalConic2SPConversion

root=Path(__file__).resolve().parent.parent
mapping=json.loads((root/'tools/region-map.json').read_text(encoding='utf-8'))
official=json.loads((root/'tools/official/communes-2026-public.json').read_text(encoding='utf-8'))
assert len(official['features'])==3321
crs=ProjectedCRS(name='VN-2000 / Lambert 11N 21N 108E 4N',conversion=LambertConformalConic2SPConversion(11,21,4,108),geodetic_crs=CRS.from_epsg(4756))
projector=Transformer.from_crs(4326,crs,always_xy=True,allow_ballpark=False)
def projected(geom): return transform(geom,projector.transform,interleaved=False)
frame=[projector.transform(lon,lat) for lon in [102+i/10 for i in range(161)] for lat in [4.5,23.5]]+[projector.transform(lon,lat) for lat in [4.5+i/10 for i in range(191)] for lon in [102,118]]
minx,miny,maxx,maxy=min(p[0] for p in frame),min(p[1] for p in frame),max(p[0] for p in frame),max(p[1] for p in frame)
scale=min(960/(maxx-minx),1150/(maxy-miny))
offsetx=(1000-(maxx-minx)*scale)/2;offsety=(1210-(maxy-miny)*scale)/2
def screen(x,y): return [round(offsetx+(x-minx)*scale,3),round(offsety+(maxy-y)*scale,3)]
def locate(lon,lat):return screen(*projector.transform(lon,lat))
def polygons(g):
 if g.geom_type=='Polygon':return [g]
 if hasattr(g,'geoms'):return [p for sub in g.geoms for p in polygons(sub)]
 return []
def esri(rings):
 shells=[];holes=[]
 for ring in rings:
  signed=sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(ring,ring[1:]))
  (shells if signed<0 else holes).append(Polygon(ring))
 if not shells:shells,holes=holes,[]
 result=[]
 for shell in shells:
  contained=[h for h in holes if shell.covers(h.representative_point())]
  result.append(make_valid(Polygon(shell.exterior.coords,[h.exterior.coords for h in contained])))
 return unary_union(result)
groups={};islands={}
for f in official['features']:
 a=f['attributes'];g=projected(esri(f['geometry']['rings']));groups.setdefault(a['MATINH'],[]).append(g)
 if a['TENXA'] in ['Đặc khu Hoàng Sa','Đặc khu Trường Sa']:islands[a['TENXA']]=g
assert len(groups)==34 and len(islands)==2
modern={id:unary_union(gs) for id,gs in groups.items()}
old_raw=json.loads((root/'tools/old-provinces.geojson').read_text(encoding='utf-8'))
norm=lambda s:''.join(c for c in __import__('unicodedata').normalize('NFD',s.lower().replace('đ','d').replace('tp. ','')) if c.isalnum()).replace('thanhpho','')
fix={'VN-39':'Đồng Nai','VN-53':'Bắc Kạn','VN-66':'Hưng Yên'}
old={}
for r in mapping['old']:
 f=next((f for f in old_raw['features'] if norm(fix.get(f['properties']['iso_3166_2'],f['properties'].get('name_vi') or f['properties']['name']))==norm(r['name'])),None)
 if f is None:raise RuntimeError('Missing old province: '+r['name'])
 g=projected(shape(f['geometry']))
 if r['name']=='Đà Nẵng':g=unary_union([g,islands['Đặc khu Hoàng Sa']])
 if r['name']=='Khánh Hòa':g=unary_union([g,islands['Đặc khu Trường Sa']])
 old[r['id']]=g
def path(g):
 pieces=[]
 for p in polygons(g.simplify(120,preserve_topology=True)):
  for ring in [p.exterior,*p.interiors]:pieces.append('M'+'L'.join(','.join(map(str,screen(x,y))) for x,y,*_ in ring.coords)+'Z')
 return ''.join(pieces)
def output(rows,geoms,name):
 result=[]
 for r in rows:
  g=geoms[r['id']];large=max(polygons(g),key=lambda p:p.area);simple=large.simplify(120,preserve_topology=True);b=simple.bounds;p=simple.representative_point();c=screen(p.x,p.y)
  neighbors=[other['id'] for other in rows if other['id']!=r['id'] and large.distance(max(polygons(geoms[other['id']]),key=lambda p:p.area))<50 and large.boundary.intersection(max(polygons(geoms[other['id']]),key=lambda p:p.area).buffer(30)).length>500]
  result.append({'id':r['id'],'name':r['name'],'path':path(g),'center':c,'bounds':[screen(b[0],b[3])[0],screen(b[0],b[3])[1],screen(b[2],b[1])[0],screen(b[2],b[1])[1]],'neighbors':neighbors})
 # Numerical proximity can be asymmetric; make the graph symmetric.
 for r in result:
  for n in list(r['neighbors']):
   other=next(x for x in result if x['id']==n)
   if r['id'] not in other['neighbors']:other['neighbors'].append(r['id'])
 (root/'public'/name).write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 return result
a=output(mapping['modern'],modern,'map34.json');b=output(mapping['old'],old,'map.json')
arch=[]
for name,ids,label in [('Đặc khu Hoàng Sa',['48','old-43'],(111.65,17.65)),('Đặc khu Trường Sa',['56','old-79'],(115.5,12.35))]:
 g=islands[name];arch.append({'id':'hoang-sa' if 'Hoàng' in name else 'truong-sa','name':'QĐ. HOÀNG SA' if 'Hoàng' in name else 'QĐ. TRƯỜNG SA','ownerIds':ids,'label':locate(*label),'markers':[screen(p.representative_point().x,p.representative_point().y) for p in polygons(g)],'source':'VNSDI – dữ liệu công khai ngày 01/10/2026'})
(root/'public/archipelagos-map.json').write_text(json.dumps(arch,ensure_ascii=False),encoding='utf-8')
meta={'projection':'Lambert conformal conic 2SP','geographicSource':'EPSG:4326 (VNSDI public query)','targetGeodetic':'EPSG:4756 VN-2000','standardParallels':[11,21],'centralMeridian':108,'latitudeOrigin':4,'uniformScaleSvgPerMetre':scale,'offset':[offsetx,offsety],'projectedFrame':[minx,miny,maxx,maxy],'geographicFrame':[102,4.5,118,23.5],'modernSource':official['source'],'modernPublished':'01/10/2026','historicalSource':'Natural Earth 5.1.2; offshore archipelagos from VNSDI','transformation':projector.get_last_used_operation().description,'certified':False,'note':'Nguồn và thông số kỹ thuật đã ghi nhận; chưa có biên bản kiểm tra/nghiệm thu sản phẩm bản đồ.'}
(root/'public/map-metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
print('GIS build:',len(b),'historical,',len(a),'modern;',sum(len(x['markers']) for x in arch),'island/reef components; uniform scale',scale)

decorations=[{'text':'TRUNG QUỐC','position':locate(107.6,23.1),'type':'country'},{'text':'LÀO','position':locate(102.7,18.2),'type':'country'},{'text':'CAMPUCHIA','position':locate(104.6,12.4),'type':'country'},{'text':'BIỂN ĐÔNG','position':locate(113.5,14.6),'type':'sea'}]
(root/'public/map-decoration.json').write_text(json.dumps(decorations,ensure_ascii=False),encoding='utf-8')
