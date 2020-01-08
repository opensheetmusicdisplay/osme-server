/* tslint:disable:variable-name */
import {logger} from '@shared';
import {Request, Response, Router} from 'express';
import {BAD_REQUEST, OK} from 'http-status-codes';
import {GeneratorService} from '../domain/services/GeneratorService';

// Init shared
const router = Router();

const generatorService = new GeneratorService();

export class GenerateRequest {
    public measures: number = 1;
    public time: string = '';
    public complexity: number = 0.1;
    public tempo: number = 100.0;
    public scale_tone: string = '';
    public scale_type: string = '';
    public pitch_settings: any[] = new Array<any>();
    public duration_settings: any[] = new Array<any>();
}

router.post('/sheets/generate', async (req: Request, res: Response) => {
    try {
        const request = req.body as GenerateRequest;
        const xmlBody: string = generatorService.generateExport(request);
        return res.status(OK).send(xmlBody);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

router.get('/sheets/generate/example/1', async (req: Request, res: Response) => {
    try {
        return res.status(OK).json({
            measures: 'Number of measures [16]',
            time: 'Number of Unit for Time, e.g 4/x [4/4]',
            complexity: 'Float between 0.0 and 1.0 to indicate complexity and difficulty [0.5]',
            tempo: 'Tempo in BPM [145]',
            scale_tone: 'Root tone of scale to be used [C]',
            scale_type: 'Scale type of scale [MAJOR]',
            pitch_settings: [
                [0, 0.3],
                [1, 0.05],
                [2, 0.1],
                [3, 0.1],
                [4, 0.1],
                [5, 0.2],
                [6, 0.05],
                [7, 0.1],
            ],
            duration_settings: [
                ['1/16', 0.1],
                ['1/8', 0.3],
                ['1/4', 0.3],
                ['1/2', 0.2],
                ['1/1', 0.1],
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
