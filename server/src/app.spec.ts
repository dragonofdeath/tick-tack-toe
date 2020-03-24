import request from 'supertest';

import { getApp } from './app';

describe('/api/v1/test', () => {
    it('works', async () => {
        const app = getApp();
        const res = await request(app).get('/api/v1/test');
        const { ok } = res.body;
        expect(res.status).toBe(200);
        expect(ok).toBe(true);
    });
});
