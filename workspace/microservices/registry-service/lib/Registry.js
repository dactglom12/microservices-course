const semver = require("semver");

class Registry {
  constructor() {
    this.services = {};
    this.timeout = 15;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);

    const services = Object.values(this.services);

    for (let i = 0; i < services.length; i++) {
      if (services[i].timestamp + this.timeout < now) {
        this.unregister(
          services[i].name,
          services[i].version,
          services[i].ip,
          services[i].port,
          `Service with name ${services[i].name} and ${services[i].version} version has been removed due to timeout`
        );
      }
    }
  }

  get(name, version) {
    this.cleanup();

    const candidates = Object.values(this.services).filter((service) => {
      return (
        service.name === name && semver.satisfies(service.version, version)
      );
    });

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name, version, ip, port) {
    this.cleanup();

    const key = this.#createKey(name, version, ip, port);

    if (this.services[key] === undefined) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);

      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].version = version;
      this.services[key].name = name;

      console.log(
        `Service with name ${name} and version ${version} has been registered, ${ip}:${port}`
      );

      return key;
    }

    this.services[key].timestamp = Math.floor(new Date() / 1000);

    console.log(`Updated name ${name} and version ${version}, ${ip}:${port}`);

    return key;
  }

  unregister(name, version, ip, port, logMessage = "") {
    const key = this.#createKey(name, version, ip, port);

    if (!this.services[key]) {
      console.log(`Service with name ${name} does not exist`);

      return;
    }

    delete this.services[key];

    if (logMessage) {
      console.log(logMessage);
    } else {
      console.log(`Deleted service with name ${name}`);
    }

    return key;
  }

  #createKey(name, version, ip, port) {
    return name + version + ip + port;
  }
}

module.exports = Registry;
