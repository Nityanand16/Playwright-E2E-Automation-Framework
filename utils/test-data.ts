export function generateTestData() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);

  return {
    email: `qa_${timestamp}_${random}@mailinator.com`,
    password: `Qa@${random}${timestamp}A`,
  };
}

export function generateRandomName() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  return {
    firstName: `Test${random}`,
    lastName: `User${timestamp}`,
  };
}