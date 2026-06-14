export type AsyncHandler = (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<void>;
