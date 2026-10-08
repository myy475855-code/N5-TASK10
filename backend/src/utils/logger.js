function log(level, message, meta = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  }));
}
module.exports = { info: (m, x) => log("info", m, x), error: (m, x) => log("error", m, x) };