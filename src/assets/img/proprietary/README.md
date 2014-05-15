# proprietary files

The files in this directory are ignored from git as they are commercially licensed. We keep an eye on how the app looks if the files are not present.

However, you may want to add your own files here if you set up a personal instance of OpenLearnWare. So, here's a list of what files could be needed here:

```yaml
area/
    # for <id> in the ids of the areas [i.e. `1`, `2`, ..., `13`]
    - <id>.jpg
    - <id>-lofi.jpg
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