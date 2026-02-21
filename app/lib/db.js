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

export async function createPattern(db, { creator_id, title, description, price, file_path }) {
    await db.prepare(
        "INSERT INTO patterns (creator_id, title, description, price, file_path) VALUES (?, ?, ?, ?, ?)"
    ).bind(creator_id, title, description, price, file_path).run();
}

export async function getPatternById(db, id) {
    return await db.prepare("SELECT * FROM patterns WHERE id = ?").bind(id).first();
}

export async function hasUserPurchasedPattern(db, userId, patternId) {
    const result = await db.prepare("SELECT id FROM authorizations WHERE buyer_id = ? AND pattern_id = ?").bind(userId, patternId).first();
    return !!result;
}

export async function createBlacklistEntry(db, { reported_user_id, reporter_id, reason }) {
    await db.prepare(
        "INSERT INTO blacklist (reported_user_id, reporter_id, reason) VALUES (?, ?, ?)"
    ).bind(reported_user_id, reporter_id, reason).run();
}

export async function getBlacklistEntry(db, id) {
    return await db.prepare("SELECT * FROM blacklist WHERE id = ?").bind(id).first();
}

export async function deleteBlacklistEntry(db, id) {
    await db.prepare("DELETE FROM blacklist WHERE id = ?").bind(id).run();
}
  ).bind(creator_id, title, description, price, file_path).run();

  // D1's meta.last_row_id is not reliable, so we can't easily get the ID.
  // For this use case, the caller might not need the full object back,
  // but if they did, we'd need a way to fetch it, perhaps by file_path if it's unique.
  // Returning the insert metadata for now.
  return meta;
}

export async function createBlacklistEntry(db, { reporter_id, reported_user_id, reason }) {
  const { meta } = await db.prepare(
    "INSERT INTO blacklist (reporter_id, reported_user_id, reason) VALUES (?, ?, ?)"
  ).bind(reporter_id, reported_user_id, reason).run();
  return meta;
}

export async function getBlacklistEntry(db, id) {
  const { results } = await db.prepare("SELECT * FROM blacklist WHERE id = ?").bind(id).all();
  return results.length ? results[0] : null;
}

export async function deleteBlacklistEntry(db, id) {
  const { meta } = await db.prepare("DELETE FROM blacklist WHERE id = ?").bind(id).run();
  return meta;
}
