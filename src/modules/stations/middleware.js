import response from '../generates/response';
import stationService from './service';
export class StationMiddleware {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
   */
  async checkIfStationExist(req, res, next) {
    try {
      const { id } = req.params;
      const createTimeTableUrl = '/api/v1/timetable';
      const updateTimeTableUrl = `/api/v1/timetable/${id}`;
      const manageURL =
        req.originalUrl === createTimeTableUrl || req.originalUrl === updateTimeTableUrl ? req.body.station : id;
      const verifyId = await stationService.findOne({ where: { id: manageURL } });
      if (!verifyId) {
        return response.errorResponse({
          res,
          status: 400,
          data: response.customValidationMessage({
            msg: 'Station could not be found',
            param: req.originalUrl === createTimeTableUrl || req.originalUrl === updateTimeTableUrl ? 'station' : 'id',
          }),
        });
      }
      next();
    } catch (error) {
      return response.errorResponse({ res, status: 500, data: response.serverError('Something went wrong') });
    }
  }
  async checkIfStationNameExist(req, res, next) {
    try {
      const { name } = req.body;
      const trimedName = name.toLowerCase().trim();
      const verifyName = await stationService.findOne({ where: { name: trimedName } });
      if (verifyName) {
        return response.errorResponse({
          res,
          status: 409,
          data: response.customValidationMessage({ msg: 'Station Name already exist', param: 'name' }),
        });
      }
      next();
    } catch (error) {
      return response.errorResponse({ res, status: 500, data: response.serverError('Something went wrong') });
    }
  }
}

export default new StationMiddleware();
