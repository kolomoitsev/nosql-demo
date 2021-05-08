const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const config = require('./config');

const userApi = require('./api/user.api');
const nodeApi = require('./api/note.api')

const MONGODB_LINK = config.MONGOOSE_LINK;

mongoose.connect(MONGODB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .catch(err => console.log(err))

mongoose.connection.once('open', () => {
        console.log(`MongoDb connection established successfully`);
    })
    .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userApi);
app.use('/api/note', nodeApi);

const PORT = process.env.PORT || 3001;

server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
