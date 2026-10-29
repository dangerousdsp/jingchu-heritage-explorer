# Upload to GitHub and publish the demo

Version 0.5.0. GitHub documentation checked on 2026-10-29. No remote repository or live deployment has been created by preparing these files.

## Packages

- `heritage-explorer-source-0.5.0.zip`: the source repository. Extract it first. The contents of its inner `heritage-explorer` folder must become the repository root.
- `heritage-explorer-pages-0.5.0.zip`: the generated public static site. This is suitable for a static host; use the source package for GitHub and the included workflow.

The source includes bilingual READMEs, documentation, screenshots, tests and `.github/workflows/pages.yml`. It excludes the original Unity build, archived video, source workbook, proposal, recovery output and personal QA files. Uploading a ZIP alone to the Code tab does not unpack or deploy a website.

## Create an empty repository

Create `jingchu-heritage-explorer` on GitHub. Suggested description:

> Explore Hubei heritage through a sourced catalogue, street maps, cultural road trips and learning tools. A web continuation of an earlier Unity team project.

Suggested topics: `cultural-heritage`, `hubei`, `webgis`, `leaflet`, `javascript`, `python`, `unity-webgl`, `digital-humanities`.

Select Public for GitHub Free Pages hosting. Private-repository Pages availability depends on your plan. Do not initialise the remote with a README, .gitignore or a blanket licence: the package already contains the first two and documents the licensing scope. See [Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Upload source files

With the web interface, choose “uploading an existing file” in the empty repository, or Add file → Upload files. Drag the contents of the extracted source folder, preserving its subdirectories. Confirm that `.github/workflows/pages.yml`, `dist/index.html` and `README.en.md` are present. Commit to main. The root should directly contain README.md, dist, docs, scripts, tests and .github, with no extra enclosing source folder.

Alternatively, open a terminal in the source directory and use Git. Replace `YOUR_USERNAME` and use the repository you created:

```sh
git init -b main
git add .
git status --short
git commit -m "Prepare bilingual heritage explorer and public demo"
git remote add origin https://github.com/YOUR_USERNAME/jingchu-heritage-explorer.git
git push -u origin main
```

Set your repository-local `user.name` and `user.email` first if Git requests a commit identity. Authenticate using your Git client or GitHub Desktop; do not put credentials in source files or remote URLs. Inspect any existing remote/history rather than force-pushing over it. See [GitHub's import guide](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

Browser uploads allow up to 100 files at a time and 25 MiB per file; regular Git blocks individual files above 100 MiB. The lightweight source files are well below these sizes. See [upload limits](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) and [large-file guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

## Enable Pages

1. Open the repository's **Settings → Pages**.
2. Set **Build and deployment → Source → GitHub Actions**. Do not select docs: it holds documentation, not the generated website.
3. Open **Actions → Check and publish Pages** and run it for main. If the first push failed before Pages was enabled, rerun all jobs after changing the setting.
4. Wait for both `check` and `deploy` to succeed. The workflow tests JavaScript/Python, generates and validates the public static site, and then deploys it.
5. Open the actual URL shown in Settings → Pages, normally `https://YOUR_USERNAME.github.io/jingchu-heritage-explorer/`.
6. Put that URL in the repository's About → Website field and add the suggested topics.

No personal token or manually configured repository Secret is required by this workflow. See [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Check the published result

The homepage should display version 0.5.0. The Language selector switches Chinese and English, and the About link opens the bilingual project introduction. Check catalogue filtering, source links, reading records, quizzes, map attribution and a requested road route. Public services may fail; the application should show feedback and alternative navigation links.

The public 3D and archived-video buttons intentionally state that those assets are not included. Local video preview remains available. The website supports Chinese and English navigation, cultural guides for all 146 entries, search, trips and quizzes. Original organisation records, external source pages, map-provided street names and internal Unity text may remain in Chinese.

If Pages returns 404, check the deployment status, exact repository URL and root layout. If Actions cannot find dist or scripts, the source was probably uploaded with an extra directory level. If a source ZIP is the only file, extract it before uploading.

## Create a Release and update later

After a successful deployment, optionally create a GitHub Release tagged `v0.5.0` on main. Use `docs/RELEASE_NOTES_v0.5.0.md` as the body and attach the source and public-site ZIPs. Do not attach the original Unity/video archive as part of this release.

For later changes, edit the maintained source, run tests, commit and push to main. Pages redeploys automatically. When releasing a new version, update version references and the changelog before packaging. Existing outputs are never overwritten. Do not maintain changes only in generated output folders.

## Full legacy 3D hosting

Pages does not execute the Python server. The public profile disables missing legacy resources rather than producing broken runtime downloads. The existing large, compressed Unity export also needs correct gzip and Wasm response headers; uploading files alone does not establish a working deployment. See [Unity deployment guidance](https://docs.unity3d.com/2020.2/Documentation/Manual/webgl-deploying.html). Git LFS cannot be used with Pages sites; see [GitHub LFS documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).

For now, run `python scripts/serve.py --runtime-dir "/path/to/WebGL" --open` locally. A future full 3D web release requires appropriate redistribution permissions and a resource host with verified HTTPS, CORS, compression/MIME headers and paths. No such remote runtime deployment has been configured or validated in this release.
