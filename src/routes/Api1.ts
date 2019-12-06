import {logger} from '@shared';
import {Request, Response, Router} from 'express';
import {BAD_REQUEST, OK} from 'http-status-codes';
import {GeneratorService} from '../domain/services/GeneratorService';

// Init shared
const router = Router();

const generatorService = new GeneratorService();

router.post('/sheets/generate', async (req: Request, res: Response) => {
    try {
        const xmlBody: string = generatorService.generateExport();
        return res.status(OK).send(xmlBody);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

router.get('/sheets/generate', async (req: Request, res: Response) => {
    try {
        return res.status(OK).json({
            measures: 'Number of measures [16]',
            time_numerator: 'Number of Unit for Time, e.g 4/x [4]',
            time_denominator: 'Number of Unit for Time FracFviewstion, e.g. x/4 [4]',
            complexity: 'Float between 0.0 and 1.0 to indicate complexity and difficulty [0.5]',
            tempo: 'Tempo in BPM [145]',
            scale_tone: 'Root tone of scale to be used [C]',
            scale_type: 'Scale type of scale [MAJOR]',
            pitch_settings: [
                {0: '0.1'},
                {1: '0.1'},
                {2: '0.1'},
                {3: '0.1'},
                {4: '0.1'},
                {5: '0.1'},
                {6: '0.1'},
                {7: '0.1'},
            ],
            duration_settings: [
                {'1/16': '0.1'},
                {1: '0.1'},
                {2: '0.1'},
                {3: '0.1'},
                {4: '0.1'},
                {5: '0.1'},
                {6: '0.1'},
                {7: '0.1'},
            ],
        });
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
