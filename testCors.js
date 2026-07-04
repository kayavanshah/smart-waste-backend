const testCors = async () => {
  try {
    const res = await fetch("https://smart-waste-backend-l97b.onrender.com/api/auth/register", {
      method: "OPTIONS",
      headers: {
        "Origin": "https://smart-waste-frontend-nine.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:");
    res.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });
  } catch(e) {
    console.error(e);
  }
};
testCors();
