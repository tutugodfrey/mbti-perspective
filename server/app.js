const app = require('./index');

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`express app listening on port ${port}`);
});
