var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

var org = nforce.createConnection({
    clientId: '3MVG9I5UQ_0k_hTngSFLpXPUyV2Wxu.3JAafGG8i.0wFh6MczEcr6NsUedmbZRyamGc884gIv9ZdeHUOm4Sfw',
    clientSecret: '5047711542434093658',
    redirectUri: 'https://lightning-out-test.herokuapp.com/oauth/_callback',
});


// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function (req, res) {
    org.authenticate({code: req.query.code}, function (err, resp) {
        if (!err) {
            console.log('Access Token: ' + resp.access_token);
            app.locals.oauthtoken = resp.access_token;
            app.locals.lightningEndPointURI = "https://lyubenov-dev-ed.lightning.force.com";
            res.redirect('/home');
        } else {
            console.log('Error: ' + err.message);
        }
    });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);