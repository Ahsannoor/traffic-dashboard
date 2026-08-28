const scaleOrdinal = () => {
  const scale = () => "#000000";
  scale.domain = () => scale;
  scale.range = () => scale;
  return scale;
};

module.exports = { scaleOrdinal };
