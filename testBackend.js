const testBackend = async () => {
  try {
    const res = await fetch("https://smart-waste-backend-l97b.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email: "test2@test.com", password: "password123" })
    });
    
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

testBackend();
