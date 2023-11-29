module.exports = {
    // HOST: "localhost",
    HOST: "viaduct.proxy.rlwy.net",
    USER: "root",
    // PASSWORD: "",
    PASSWORD: "cgDD6BBAa6EHg-efAg6Eg1F25g4CbG1G",
    // DB: "cms",
    DB: "railway",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };