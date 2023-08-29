require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser'); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use('/', bodyParser.urlencoded({extended: false})); 

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

originalURLs = [];

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url; 
  short = originalURLs.indexOf(url); 

  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  if (!pattern.test(url)) return res.json({ error: 'invalid url' });

  if (short < 0) {
    originalURLs.push(url); 
    short = originalURLs.indexOf(url); 
    console.log(short); 
  }

  res.json({
    'original_url' : url, 
    'short_url': short
  });   
}); 

app.get('/api/shorturl/:value', (req, res) => {
  const shortenedURL = Number(req.params.value);
  if (Number.isNaN(shortenedURL)) return res.json({ "error": "Wrong format" });
  res.redirect(originalURLs[shortenedURL]); 
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
