(function() {
  'use strict';
  var dlnacasts = require('dlnacasts2')();
  const ejse = require('ejs-electron');
  var MediaRendererClient = require('upnp-mediarenderer-client');

  dlnacasts.update();

  dlnacasts.on('update', function (player) {
    ejse.data('tv', dlnacasts.players);
    //console.log(player);
    var client = new MediaRendererClient(player.xml);
    var options = { 
      autoplay: true,
      contentType: 'video/mp4',
      metadata: {
        title: 'Some Movie Title',
        creator: 'John Doe',
        type: 'video', // can be 'video', 'audio' or 'image'
      }
    };  
  
    /*client.load('https://cdn.discordapp.com/attachments/560622933995683851/697928603257798787/VHS_20200205_06364100.MP4', options, function(err, result) {
    if(err) throw err;
    console.log('playing ...');
    }); */
  })  
})();