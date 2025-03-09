module.exports = (req, res) => {
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
};
