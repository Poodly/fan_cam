const express       = require('express');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const path          = require('path');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const passport      = require('passport'); 
const bcrypt   = require('bcrypt');

const { sequelize } = require('./models');

// dotenv.config();
require("dotenv").config();

// ----------------------------------------- connect routes ----------------------------------------
const userRouter   = require('./routes/user.router');
const pagesRouter  = require('./routes/pages.router');
const adminRouter  = require('./routes/admin.router');
const authRouter   = require('./routes/auth.router');
const searchRouter = require('./routes/search.video.router');
const rankRouter   = require('./routes/rank.router')
// const newsRouter   = require('./routes/rank.router')
const dbSaveRouter = require('./routes/db.save.router');
const passportConfig = require('./architecture/controllers/passport');
// -------------------------------------------------------------------------------------------------
const app = express();
passportConfig();
app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', 'views');
// -------------------------------------------------------------------------------------------------
const User = require('./models/user');
sequelize.sync({ force: false })
    .then(async () => {
        console.log('최초 어드민 생성 및 데이터베이스 연결 성공');
        const pwHash = await bcrypt.hash(process.env.FIRSTADMINPW, 12);
        User.findOne({ where: { userType: process.env.ADMIN_KEY } }).then((admin) => {
        if (!admin) {
            User.create({
            email: process.env.FIRST_ADMIN,
            nick: process.env.FIRST_ADMIN_NICk,
            password: pwHash,
            userType: process.env.ADMIN_KEY,
            });
        }
        });
    })
    .catch((err) => {
        console.log(err);
    });
// sequelize.sync({ force: false })
//     .then ((   ) => { console.log('데이터베이스 연결 성공'); })
//     .catch((err) => { console.log(err); });
// -------------------------------------------------------------------------------------------------
app.use(morgan('dev')); 
app.use(express.static('views'));
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../views")));

// ------------------------------------------ parser -----------------------------------------------
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.urlencoded({ extended:false} ));
app.use(cookieParser(process.env.COOKIE_SECRET)); 
app.use(session({ 
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    }
}));
app.use(passport.initialize()); 
app.use(passport.session()); 

// ------------------------------------------ routes -----------------------------------------------
app.use('/'      , pagesRouter); 
app.use('/auth'  , authRouter); 
app.use('/user'  , userRouter); 
app.use('/video' , searchRouter);
app.use('/save'  , dbSaveRouter);
app.use('/rank'  , rankRouter);
app.use('/admin' , adminRouter);
// app.use('/news'  , newsRouter);


// ------------------------------------------ error ------------------------------------------------
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error   = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
// ------------------------------------------------------------------------------------------------
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중')
})