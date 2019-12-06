import {ScaleKey, ScaleType, Tone} from 'osme/build/dist/src/OSME/Common';
import {RhythmInstruction, RhythmSymbolEnum} from 'osme/build/dist/src/MusicalScore/VoiceData/Instructions';
import {XMLSourceExporter} from 'osme/build/dist/src/OSME/SourceExporter/XMLSourceExporter';
import {MusicSheet} from 'osme/build/dist/src/MusicalScore';
import {Fraction} from 'osme/build/dist/src/Common/DataObjects';
import {SourceGeneratorOptions} from 'osme/build/dist/src/OSME/SourceGenerator/SourceGeneratorParameters';
import {DefaultInstrumentOptions} from 'osme/build/dist/src/OSME/SourceGenerator/SourceGeneratorParameters';
import {PitchSettings} from 'osme/build/dist/src/OSME/SourceGenerator/SourceGeneratorParameters';
import {DurationSettings} from 'osme/build/dist/src/OSME/SourceGenerator/SourceGeneratorParameters';
import {SourceGeneratorPlugin} from 'osme/build/dist/src/OSME/SourceGenerator/SourceGeneratorPlugin';
import {ExampleSourceGenerator} from 'osme/build/dist/src/OSME/SourceGenerator/ExampleSourceGenerator';

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
