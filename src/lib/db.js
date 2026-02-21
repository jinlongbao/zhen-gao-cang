const roles = {
    1: 'buyer',
    2: 'creator',
    3: 'admin',
};

let userIdCounter = 3;
const users = [
    {
        id: 1,
        email: 'creator@test.com',
        password: 'password', // In a real app, this would be a hash
        roleId: 2
    },
    {
        id: 2,
        email: 'buyer@test.com',
        password: 'password',
        roleId: 1
    }
];

let patternIdCounter = 1;
const patterns = [
    { id: 1, title: 'My First Pattern', price: 1.99, filePath: 'mock-pattern-1.pdf', creatorId: 1 },
];

// Mock purchases table
const purchases = [
    { userId: 2, patternId: 1 },
];

export const findUser = (email) => {
    const user = users.find(user => user.email === email);
    if (user) {
        return { ...user, role: roles[user.roleId] };
    }
    return undefined;
};

export const addUser = (user) => {
  // In a real app, we'd do more validation.
  // We'll assign a default role of 'buyer'.
  const newUser = { id: userIdCounter++, ...user, roleId: 1, role: 'buyer' };
  users.push(newUser);
  return newUser;
};

export const addPattern = (pattern) => {
    const newPattern = { id: patternIdCounter++, ...pattern };
    patterns.push(newPattern);
    return newPattern;
};

export const findPatternById = (id) => {
    // eslint-disable-next-line eqeqeq
    return patterns.find(p => p.id == id);
};

export const userHasPurchasedPattern = (userId, patternId) => {
    // MOCK: In a real app, you'd query a purchases table.
    console.log(`Checking if user ${userId} purchased pattern ${patternId}`);
    // eslint-disable-next-line eqeqeq
    const hasPurchased = purchases.some(p => p.userId == userId && p.patternId == patternId);

    // Also, creators can always download their own patterns.
    const pattern = findPatternById(patternId);
    if (pattern && pattern.creatorId === userId) {
        return true;
    }

    return hasPurchased;
};