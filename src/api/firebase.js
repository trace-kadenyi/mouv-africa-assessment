// sign up with email and password
export async function signupWithEmailPassword(email, password) {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Signup failed");
  }

  return data.idToken;
}

// log in with email and password
export async function loginWithEmailPassword(email, password) {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Login failed");
  }

  return data.idToken;
}
