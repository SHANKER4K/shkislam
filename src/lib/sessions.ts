const getSession = async (session_id) => {
  const response = await fetch(`http://localhost:8000/sessions/${session_id}`);
  return response.json();
};

const createSession = async () => {
  const response = await fetch(`http://localhost:8000/sessions/add`);
};
