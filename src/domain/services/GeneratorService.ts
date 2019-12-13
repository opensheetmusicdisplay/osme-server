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

export class GeneratorService {

    public generateExport(): string {
        const generatedSheet = this.generateDefault();
        const exporter = new XMLSourceExporter();
        const outputTxt = exporter.export(generatedSheet);
        return outputTxt.toString();
    }

    public generateDefault(): MusicSheet {
        const options: SourceGeneratorOptions = {
            complexity: 0.5,
            measure_count: 5,
            tempo: 145.0,
            time_signature: new RhythmInstruction(new Fraction(4, 4), RhythmSymbolEnum.COMMON),
            scale_key: ScaleKey.create(ScaleType.MAJOR, Tone.C),
            instruments: [DefaultInstrumentOptions.get('Part 1')],
        };
        const plugin: SourceGeneratorPlugin = new ExampleSourceGenerator(options);
        return plugin.generate();
    }

    public PitchSettings(): PitchSettings {
        return PitchSettings.HARMONIC();
    }

    public defaultDurationSettings(): DurationSettings {
        return DurationSettings.TYPICAL();
    }
}
