const express = require('express');
const cors = require('cors');
const path = require('path');

const connectMongo = require('./configs/mongoose');
const pathSrc = require('./utils/path');
const routerUploadImage = require('./routers/uploadImage');

// admin router
const routerAdminLogin = require('./routers/admin/auth/login');
const routerAdminAccessToken = require('./routers/admin/auth/accessToken')
const routerAdminHotel = require('./routers/admin/hotel');
const routerAdminUser = require('./routers/admin/user');
const routerAdminArea = require('./routers/admin/area');
const routerAdminRoom = require('./routers/admin/room');
const routerAdminType = require('./routers/admin/type');
const routerAdminTransaction = require('./routers/admin/transaction');


// User Router
const routerAccessToken = require('./routers/client/auth/accessToken')
const routerLogin = require('./routers/client/auth/login');
const routerSignup = require('./routers/client/auth/signup');
const routerHotel = require('./routers/client/hotel');
const routerArea = require('./routers/client/area');
const routerType = require('./routers/client/type');
const routerTransaction = require('./routers/client/transaction');
const routerRoom = require('./routers/client/room');

const port = 5000;
const staticPathPublic = express.static(path.join(pathSrc, '../', 'public'));


const app = express();


app.use(express.json());
app.use(cors());

app.use(staticPathPublic)

//admin
app.use('/api/admin', routerAdminLogin);
app.use('/api/admin', routerAdminAccessToken);
app.use('/api/admin', routerAdminHotel);
app.use('/api/admin', routerAdminUser);
app.use('/api/admin', routerAdminArea);
app.use('/api/admin', routerAdminRoom);
app.use('/api/admin', routerAdminType);
app.use('/api/admin', routerAdminTransaction);

//client
app.use('/api', routerLogin);
app.use('/api', routerSignup);
app.use('/api', routerAccessToken);
app.use('/api', routerHotel);
app.use('/api', routerArea);
app.use('/api', routerType);
app.use('/api', routerTransaction);
app.use('/api', routerRoom);

app.use('/api', routerUploadImage);

const runServer = () => {
    app.listen(port, () => {
        console.log(`Running on http://localhost:${port}`)
    });
};

connectMongo(runServer);
