import { readFile } from 'fs';
import express from 'express';
const port = 8080;
const app = express();
app.get('/', (_, res) => {
    readFile('docs/index.html', { encoding: 'utf-8' }, (_1, data) => {
        res.send(data);
    });
});
app.use('/', express.static('./docs', { index: false, extensions: ['html'] }));
app.get('*', (_, res) => {
    readFile('docs/404.html', { encoding: 'utf-8' }, (_1, data) => {
        res.send(data);
    });
});
app.listen(port, () => console.log(`Test server running on port ${port}`));
