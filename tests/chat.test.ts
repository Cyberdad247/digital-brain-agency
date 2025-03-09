import request from 'supertest';

import app from '../backend/server';

test('POST /chat rejects invalid messages', async () => {
  const res = await request(app)
    .post('/chat')
    .send({ content: 'A'.repeat(600) });
  expect(res.statusCode).toBe(400);
});
