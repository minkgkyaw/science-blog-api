import toobusy_js from "toobusy-js";

export const toobusyServer = (createHttpError) => (_req, _res, next) => {
  if(toobusy_js()) return next(createHttpError(503))
  return next();
}