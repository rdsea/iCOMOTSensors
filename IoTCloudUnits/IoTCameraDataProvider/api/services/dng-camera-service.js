/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

var cheerio = require('cheerio');
var request = require('request');

var listOfVideoFrames  = [];

/**
 * loadVideoFrameFromUrl - load video frame from url of a camera from Danang public camera
 */
exports.loadVideoFrameFromUrl = function(url){
  

  request({
    method: 'GET',
    url: url
      }, function(err, response, body) {
        if (err) return console.error(err);

        // Tell Cherrio to load the HTML
        $ = cheerio.load(body);
       
        $('tr').each(function() {
            var videoFrameName = '';
            var videoFrameDate = '';

            
            $('td').each(function() {
              
                //Get content in tag <td>
                var st = $(this).text();

               
                //Only get video frame with type .ts
                if(st.indexOf('.ts') !== -1){
                  videoFrameName = st;
                }

                //Extract date of frame from the information
                if (videoFrameName !==  '' && st.indexOf('-') !== -1 && st.indexOf(':') !== -1){
                  videoFrameDate = st;
                }

                //Form Frame Json object and add to the list of video frames
                if ( videoFrameName !== '' && videoFrameDate !== ''){
               
                  var videoFrameObject = {
                    name: url + "/" + videoFrameName,
                    date: videoFrameDate,
                };

                if(!isFrameExisting(listOfVideoFrames,videoFrameName)){

                    listOfVideoFrames.push(videoFrameObject);
                }
                  
              }
                
            });

        });

        
  });
  
}


/**
 * getListOfVideoFrames - return the list of canmera
 */
exports.getListOfVideoFrames = function(){

  return listOfVideoFrames;
}

/**
 * getLastestVideoFrame - return the latest frame
 */
exports.getLastestVideoFrame = function(){

  return listOfVideoFrames[listOfVideoFrames.length  - 1];
}


/**
 * isFrameExisting - check if the frame is exist in the list
 */
var isFrameExisting = function(name){

  listOfVideoFrames.forEach(function(frame){
      if(frame.name === name){
            return true;
      }
                      
  });
}