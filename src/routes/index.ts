import { Router } from 'express';
import Api1Router from './Api1';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/v1', Api1Router);

// Export the base-router
export default router;
