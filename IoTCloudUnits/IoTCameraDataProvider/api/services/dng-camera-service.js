/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

import cheerio from 'cheerio';
import axios from 'axios';
import moment from 'moment';

/**
 * loadVideoFrameFromUrl - load video frame from url of a camera from Danang public camera
 */
export function loadVideoFrameFromUrl(url){
  let listOfVideoFrames = [];
  let videoFrameMap = {};
  let $ = null;
  return axios.get(url).then((res) => {
     $ = cheerio.load(res.data);

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
          videoFrameDate = moment(st, 'YYYY-MM-DD HH:mm').format('X');
        }

        //Form Frame Json object and add to the list of video frames
        if ( videoFrameName !== '' && videoFrameDate !== ''){
        
          var videoFrameObject = {
            name: url + "/" + videoFrameName,
            timestamp: videoFrameDate,
          };

          if(!(videoFrameMap[videoFrameName])){
              videoFrameMap[videoFrameName] = videoFrameObject;
          }                  
        }                
      });
    });
    listOfVideoFrames = Object.values(videoFrameMap)
    return listOfVideoFrames;        
  });      
}


/**
 * getListOfVideoFrames - return the list of canmera
 */
export function getListOfVideoFrames(){
  return listOfVideoFrames;
}

/**
 * getLastestVideoFrame - return the latest frame
 */
export function getLastestVideoFrame(listOfVideoFrames){
  return listOfVideoFrames[listOfVideoFrames.length  - 1];
}

export function getVideoFrameAt(listOfVideoFrames, timestamp){
  let videoFrame = null;
  listOfVideoFrames.forEach(function(frame){
    if(frame.timestamp === timestamp){
          videoFrame = frame;
    }                      
  });
  return videoFrame;
}


/**
 * isFrameExisting - check if the frame is exist in the list
 */
function isFrameExisting(listOfVideoFrames, name){
  listOfVideoFrames.forEach(function(frame){
      if(frame.name === name){
            return true;
      }                      
  });
}