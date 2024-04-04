[![Codespaces Prebuilds](https://github.com/domx4q/astroProject/actions/workflows/codespaces/create_codespaces_prebuilds/badge.svg)](https://github.com/domx4q/astroProject/actions/workflows/codespaces/create_codespaces_prebuilds)
[![Docker Image CI](https://github.com/domx4q/astroProject/actions/workflows/docker-image.yml/badge.svg)](https://github.com/domx4q/astroProject/actions/workflows/docker-image.yml)

[![CodeScene Code Health](https://codescene.io/projects/31104/status-badges/code-health)](https://codescene.io/projects/31104)
[![DeepSource](https://app.deepsource.com/gh/domx4q/astroProject.svg/?label=active+issues&show_trend=true&token=au7UeFncEauubfJgbm3Hk_zh)](https://app.deepsource.com/gh/domx4q/astroProject/?ref=repository-badge)
![LOC](https://raw.githubusercontent.com/domx4q/astroProject/image-data/loc.svg)

# Allgemein

Die angefertigte Projektarbeit im Rahmen des Astronomie-Projektkurses kann [hier](Astronomie%20Projektarbeit.pdf)
direkt eingesehen werden. Sie kann auch
vom <nobr>[CFG Schülerlabor Astronomie](https://www.schuelerlabor-astronomie.de/)</nobr>
abgerufen werden. Dort stehen noch weitere Informationen über die Projektarbeit zur Verfügung.

Die <nobr>[Besondere Lernleistung](Besondere%20Lernleistung.pdf)</nobr> ist ebenfalls in dieser GitHub Repository zu
finden.

## Hilfreiche <u>Links</u>

| Link                                   | Beschreibung                                               |
|----------------------------------------|------------------------------------------------------------|
| https://cloudster.online/astro/        | (momentaner<sup>1</sup>) Zugang zur App                    |
| https://astro-project-pi.vercel.app/   | Zugang zur App [(Vercel)](https://vercel.com/)             |
| https://domx4q.github.io/astroProject/ | Zugang zur App [(GitHub Pages)](https://pages.github.com/) |

<sup>1</sup> Da ich für diesen Server zahlen muss, werde ich diesen eventuell kündigen, oder für andere Projekte nutzen.
In diesem Fall wird der Link nicht mehr funktionieren. Ich werde versuchen, falls es dazu kommt, diese Änderung hier zu
vermerken.

## QR-Codes

Für Präsentationen oder ähnliches können die folgenden QR-Codes verwendet werden.

<table width="100%">
  <thead>
    <tr>
      <th width="33.3%">App</th>
      <th width="33.3%">Sternenscheibe</th>
      <th width="33.3%">Sonnenkuppel</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="33.3%"><img src=".github/images/qrcode_astro_main.png" alt="QR-Code zur App"/></td>
      <td width="33.3%"><img src=".github/images/qrcode_astro_stars.png" alt="QR-Code zur Sternenscheibe"/></td>
      <td width="33.3%"><img src=".github/images/qrcode_astro_sun.png" alt="QR-Code zur Sonnenkuppel"/></td>
    </tr>
  </tbody>
</table>

# Installation

## Normale Installation

Für die normale Installation wird ein Docker Container benötigt. Dieser kann mit folgendem Befehl erstellt werden:

```
docker run -p 443:3000 -d -it -e SELFSIGNED=true --restart always domx4q/astro:autoGit
```

Wenn ein vorhandenes Zertifikat vorliegt, dann kann der Container mit dem folgenden Befehl mit dem Zertifikat gestartet
werden:

```
docker run -p 443:3000 -d -it -v /path/to/certificates/cert.crt:/opt/certs/cert.crt:ro -v /path/to/certificates/privatekey.key:/opt/certs/cert.key:ro --restart always domx4q/astro:autoGit
```

Dabei muss `/path/to/certificates/cert.crt` durch den Pfad zur Zertifikatsdatei
und `/path/to/certificates/privatekey.key` durch den Pfad zur privaten Schlüsseldatei ersetzt werden.
***

## Eigene Weiterentwicklung

Wenn sich die Datei `package.json` geändert hat und auch bei der Ersteinrichtung, ist es nötig den folgenden Befehl
auszuführen, da die neuen Abhängigkeiten installiert werden müssen.

```
npm install
```

### Live-Server

Um die getätigten Änderungen live zu sehen, kann der folgende Befehl verwendet werden. Dieser Server muss nach einer
Änderung nicht neu gestartet werden, da dieser die Änderungen automatisch erkennt und basierend auf diesen,
unterschiedliche Teile des Servers neu lädt.

```
npm run serve
```

### Erstellen der App (Build)

Um die App zu erstellen, kann der folgende Befehl verwendet werden. Dieser erstellt die App in das Verzeichnis `dist/`.
Dabei wird das Resultat optimiert und minimiert, um die beste Performance in der Produktionsumgebung zu erreichen.

```
npm run build
```

### Formatierung des Codes

Um den Code zu formatieren, kann der folgende Befehl verwendet werden. Dabei werden vordefinierte Regeln aus der Datei
`.eslintrc.js` angewendet.

```
npm run lint
```
