# proprietary files

The files in this directory are ignored from git as they are commercially licensed. We keep an eye on how the app looks if the files are not present.

However, you may want to add your own files here if you set up a personal instance of OpenLearnWare. So, here's a list of what files could be needed here:

```yaml
area/
    # for <id> in the ids of the areas [i.e. `1`, `2`, ..., `13`]
    - <id>.jpg # high-resolution version
    - <id>-lofi.jpg # low-resolution version
logo/
    # see `/src/app/common/olwConfigurationService/olwConfigurationService.js` on how we use this
    - tu.svg
section/
    # for <slug> in the slugs of your sections [i.e. `gw`, `iw`, `nw`]
    - <slug>.jpg
signature/
    # for <slug> in the slugs of your sections [i.e. `gw`, `iw`, `nw`]
    - <slug>.png
```

If you are from the tu darmstadt olw team, you can check out a filled version of this folder from the private svn:

```bash
cd /src/app/assets/img/proprietary
svn checkout https://svn.hrz.tu-darmstadt.de/openlearnware/projects/proprietary .
```