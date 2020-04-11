//const converter = require("node-m3u8-to-mp4");
//var TsFetcher = require('m3u8_to_mpegts');
const m3u8stream = require('m3u8stream');
var fs = require("fs");

var segments = 0;
var totalSegment = 0;
var downloads = 0;
var downloadedIsFinish = false;
var fileSize = 0;

module.exports.run = async function(link) {
  console.log("%c Iniciando Download!! Aguarde", "color: green; background-color: black;");
  /*converter(
    link,
    __dirname + "/src/temp",
    (status, index, total) => {
      switch (status) {
        case "generating":
          console.log("extracting...");
          break;
        case "downloading":
          console.log(
            "downloading process:" + ((index / total) * 100).toFixed(2) + "%"
          );
          break;
        case "combining":
          console.log(
            "combining mp4 process:" + ((index / total) * 100).toFixed(2) + "%"
          );
          break;
      }
    }
  ).then(() => {
    console.log("done!");
  });*/

  /*TsFetcher({
    uri: link,
       cwd: __dirname + "/src/temp",
       preferLowQuality: false,
   }, 
   function(){
        return console.log("%c Download of chunk files complete", "color: green; background-color: black;");
   }
);*/

//m3u8stream(link).pipe(fs.createWriteStream(__dirname + "/src/temp/video.mp4"));

setInterval(function(){
  var stats = fs.statSync(__dirname + "/src/temp/video.mp4");
  var fileSizeInBytes = stats["size"];
  fileSize = fileSizeInBytes / 1000000.0;
}, 1000)

const stream = m3u8stream(link);
  stream.pipe(fs.createWriteStream(__dirname + "/src/temp/video.mp4"));
  stream.on('progress', (segment, totalSegments, downloaded) => {
    segments = segment.num;
    totalSegment = totalSegments;
    downloads = downloaded;

    if(segments >= totalSegment)
      downloadedIsFinish = true;
    else 
      downloadedIsFinish = false;

    console.log(
      `${segment.num} of ${totalSegments} segments ` +
      `(${(segment.num / totalSegments * 100).toFixed(2)}%) ` +
      `${(downloaded / 1024 / 1024).toFixed(2)}MB downloaded`);
  });
}

module.exports.segments = segments;
module.exports.totalSegments = totalSegment;
module.exports.downloaded = downloads;
module.exports.downloadedIsFinish = downloadedIsFinish;
module.exports.fileSize = fileSize;