import { getApp } from './app';

const PORT: string = process.env.PORT || '4000';

const startServer = () => {
    try {
        const app = getApp();

        app.listen(PORT, () => {
            console.log(`server started at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
