import { NextFunction, Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class HealthController {

    @httpGet("/")
    public async health(_: Request, res: Response, __: NextFunction) {
        return res.end()
    }
}