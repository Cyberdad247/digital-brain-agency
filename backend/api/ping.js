module.exports = (req, res) => {
  return res.json({
    pong: true,
    time: new Date().toISOString(),
  });
};
