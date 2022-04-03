import { readFile } from 'fs';
import express from 'express';
const app = express();
app.get('/', (_, res) => {
    readFile('docs/index.html', { encoding: 'utf-8' }, (_, data) => {
        res.send(data);
    });
});
app.use('/', express.static('./docs', { index: false, extensions: ['html'] }));
app.get('*', (_, res) => {
    readFile('docs/404.html', { encoding: 'utf-8' }, (_, data) => {
        res.send(data);
    });
});
app.listen(80, () => console.log('Test server running on port 80'));
