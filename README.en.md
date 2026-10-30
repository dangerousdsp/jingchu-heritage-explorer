<p align="center"><img src="dist/assets/project-logo-transparent.png" width="112" alt="Jingchu Heritage"></p>

# Jingchu Heritage Explorer

**[简体中文](README.md) | [English](README.en.md)** · **1.0.0**

A bilingual digital exhibition of Hubei's intangible cultural heritage, connecting cultural guides, photographs, interactive maps, cultural trips and 3D objects.

**[Explore online](https://dangerousdsp.github.io/jingchu-heritage-explorer/?lang=en)** · [Deployment guide](docs/GITHUB_PUBLISH.en.md) · [Project overview](docs/PROJECT_OVERVIEW.md)

![English homepage](docs/images/home-en.png)

## Explore

| Feature | Experience |
| --- | --- |
| Bilingual collection | 146 regional entries and topics across ten categories, with search, favourites, guides and references |
| Heritage photographs | 22 attributed images with subject captions, a dedicated gallery, enlarged views and related topics |
| Interactive map | 73 regional reference groups and eight cultural destinations; select a marker for heritage information |
| Cultural trips | Multi-stop road routes, estimated distance and time, stop ordering, printing and Amap navigation |
| 3D exhibition | On-demand pottery, wood carving, bronze chimes and theatre scenes; split assets support static hosting |
| Learning notes | Reading progress, short quizzes, explanations and attempt history |

The regional base map loads with the website; online streets are optional. Regional points show cultural distribution, while visit destinations support travel planning. Images include Hubei locations, historical objects and clearly captioned art-form references.

![3D pottery](docs/images/webgl-pottery-v1.png)

## Run locally

Use Python 3.10+ and a modern browser:

```sh
python scripts/serve.py --open
```

Alternatively, serve `dist/` with a static HTTP server. No Unity installation or npm dependencies are required. The complete release includes split 3D assets. The first 3D launch downloads about 348 MiB; a desktop and stable network are recommended.

## Develop and publish

HTML / CSS / native JavaScript · Leaflet · OpenStreetMap · OSRM · Python standard library.

```sh
npm test
python -m unittest discover -s tests -p 'test_*.py'
python scripts/package_release.py --public --auto-webgl --output output/site-1.0.0
python scripts/check_release.py output/site-1.0.0
```

Pushing to `main` runs the checks and deploys GitHub Pages. Upload the prepared `dist/runtime/` directory as ordinary repository files; do not use Git LFS.

The floral identity and 3D assets originate from the Jingchu Heritage team project, with the website, content organisation, maps and learning interactions developed around them. See [credits](THIRD_PARTY_NOTICES.md) and [licensing scope](LICENSE_SCOPE.md).
