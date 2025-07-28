import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// GET home page.

// Change to login page or dashboard?
router.get('/', function (req: Request, res: Response, next: NextFunction) {
    res.render('index', { title: 'Express' });
});

export default router;