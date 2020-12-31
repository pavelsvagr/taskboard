const AppError = require("../../exceptions/AppError")

const SSE_RESPONSE_HEADER = {
  "Connection": "keep-alive",
  "Content-Type": "text/event-stream",
  "Cache-Control": process.env.NODE_ENV === "production" ? "no-cache" : "no-transform" // For dev server is no-transform needed
}

const MAX_STREAMS_PER_USER = 10
const HEARTBEAT_INTERVAL = 30 * 100 // 30 sec
const MAX_RESPONSE_INTERVAL = 50 * 1000 // 500 sec

const streams = {}

/**
 * @param {e.Request} req
 * @param {e.Response} res
 */
exports.createStream = (req, res) => {
  const userId = req.user._id

  // Creates stream header and save it
  res.writeHead(200, SSE_RESPONSE_HEADER)

  if (!streams[userId]) {
    streams[userId] = []
  }
  if (streams[userId].length >= MAX_STREAMS_PER_USER) {
    throw new AppError("Maximal number of streams reached. Notifications will be showed automatically.")
  }
  const stream = { res, lastUsed: null, id: Date.now() }
  streams[userId].push(stream)

  const heartbeat = { type: "heartbeat" }
  res.write(`data: ${JSON.stringify(heartbeat)}\n\n`)
  stream.lastUsed = Date.now()

  // Interval loop for invalidating
  const intervalId = setInterval(() => {
    if (!stream ||
      Date.now() - stream.lastUsed < MAX_RESPONSE_INTERVAL) {
      return
    }

    res.write(`data: ${JSON.stringify(heartbeat)}\n\n`)
    stream.lastUsed = Date.now()
  }, HEARTBEAT_INTERVAL)

  req.on("close", () => {
    clearInterval(intervalId)
    // Remove from connections
    const index = streams[userId].findIndex(s => s.id === stream.id)
    if (index) streams[userId].splice(index, 1)
    if (!streams[userId].length) {
      delete streams[userId]
    }
  })

  req.on("end", () => {
    clearInterval(intervalId)
    // Remove from connections
    const index = streams[userId].findIndex(s => s.id === stream.id)
    if (index) streams[userId].splice(index, 1)
    if (!streams[userId].length) {
      delete streams[userId]
    }
  })
}

/**
 * @param {string} userId
 * @param {object} data
 * @param {string} type
 * @return {Promise<void>}
 */
exports.sendEvent = async (userId, data, type) => {
  if (!userId || !streams[userId] || !data) {
    return
  }
  for (const stream of streams[userId]) {
    const { res } = stream

    res.write(`data: ${JSON.stringify({ type, data })}\n\n`)
    stream.lastUsed = Date.now()
  }
}