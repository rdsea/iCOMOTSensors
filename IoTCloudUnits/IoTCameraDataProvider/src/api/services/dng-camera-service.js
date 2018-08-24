/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

import cheerio from 'cheerio';
import axios from 'axios';
import moment from 'moment';
import Camera from '../../data/camera';

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

export function downloadVideo(url){
  return axios.get(url, { responseType:"arraybuffer" }).then((res) => {
    return res.data;
  }).catch((err) => {
    if(err.response.status === 404){
      throw new Error('cannot find requested video, perhaps it has expired');
    }
  });
}

export function getVideoById(listOfVideoFrames, videoId){
  let videoFrame = null;
  listOfVideoFrames.forEach(function(frame){
    let tokens = frame.name.split("/")
    let currentId = tokens[tokens.length-1];
    console.log(currentId, videoId);

    if(currentId === videoId){
        videoFrame = frame;
    }
  });
  return videoFrame;
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
 * findAll - finds all cameras
 */

export function findAll(){
  return Camera.find({});
}

export function findAllByLocation(lon,lat,distance){
  //distance is in meter
  return Camera.find(
    { location : { $near : [ lon, lat ], $maxDistance: distance/(6378.1*1000)} }
  );

//  return Camera.find({});
}
