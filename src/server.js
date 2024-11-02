require('dotenv').config();

const express = require('express');
const configViewEngine = require('./config/viewEngine');
const apiRouter = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require('cors');
const app = express();
app.use(express.json()); // Đảm bảo bạn đã thêm dòng này
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

app.use('/v1/api', apiRouter);
app.use('/', getHomepage);

(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log('>>> Error connect to database: ', error);
  }
})();
