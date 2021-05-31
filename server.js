const express = require('express');
const app = express();
const main = require('./routes/main');

app.use('/main', express.static('main'));
app.use('/', main);

const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));

