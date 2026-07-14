const fetch = require("node-fetch");

async function test() {
  const res = await fetch("https://smart-waste-backend-l97b.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "doesnotexist123123@gmail.com", password: "password123" })
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
test();
