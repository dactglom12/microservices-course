const axios = require("axios");
const config = require("../config");

class RegistryClient {
  static async getService(serviceName) {
    try {
      const response = await axios.get(
        `${config.registry.url}/find/${serviceName}/${config.registry.version}`
      );

      if (!response.data.ip) {
        throw new Error("Could not find such service");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;

      console.error(errorMessage);

      throw new Error(errorMessage);
    }
  }

  static async callService(serviceName, requestOptions) {
    const { ip, port } = await this.getService(serviceName);

    // eslint-disable-next-line no-param-reassign
    requestOptions.url = `http://${ip}:${port}${requestOptions.url}`;

    try {
      const response = await axios(requestOptions);

      return response.data;
    } catch (error) {
      console.error(error);

      const errorMessage =
        (error.response && error.response.data) || error.message;

      console.error(errorMessage);

      throw new Error(errorMessage);
    }
  }
}

module.exports = RegistryClient;
