const express = require('express');
const app = express();
app.use(express.json());

app.set('views', './view');
app.set('view engine', 'ejs');

app.use('/i/want/title', require('./routes/api/getTitle-regular'));
// app.use('/i/want/title', require('./routes/api/getTitle-promise'));
// app.use('/i/want/title', require('./routes/api/getTitle-aync'));
app.listen(4001, () => console.log('Starting'));
