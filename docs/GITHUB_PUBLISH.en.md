# Publish version 1.0

Repository: https://github.com/dangerousdsp/jingchu-heritage-explorer

Website: https://dangerousdsp.github.io/jingchu-heritage-explorer/

The complete source includes the website, attributed photographs and prepared 3D chunks. Uploading a ZIP as a repository file does not publish its contents.

1. Create a `release-v1.0.0` branch from the existing `main` branch.
2. Upload the contents of each directory under `upload-batches/` in order, always starting from the repository root. Do not upload the numbered batch directory itself.
3. Batches 01 and 02 contain code, documentation, website files and photos. Batch 03 contains the Unity loader, framework, wasm and runtime manifest. Batches 04–08 contain data-00.bin through data-16.bin under `dist/runtime/Build/`.
4. Verify `.github/workflows/pages.yml` includes this build command:

```yaml
run: python scripts/package_release.py --public --auto-webgl --output output/github-pages
```

The `--auto-webgl` option enables the prepared runtime. If browser upload skips the dot-prefixed directory, edit the existing workflow directly using the supplied file.

5. Delete the obsolete files listed in the [detailed Chinese guide](GITHUB_PUBLISH.zh-CN.md) from the update branch. Browser upload replaces files but does not delete absent files.
6. Open a pull request from `release-v1.0.0` to `main`, wait for checks, and merge it.
7. Under Settings → Pages, keep Source set to GitHub Actions. Wait for both check and deploy in the newest Actions run to succeed.
8. Refresh the website and verify the 1.0.0 footer, bilingual text, photo gallery, marker popups and on-demand 3D pottery/wood scenes.

Alternatively, clone the existing repository using GitHub Desktop or Git, copy the contents of `source/heritage-explorer/` into the clone, review changes and deletions, commit, push and merge. Preserve the clone's `.git` directory.

Do not upload the original unsplit WebGL.data.unityweb, workbook, Windows export or archived video. Do not use Git LFS for Pages assets. The 17 data chunks are at most 20 MiB each; the complete static site is approximately 350 MiB. The first 3D launch transfers about 348 MiB and is intended primarily for desktop use.

GitHub's browser upload limit is 25 MiB per file and 100 files at a time; Pages sites must stay below 1 GB. See the official [upload guide](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) and [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
