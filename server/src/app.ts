import express from 'express';
import bodyParser from 'body-parser';

// IN-MEMORY DATBASE!!! ;)
const createDatabase = <T>() => {
    let data: T[] = [];
    return {
        list: () => data,
        insert: (val: T) => {
            data = [...data, val];
        },
        clear: () => {
            data = [];
        },
    };
};

type Action = {
    column: number;
    row: number;
};

export const getApp = () => {
    const app = express();
    app.use(bodyParser.json());

    const database = createDatabase<Action>();

    app.get<{}, Action[]>('/api/actions/list', (_, response) => {
        response.json(database.list());
    });

    app.post<{}, string, Action>('/api/actions/new', (request, response) => {
        database.insert(request.body);
        response.json('ok');
    });

    app.post<{}, string, undefined>('/api/actions/clear', (request, response) => {
        database.clear();
        response.json('ok');
    });

    return app;
};
