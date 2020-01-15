import './LoadEnv'; // Must be the first import
import { logger } from './shared';
import app from './server';

// Start the server
const port = Number(process.env.PORT || 9000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
