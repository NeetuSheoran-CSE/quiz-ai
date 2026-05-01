

export async function callClaude(data) {
  const res = await fetch("AIzaSyAQIcajLGCK3oyuuXXqFk5JecDstQsooPE", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}