const express = require('express');
const app = express();
const main = require('./webapp/routes/webapp');

app.use('/webapp', express.static('webapp'));
app.use('/', main);

const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));

