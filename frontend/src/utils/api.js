import { getTests as getLocalTests, getTestById as getLocalTestById, submitAttempt as submitLocalAttempt, getStats as getLocalStats } from '../data/testData';

export const getTests = async () => {
  return { success: true, data: getLocalTests() };
};

export const getTestById = async (testId, includeAnswers = false) => {
  const test = getLocalTestById(testId, includeAnswers);
  if (!test) return { success: false, message: 'Test not found' };
  return { success: true, data: test };
};

export const submitAttempt = async (payload) => {
  return submitLocalAttempt(payload);
};

export const getAttemptById = async () => {
  return { success: false, message: 'Local attempt storage not implemented' };
};

export const getStats = async () => {
  return { success: true, data: getLocalStats() };
};