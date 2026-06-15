const { normalizeDifficulty, buildDifficultyQuery, resolveQuestionCount } = require('../utils/difficulty');

describe('difficulty helpers', () => {
  test('normalizes mixed and empty levels to no filter', () => {
    expect(normalizeDifficulty('Mixed')).toBeNull();
    expect(normalizeDifficulty('')).toBeNull();
    expect(normalizeDifficulty(undefined)).toBeNull();
  });

  test('builds a case-insensitive query for all supported difficulty levels', () => {
    expect(buildDifficultyQuery('Medium')).toEqual({
      difficulty: { $regex: /^medium$/i }
    });

    expect(buildDifficultyQuery('medium')).toEqual({
      difficulty: { $regex: /^medium$/i }
    });

    expect(buildDifficultyQuery('Easy')).toEqual({
      difficulty: { $regex: /^easy$/i }
    });

    expect(buildDifficultyQuery('Hard')).toEqual({
      difficulty: { $regex: /^hard$/i }
    });
  });

  test('resolves a safe number of questions from the request', () => {
    expect(resolveQuestionCount(12)).toBe(12);
    expect(resolveQuestionCount('15')).toBe(15);
    expect(resolveQuestionCount('0')).toBe(10);
    expect(resolveQuestionCount(undefined)).toBe(10);
  });
});
