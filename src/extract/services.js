function extract(config) {
  const services = [];
  for(const i in config) {
    if(Array.isArray(config[i].target)) {
      for(const j in config[i].target) {
        for(const r in config[i].action) {
          services.push({
            target: (typeof config[i].target[j]) === 'string' ? new RegExp(config[i].target[j]) : config[i].target[j],
            name: config[i].action[r],
            generated: false,
          })
        }
      }
    } else {
      for(const j in config[i].action) {
        services.push({
          target: config[i].target,
          name: config[i].action[j],
          generated: false,
        })
      }
    }
  }

  return services;
}


module.exports = {
  extract,
};