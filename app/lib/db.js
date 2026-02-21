export async function getUserByUsername(db, username) {
  const { results } = await db.prepare("SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE username = ?").bind(username).all();
  return results.length ? results[0] : null;
}

export async function createUser(db, { username, password, role }) {
    const roleIdResult = await db.prepare("SELECT id FROM roles WHERE name = ?").bind(role).first();
    if (!roleIdResult) {
        throw new Error(`Role '${role}' not found.`);
    }
    const role_id = roleIdResult.id;

    // In a real app, hash the password!
    const password_hash = password; 

    const { meta } = await db.prepare(
        "INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)"
    ).bind(username, password_hash, role_id).run();
    
    // D1 doesn't easily return the last inserted row, so we fetch it.
    const newUser = await getUserByUsername(db, username);
    return newUser;
}
