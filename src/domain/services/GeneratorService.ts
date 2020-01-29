/* tslint:disable:variable-name no-console */
import {Fraction, MusicSheet, RhythmInstruction, RhythmSymbolEnum} from 'opensheetmusicdisplay';
import {
    DefaultInstrumentOptions,
    DurationSettings,
    ExampleSourceGenerator,
    PitchSettings,
    ScaleKey,
    ScaleType,
    SourceGeneratorOptions,
    SourceGeneratorPlugin,
    Tone,
    XMLSourceExporter,
} from 'osme';
import {GenerateRequest} from '../../routes/Api1';
import {DistributionEntry} from 'osme/lib/OSME/Common/Distribution';
import fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;

export class GeneratorService {

    private files: Set<string>;
    private dirPrefix: string = '/tmp/';

    constructor() {
        this.files = new Set();
    }

    public generateExport(request: GenerateRequest): string {
        const generatedSheet = this.generateWithRequest(request);
        const exporter = new XMLSourceExporter();
        const outputTxt = exporter.export(generatedSheet);

        this.saveFile(outputTxt, generatedSheet.TitleString);
        return outputTxt.toString();
    }

    public generateWithRequest(request: GenerateRequest): MusicSheet {
        this.validate(request);

        const timeFraction = this.parseFraction(request.time);
        const scaleTone = this.parseScaleTone(request.scale_tone);
        const scaleType = this.parseScaleType(request.scale_type);
        const pitchSettings = this.parsePitchSettings(request.pitch_settings);
        const durationSettings = this.parseDurationSettings(request.duration_settings);

        const options: SourceGeneratorOptions = {
            complexity: request.complexity,
            measure_count: request.measures,
            tempo: request.tempo,
            time_signature: new RhythmInstruction(timeFraction, RhythmSymbolEnum.COMMON),
            scale_key: ScaleKey.create(scaleType, scaleTone),
            instruments: [DefaultInstrumentOptions.get('Part 1')],
            pitch_settings: pitchSettings,
            duration_settings: durationSettings,
        };
        const plugin: SourceGeneratorPlugin = new ExampleSourceGenerator(options);
        return plugin.generate();
    }

    public generateDefault(): MusicSheet {
        const options: SourceGeneratorOptions = {
            complexity: 0.5,
            measure_count: 5,
            tempo: 145.0,
            time_signature: new RhythmInstruction(
                new Fraction(4, 4),
                RhythmSymbolEnum.COMMON,
            ),
            scale_key: ScaleKey.create(ScaleType.MAJOR, Tone.C),
            instruments: [DefaultInstrumentOptions.get('Part 1')],
        };
        const plugin: SourceGeneratorPlugin = new ExampleSourceGenerator(options);
        return plugin.generate();
    }

    private parsePitchSettings(values: any[]): PitchSettings {
        const entries = values.map((value) => {
            const [key, weight] = value;
            return new DistributionEntry(key, weight);
        });

        if (entries.length > 0) {
            return new PitchSettings(0.5, entries);
        } else {
            return PitchSettings.HARMONIC();
        }
    }

    private parseDurationSettings(values: any[]): DurationSettings {
        const entries = values.map((value) => {
            const [key, weight] = value;
            const fraction = this.parseFraction(key);
            return new DistributionEntry(fraction, weight);
        });

        if (entries.length > 0) {
            return new DurationSettings(0.5, entries);
        } else {
            return DurationSettings.TYPICAL();
        }
    }

    private validate(request: GenerateRequest) {
        this.assertBetween('complexity', request.complexity, 0.0, 1.0);
        this.assertBetween('measures', request.measures, 1, 128);
        this.assertBetween('tempo', request.tempo, 20, 320);
        this.assetFraction('time', request.time);
    }

    private assertBetween(name: string, value: number, start: number, end: number) {
        if (value < start || value > end) {
            throw new Error(`${name} has a value (${value}) not between ${start} and ${end}`);
        }
    }

    private assetFraction(name: string, value: string) {
        if (!value.includes('/')) {
            throw new Error(`${name} is not a valid Fraction: ${value} instead of "x/y"`);
        }

        const splits = value.split('/');
        this.assertBetween(`$name-Fraction`, Number(splits[0]), 1, 16);
        this.assertBetween(`$name-Fraction`, Number(splits[1]), 1, 16);
    }

    private parseFraction(value: string) {
        const splits = value.split('/');
        const numerator = Number(splits[0]);
        const denominator = Number(splits[1]);
        return new Fraction(numerator, denominator, 0, false);
    }

    private parseScaleTone(scaleTone: string): Tone {
        switch (scaleTone.toLowerCase()) {
            case 'c':
                return Tone.C;
            case 'd':
                return Tone.D;
            case 'e':
                return Tone.E;
            case 'f':
                return Tone.F;
            case 'g':
                return Tone.G;
            case 'a':
                return Tone.A;
            case 'b':
                return Tone.B;
            default:
                return Tone.C;
        }
    }

    private parseScaleType(scaleTone: string): ScaleType {
        switch (scaleTone.toUpperCase()) {
            case 'MAJOR':
                return ScaleType.MAJOR;
            case 'MINOR_HARMONIC':
                return ScaleType.MINOR_HARMONIC;
            case 'MINOR_MELODIC':
                return ScaleType.MINOR_MELODIC;
            case 'MINOR_NATURAL':
                return ScaleType.MINOR_NATURAL;
            default:
                return ScaleType.MAJOR;
        }
    }

    private saveFile(outputTxt: string, title: string) {
        const timestamp = Math.floor(Date.now() / 1000);
        const path = timestamp + '.musicxml';
        // @ts-ignore
        fs.writeFile(this.dirPrefix + path, outputTxt, (err: ErrnoException) => {
            if (err) {
                // tslint:disable-next-line:no-console
                return console.log(err);
            }
            // tslint:disable-next-line:no-console
            console.log('The file was saved: ' + path);
            this.files.add(path);
            // tslint:disable-next-line:no-console
            console.log(this.files);
        });
    }

    public getFileList(prefix: string): Map<string, string> {
        const urlMap: Map<string, string> = new Map();
        this.files.forEach((key, value) => {
            const url = prefix + key;
            urlMap.set(key, url);
        });

        console.log(this.files);
        console.log(urlMap);
        return urlMap;
    }

    public getFileOutput(path: string): string {
        const file = this.getFilePath(path);

        const fileData = fs.readFileSync(file, {encoding: 'UTF-8'});
        // tslint:disable-next-line:no-console
        console.log('The file was returned: ' + path);
        return fileData;
    }

    public getFilePath(path: string): string {
        if (!this.files.has(path)) {
            throw Error('File not found');
        }
        return this.dirPrefix + path;
    }
}
