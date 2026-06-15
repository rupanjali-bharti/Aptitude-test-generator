function normalizeDifficulty(level) {
  if (!level || level === 'Mixed') {
    return null;
  }

  return String(level).trim().toLowerCase();
}

function buildDifficultyQuery(level) {
  const normalized = normalizeDifficulty(level);

  if (!normalized) {
    return {};
  }

  return {
    difficulty: { $regex: new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
  };
}

function resolveQuestionCount(value, fallback = 10) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

module.exports = {
  normalizeDifficulty,
  buildDifficultyQuery,
  resolveQuestionCount
};
