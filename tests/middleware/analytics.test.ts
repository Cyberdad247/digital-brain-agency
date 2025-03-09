import { analyticsLogger } from '../../middleware/analytics';

Bun.test('analyticsLogger calls next', () => {
  let nextCalled = false;
  const mockReq = { method: 'GET', url: '/test' };
  const mockRes = {};
  const mockNext = () => {
    nextCalled = true;
  };

  analyticsLogger(mockReq, mockRes, mockNext);

  if (!nextCalled) {
    throw new Error('Expected next() to be called');
  }
});
