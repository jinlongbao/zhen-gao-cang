
import { addUser, findUser } from '../../lib/db.js';
import { hashPassword } from '../../lib/auth.js';

export default async function register(req, res) {
  const { email, password } = req.body;

  if (findUser(email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);
  addUser({ email, password: hashedPassword });

  res.status(201).json({ message: 'User created' });
}
