const ENV = {
    development: {
      BASE_URL: "http://192.168.1.38:3000", // Replace with your dev server's IP
    },
    production: {
      BASE_URL: "https://your-production-server.com", // Replace with your production URL
    },
  };
  
  const getEnvVars = () => {
    const releaseChannel = process.env.NODE_ENV || "development";
    return ENV[releaseChannel];
  };
  
  export default getEnvVars;