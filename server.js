var express = require('express');
var app = express();
var fs = require("fs");
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer  = require('multer');
var videoshow = require('videoshow');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
});

app.use('/static', express.static('static'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: storage}).single('file'));
app.use(morgan('dev'));

app.get('/', function (req, res) {
  console.log( __dirname + "/" + "index.html" );
  res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/file_upload', function (req, res) {
  res.sendStatus(200);
})

app.get('/show_video', function (req,res) {
  res.sendFile( __dirname + "/" + "video.html" );
})

app.get('/video', function (req,res) {
  fs.readdir('./uploads/', (err, files) => {
    var files_length = 0;
    files_length = files.length;
    var videoOptions = {
      fps: 60,
      loop: 0.5, // seconds
      transition: false,
      videoBitrate: 1024,
      videoCodec: 'libx264',
      size: '640x?',
      format: 'mp4',
      pixelFormat: 'yuv420p'
    };
    var file_names = [];
    if(files.length >= 1)
      files.forEach(function (data)
      {
        file_names.push(__dirname + '/uploads/' + data);
      });
    else
    {
      res.redirect('/');
      return;
    }

    videoshow(file_names, videoOptions)
    .save(__dirname + '/static/video.mp4')
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
      res.redirect('/show_video');
    })
  })

})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
