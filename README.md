# BACS-screening Vlaanderen

Nederlandstalige webapplicatie waarmee een energieadviseur tijdens een klantbezoek nagaat of een niet-residentieel gebouw onder de Vlaamse BACS-verplichting valt, het gekoppelde verwarmings- en koelvermogen berekent, een technische screening uitvoert (eisen A–G of methode 2), tekortkomingen en oplossingen oplijst en een klantenrapport opmaakt.

> **Screeningstool.** De uitkomst vervangt geen formele keuring, geen inspectie door een energiedeskundige, geen juridisch advies en geen officiële conformiteitsverklaring.

## Snel starten

**Zonder installatie:** open `dist/bacs-screening.html` in een recente browser (Chrome, Edge, Firefox, Safari). Alles zit in dat ene bestand; het werkt ook offline (lettertypes vallen dan terug op systeemlettertypes).

**Met Node 18+ (ontwikkeling):**

```bash
npm test            # 35 automatische tests (rekenregels, beslissingsboom, ontbrekende/tegenstrijdige data)
npm run build       # maakt index.html, dist/bacs-screening.html en dist/artifact.html
npm run examples    # schrijft voorbeeldrapporten en voorbeelddossiers in examples/
npm start           # lokale server op http://localhost:8080 (optioneel)
```

Bij de eerste start laadt de app drie fictieve voorbeelddossiers:

| Dossier | Situatie | Verwachte uitkomst |
|---|---|---|
| Basisschool De Linde | Werkvoorbeeld: 2 × 180 kW gekoppelde ketels, 90 kW koeling | Potentieel plichtig op basis van verwarming (360 kW), koeling 90 kW onder drempel, 70 kW-drempel afzonderlijk overschreden |
| Administratief centrum | 2 gebouwen; annex met ontbrekend vermogen en onbekende koppeling | Stadhuis plichtig (310 kW), annex onvolledig |
| Woonzorgcentrum | 240 kW verwarming, 85 kW koeling, installaties van een ESCO | Niet plichtig onder 290 kW, wel boven 70 kW |

## Projectstructuur

```
src/config.js          wettelijke parameters, eisen A–G, checklist, oplossingen (standaard)
src/engine.js          reken- en beslismotor, validatie, gapanalyse, rapporten (puur, ook in Node)
src/sample-data.js     voorbeelddossiers
src/app.js             gebruikersinterface (wizard, dashboard, beheer)
src/styles.css         opmaak (licht en donker thema)
tests/engine.test.js   automatische tests (node:test)
scripts/               build, voorbeeldrapporten, lokale server
docs/ONTWERP.md        architectuur, schermen, datamodel, beslisregels, checklist, rapportmodel
examples/              klantenfiche, technisch rapport en dossiers als JSON
dist/                  gebouwde versies
```

## Gebruik in het kort

1. **Dossiers** → *Nieuwe snelle screening* of *Nieuwe dieptescreening*.
2. Doorloop de stappen. Het paneel rechts toont live de uitkomst, de meters t.o.v. 70 en 290 kW, en wat ontbreekt of tegenstrijdig is.
3. Leg in *Structuur en groepen* vast welke opwekkers hydraulisch of koeltechnisch gekoppeld zijn. Alleen die worden samengeteld.
4. *Rapport* → klantenfiche of technisch rapport; download als HTML of druk af als PDF.
5. Dossiers worden automatisch in de browser bewaard. Gebruik *Exporteer* voor een back-up of om op een ander toestel verder te werken (*Dossier importeren*).

## Wettelijke parameters aanpassen

- **In de app:** *Beheer* → drempels, termijnen, disclaimer via het formulier, of de volledige configuratie (eisen, items, oplossingen, checklist, fases, bronnen) als JSON. De app valideert de structuur voor ze iets toepast. Exporteer de configuratie om ze op andere toestellen te importeren.
- **Voor iedereen (standaard):** pas `src/config.js` aan, verhoog `configVersie` en `geraadpleegdOp`, en voer `npm test && npm run build` uit.

Elke rapport vermeldt de configuratieversie en de raadpleegdatum van de bronnen.

## Verder uitbreiden

- Nieuwe eis of item: voeg het toe in `config.js` → het verschijnt automatisch in de screening, de gapanalyse en de rapporten.
- Nieuwe controle op tegenstrijdige gegevens: voeg ze toe in `validate()` in `engine.js`, met een test in `tests/engine.test.js`.
- Server en meerdere gebruikers: vervang het `store`-object in `app.js` door API-aanroepen; zie `docs/ONTWERP.md` §8.

## Bronnen

- [Gebouwautomatisering en controlesystemen voor niet-residentiële gebouwen verplicht tegen eind 2025](https://www.vlaanderen.be/gebouwautomatisering-en-controlesystemen-voor-niet-residentiele-gebouwen-verplicht-tegen-eind-2025)
- [Technische vereisten voor een BACS](https://www.vlaanderen.be/gebouwautomatisering-en-controlesystemen-voor-niet-residentiele-gebouwen-verplicht-tegen-eind-2025/technische-vereisten-voor-een-bacs-building-automation-and-control-system)
- Regelgeving: artikel 11.1/1.2 Energiedecreet en artikel 9.4.1 Energiebesluit.
