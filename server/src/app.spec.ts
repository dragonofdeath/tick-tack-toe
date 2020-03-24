import request from 'supertest';

import { getApp } from './app';

describe('/api/actions', () => {
    const action1 = { row: 0, column: 0 };
    const action2 = { row: 1, column: 1 };
    const action3 = { row: 2, column: 2 };
    it('returns empty array on initial state with api/list endpoint', async () => {
        const app = getApp();
        const responseList = await request(app).get('/api/actions/list');
        expect(responseList.status).toBe(200);
        expect(responseList.body).toEqual([]);
    });

    it('accepts posted action on actions/new endpoint and returns it in list', async () => {
        const app = getApp();
        const responseNew = await request(app).post('/api/actions/new').send(action1);
        expect(responseNew.status).toBe(200);

        const responseList = await request(app).get('/api/actions/list');
        expect(responseList.status).toBe(200);
        expect(responseList.body).toEqual([action1]);
    });

    it('accepts multiple actions and returns them in correct order', async () => {
        const app = getApp();
        await request(app).post('/api/actions/new').send(action1);
        await request(app).post('/api/actions/new').send(action2);
        await request(app).post('/api/actions/new').send(action3);

        const responseList = await request(app).get('/api/actions/list');
        expect(responseList.body).toEqual([action1, action2, action3]);
    });

    it('clears all actions with actions/clear endpoint', async () => {
        const app = getApp();
        await request(app).post('/api/actions/new').send(action1);
        await request(app).post('/api/actions/new').send(action2);
        await request(app).post('/api/actions/new').send(action3);

        const responseClear = await request(app).post('/api/actions/clear');
        expect(responseClear.status).toBe(200);
        const responseList = await request(app).get('/api/actions/list');
        expect(responseList.body).toEqual([]);
    });
});
