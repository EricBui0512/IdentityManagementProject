const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 4000;
const path = require('path')


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, './upload')));

const routes = require("./routes")(app);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', './build', 'index.html'));
});

app.listen(port, function () {
  console.log('Next Id backend listening on port ' + port + '!');
})
