// Top-100 commonly used passwords blocklist (abbreviated sample for check)
const PASSWORD_BLOCKLIST = [
  'password', '12345678', '123456789', 'qwertyuiop', 'admin123',
  'letmein1', 'password123', 'welcome1', 'changeit', 'security',
];

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  feedback: string;
  isBlocked: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, feedback: '', isBlocked: false };
  }

  const isBlocked = PASSWORD_BLOCKLIST.includes(password.toLowerCase());
  if (isBlocked) {
    return { score: 0, feedback: 'This password is too common and easily guessed.', isBlocked: true };
  }

  let score = 0;
  const feedbacks: string[] = [];

  // Criteria 1: Length
  if (password.length >= 8) {
    score++;
  } else {
    feedbacks.push('Must be at least 8 characters long.');
  }

  // Criteria 2: Lower & Upper case
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedbacks.push('Include both uppercase and lowercase letters.');
  }

  // Criteria 3: Numbers
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedbacks.push('Include at least one number.');
  }

  // Criteria 4: Symbols
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    feedbacks.push('Include at least one special symbol.');
  }

  const feedbackMap = [
    'Weak (High risk)',
    'Fair (Add casing/numbers)',
    'Good (Almost secure)',
    'Strong (Secure)',
    'Excellent (Highly secure)'
  ];

  return {
    score,
    feedback: feedbacks[0] || feedbackMap[score] || 'Strong',
    isBlocked: false
  };
}
