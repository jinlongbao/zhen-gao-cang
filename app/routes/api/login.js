
import { findUser } from '../../lib/db.js';
import { comparePassword } from '../../lib/auth.js';
import { createSession } from '../../lib/session.js';

export default async function login(req, res) {
  const { email, password } = req.body;

  const user = findUser(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const sessionId = createSession(email);
  res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/`);
  res.status(200).json({ message: 'Logged in' });
}
