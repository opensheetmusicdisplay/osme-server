# Usage

## Run & Develop

Prepare  sources for production
```
npm install
npm postinstall
npm build
```

Start "compiled" sources for production:
```
npm start
```

Start in typescript mode for development:
```
npm start:dev
```
## API endpoints

### POST /api/v1/sheets/generate - Generate new sheet 

Generates a new MusicXML and stores it in internal cache.

A request must contain at least:
* measures
* time
* complexity
* tempo
* scale_tone
* scale_type

```json
{
  "measures": "Number of measures [16]",
  "time": "Number of Unit for Time, e.g 4/x [4/4]",
  "complexity": "Float between 0.0 and 1.0 to indicate complexity and difficulty [0.5]",
  "tempo": "Tempo in BPM [145]",
  "scale_tone": "Root tone of scale to be used [C]",
  "scale_type": "Scale type of scale [MAJOR]",
  "pitch_settings": "Array of pitch DistributionValue pairs [[$index, $freq]...] where $index ∈ [0,12] and $freq is float",
  "duration_settings": "Array of duration DistributionValue pairs [[key, $freq]...] where $key ∈ ['1/32', '1/16', .. '1/1'] and $freq is float"
}
```
See the examples for further details:

* [schema with description]("doc/example2.json")
* [example request]("doc/example1.json")

### GET /api/v1/sheets/ - Listing existing sheets 

The server will return a list of all existing, generated MusicXML with their URLs.
URLs can be used to retrieve them directly out or internal storage

### GET /api/v1/sheets/:id - Retrieve existing MusicXML

A MusicXML is returned. This link should also work in browsers and signalise them a "download" or "save as.." event.
Files can be downloaded and opened directly in your favorite MusicXML viewer, 
e.g. [MuseScore](https://musescore.org/) or embedded it on your websites via [Opensheetmusicdisplay](https://opensheetmusicdisplay.org/)

### GET /api/v1/sheets/generate/example/1 - Example & Schema

Useful for the first steps when integrating this API in your ecosystem

Prints out a sample request with description like [example schema]("doc/example2.json")
