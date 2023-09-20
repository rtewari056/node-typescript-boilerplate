import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        // If schema parsed successfully, call next()
        next();
    } catch (error: unknown) {
        // console.log('Zod schema error type => ', typeof e);
        
        // If it's a validation error
        if(error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error
            });
        }
        
        // Else return server error
        return next(error);
    }
};

export default validateResource;