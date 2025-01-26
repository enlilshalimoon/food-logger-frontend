const ENV = {
    development: {
      BASE_URL: "http://34.133.139.84:3000", // Replace with your dev server's IP
    },
    production: {
      BASE_URL: "http://34.133.139.84:3000", // Replace with your production URLß
    },
  };
  
  const getEnvVars = () => {
    const releaseChannel = process.env.NODE_ENV || "development";
    return ENV[releaseChannel];
  };
  
  export default getEnvVars;