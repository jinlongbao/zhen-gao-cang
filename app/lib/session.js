
const sessions = {};

export const createSession = (email) => {
  const sessionId = String(Date.now());
  sessions[sessionId] = { email };
  return sessionId;
};

export const getSession = (sessionId) => {
  return sessions[sessionId];
};
