require('dotenv').config();
const app = require('./app');
app.listen(3000, () => console.log('Gateway started on port 3000'));