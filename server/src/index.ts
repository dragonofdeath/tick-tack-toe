import { getApp } from './app';

const PORT: string = process.env.PORT || '4000';

const startServer = () => {
    try {
        const app = getApp();

        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`server started at http://localhost:${PORT}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

startServer();
