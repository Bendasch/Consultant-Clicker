const express = require('express');
const app = express();
const port = 3000;

app.use('/main', express.static('main'));

app.listen(port, () => console.log(`listening on port ${port}!`));