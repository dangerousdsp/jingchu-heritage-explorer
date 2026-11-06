# Jingchu Reverie · Heritage Explorer

**[Live demo](https://dangerousdsp.github.io/jingchu-heritage-explorer/?lang=en)** · [简体中文](README.md)

A bilingual exhibition of Hubei's intangible cultural heritage, connecting cultural guides, geographic discovery and 3D experiences.

- **Cultural collection**: 146 regional entries and topics, with search, filters, favourites and learning notes.
- **Maps and trips**: selectable heritage locations, cultural destinations and multi-stop road routes.
- **Images and artworks**: heritage photographs, six thematic maps and an opera excerpt.
- **Cloud gallery**: a lightweight Three.js room, the original project bell, a porcelain vase and two stone carvings, with orbit controls, observation points, bilingual notes and optional higher detail.
- **Xiaochu assistant**: local knowledge retrieval, bilingual answers and contextual follow-ups.

**Core technologies**: HTML / CSS / JavaScript, Three.js, Leaflet and OSRM. 

## Run locally (optional)

Use Node.js 18+ and a modern browser. From the project root:

```sh
npm run serve
```

Run `npm run museum` to open the bell directly. On Windows, use “打开轻量展馆.cmd”. Python 3.10+ remains supported with `python scripts/serve.py --open`.

The homepage does not load the 3D library or models. The original bell is approximately 2.81 MiB, with an optional 4.47 MiB version. Smithsonian open collection objects retain their actual origins. Unity files are kept in a local backup outside the website.

See [resource credits](THIRD_PARTY_NOTICES.md) and [permissions](LICENSE_SCOPE.md).
