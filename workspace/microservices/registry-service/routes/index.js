const express = require("express");
const Registry = require("../lib/Registry");

const router = express.Router();

const registry = new Registry();

const getRegistryParams = (req) => {
  return {
    serviceName: req.params.servicename,
    serviceVersion: req.params.serviceversion,
    // serviceIP: req.ip.replace(/[:a-z]/gi, ""),
    serviceIP: "127.0.0.1",
    servicePort: req.params.serviceport
  };
};

router.put(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res) => {
    console.log(req.ip);

    const { serviceIP, serviceName, servicePort, serviceVersion } =
      getRegistryParams(req);

    const serviceKey = registry.register(
      serviceName,
      serviceVersion,
      serviceIP,
      servicePort
    );

    return res.json({ result: serviceKey });
  }
);

router.delete(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res) => {
    const { serviceIP, serviceName, servicePort, serviceVersion } =
      getRegistryParams(req);

    const key = registry.unregister(
      serviceName,
      serviceVersion,
      serviceIP,
      servicePort
    );

    return res.json({ deleted: key });
  }
);

router.get("/find/:servicename/:serviceversion", (req, res) => {
  const { serviceName, serviceVersion } = getRegistryParams(req);

  const service = registry.get(serviceName, serviceVersion);

  if (!service)
    return res.status(404).json({ error: "No matching service found" });

  return res.json(service);
});

module.exports = router;
