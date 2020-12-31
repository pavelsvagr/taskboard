const mongoose = require("mongoose")
const { PRIORITY_MEDIUM } = require("../../../../shared/constants/logsPriorities")
const logTypes = require("../../../../shared/constants/logsTypes")
const LogModel = require("../../model/models/Logs")

const Log = mongoose.model(LogModel.SCHEMA)

/**
 * Logs error into database
 * @param {Error} err
 * @param {Request} req
 * @param {string} priority
 * @return {Promise<void>}
 */
exports.logError = async (err, req, priority = PRIORITY_MEDIUM) => {
  const log = {
    [LogModel.ATTR_MESSAGE]: err.message,
    [LogModel.ATTR_PRIORITY]: priority,
    [LogModel.ATTR_EXCEPTION]: err.name,
    [LogModel.ATTR_URL]: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    [LogModel.ATTR_TYPE]: logTypes.error
  }
  if (req?.user?._id) {
    log[LogModel.ATTR_USER] = req.user._id
  }

  const logError = new Log(log)
  await logError.save()
}