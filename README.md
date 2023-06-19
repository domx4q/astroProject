[![Node.js CI](https://github.com/domx4q/astroProject/actions/workflows/node.js.yml/badge.svg)](https://github.com/domx4q/astroProject/actions/workflows/node.js.yml)
[![Codespaces Prebuilds](https://github.com/domx4q/astroProject/actions/workflows/codespaces/create_codespaces_prebuilds/badge.svg)](https://github.com/domx4q/astroProject/actions/workflows/codespaces/create_codespaces_prebuilds)
[![Docker Image CI](https://github.com/domx4q/astroProject/actions/workflows/docker-image.yml/badge.svg)](https://github.com/domx4q/astroProject/actions/workflows/docker-image.yml)

[![CodeScene Code Health](https://codescene.io/projects/31104/status-badges/code-health)](https://codescene.io/projects/31104)
[![DeepSource](https://app.deepsource.com/gh/domx4q/astroProject.svg/?label=active+issues&show_trend=true&token=au7UeFncEauubfJgbm3Hk_zh)](https://app.deepsource.com/gh/domx4q/astroProject/?ref=repository-badge)
![LOC](https://raw.githubusercontent.com/domx4q/astroProject/image-data/loc.svg)
# Allgemein
Die angefertigte Projektarbeit ist [hier](Astronomie%20Projektarbeit.pdf) direkt verfügbar.
Sie kann auch vom [CFG Schülerlabor Astronomie](https://www.schuelerlabor-astronomie.de/) abgerufen werden.
Dort stehen noch weitere Informationen zu dieser Projektarbeit zur Verfügung.
## Hilfreiche <u>Links</u>
| Link                                   | Beschreibung                                             |
|----------------------------------------|----------------------------------------------------------|
| https://cloudster.online/              | (momentaner<sup>1</sup>) Zugang zur App                  |
| https://astro-project-pi.vercel.app/   | Zugang zur App [(Vercel)](https://vercel.com/)             |
| https://domx4q.github.io/astroProject/ | Zugang zur App [(GitHub Pages)](https://pages.github.com/) |

<sup>1</sup> Da ich für diesen Server zahlen muss, werde ich diesen eventuell kündigen, oder für andere Projekte nutzen. In diesem Fall wird der Link nicht mehr funktionieren.
Ich werde versuchen, falls das geschieht, dass hier zu vermerken.

# Installation
## Normale Installation
Für die normale Installation wird ein Docker Container benötigt. Dieser kann mit folgendem Befehl erstellt werden:
```
docker run -p 443:3000 -d -it -e SELFSIGNED=true --restart always domx4q/astro:autoGit
```
Wenn ein vorhandenes Zertifikat vorliegt, dann kann der Container mit dem folgenden Befehl mit dem Zertifikat gestartet werden:
```
docker run -p 443:3000 -d -it -v /path/to/certificates/cert.crt:/opt/certs/cert.crt:ro -v /path/to/certificates/privatekey.key:/opt/certs/cert.key:ro --restart always domx4q/astro:autoGit
```
Dabei muss `/path/to/certificates/cert.crt` durch den Pfad zur Zertifikatsdatei und `/path/to/certificates/privatekey.key` durch den Pfad zur privaten Schlüsseldatei ersetzt werden.
## Dev Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
