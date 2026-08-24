const getSession = async (session_id) => {
  const backend_url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${backend_url}/sessions/${session_id}`);
  return response.json();
};

const createSession = async () => {
  const backend_url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${backend_url}/sessions/add`);
};
