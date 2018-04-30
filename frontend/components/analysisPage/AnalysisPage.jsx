import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import ImageCropper from './image_cropper';
import Dropzone from 'react-dropzone';

class AnalysisPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        vidFile: null,
        vidPath: "",
        cropped: [],
        selectedCrops: []
      };
      this.currentTime = 0;
      this.duration = 0;
      this.currentBlob = ''; //Because toBlob() expects a callback, this is necessary
      this.onDrop = this.onDrop.bind(this);
      this.getVideoImage = this.getVideoImage.bind(this);
      this.saveBlob = this.saveBlob.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.vidFile && this.state.cropped.length < 40) {
        // call showImageAt at the 4 quartiles
        this.showImageAt(0);
      }
    }

    getVideoImage(path, secs, callback) {
      var me = this, video = document.createElement('video');

      video.onloadedmetadata = function() {
        console.log(this.duration);
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
      };

        video.onloadedmetadata = function() {
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
        };

        video.onseeked = function(e) {
        //We need to skip to random points in the video

        //Initializes Canvas
        var canvas = document.createElement('canvas');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        var ctx = canvas.getContext('2d');

        //check to see if video is in scope;
        console.log('video: ', video);

        // Draw the image into a canvas, then pass it to the cropper;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = new Image();
        canvas.toBlob((blob) => {
          this.currentBlob = blob;
        }, 'image/png');
        img.src = this.currentBlob;
        console.log('img: ', img);
        callback.call(me, img, this.currentTime, e);
        };

        video.onerror = function(e) {
        callback.call(me, undefined, undefined, e);
        };

        video.src = path;
        this.duration = video.duration;
    }

    showImageAt(secs) {
      this.getVideoImage(
        this.state.vidPath,
        secs,
        function(img, secs, event) {
          if (event.type == 'seeked') {
            this.crop(img);
            }
          }
        );
    }

    saveBlob(blob) {
      this.currentBlob = blob;
    }

    crop(img) {
      //cv error: Index or size is negative or greater than the allowed amount, problem with imread()
        // loads in the photo
        let src = cv.imread(img); //img is invalid
        let dst = new cv.Mat();
        // Crops the photo
        let rect = new cv.Rect(0, 0, 224, 224);
        dst = src.roi(rect);
        // add the cropped photo, cleans up memory
        let newCropped = this.state.cropped.concat([dst]);
        this.setState({cropped: newCropped});
        src.delete();
        dst.delete();
    }

    onDrop(acceptedFiles, rejectedFiles) {
        // do stuff with files...
        if (acceptedFiles.length == 1 && acceptedFiles[0].type.split('/')[0]==='video') {
            this.setState({ vidFile: acceptedFiles[0], vidPath: URL.createObjectURL(acceptedFiles[0])})
        }
    }

    render(){
        return (
        <div>
            <section id="analysis-page" className=" h-80vh color7" style={{ zIndex: 2 }}>
            </section>

                <section className="content-1 type2 flex max-width m-t-125 m-b-125 m-w p-x-20 cu-menu-anchor" >
                    <div id="tool-div" className="column column1 flex-box-50p bg8 p-x-100 p-t-200 p-b-175" >
                        <section id="upload-menu">
                            <Dropzone onDrop={this.onDrop} id="file-catcher">
                                <img id="cloud" src="../../app/assets/images/cloud-upload-1.png" />
                                <span className="up-span">Drag and Drop a File</span>
                                <span className="up-span">or Click Here</span>
                                <span id="upload-subtitle">To Begin Video Analysis</span>
                            </Dropzone>

                        </section>
                        <canvas id="canvas-output"></canvas>

                        {/* <div className="texts m-w-400 m-l-0">
                            <div>
                                <div className="line1 bg3 m-l-20- cu-tweenmax"
                                    data-a-init="x:300, alpha:0, scaleX:1"
                                    data-a-to="x:300, alpha:0.5, scaleX:50, ease:Expo.easeIn, duration:0.6"
                                    data-a-to-2="x:0, alpha:1, scaleX:1, ease:Expo.easeOut, duration:1"
                                ></div>

                                <h2 className="color2 f-medium cu-tweenmax"
                                    data-a-init="alpha:0"
                                    data-a-to="alpha:1, duration:0.9, delay:0.6, ease:Cubic.easeOut"
                                >What is Shallow?</h2>
                            </div>
                            <div className="cu-tweenmax"
                                data-a-init="x:-50, alpha:0"
                                data-a-to="x:0, alpha:1, duration:0.9, delay:0.6, ease:Cubic.easeOut"
                            >
                                <h3 className="t-60 f-extra-light l-h-normal m-t-25">Fighting AI with AI</h3>
                                <p className="t-18 m-t-30 l-h-170">Shallow is a deep learning architecture designed to detect Deepfake video alterations.</p>
                            </div>
                        </div> */}

                    </div>
                    {/* <div className="column column2 flex-grow" >
                        <div className="image video cu-tweenmax"
                        data-a-init='y:200, alpha:0'
                        data-a-to='y:0, alpha:1, duration:0.8'
                        data-a-gap="100"
                        >
                        <div className="bg-stretch cover" style={{ backgroundImage: 'url(../../app/assets/images/shadow.png)', marginLeft: '-160px', marginBottom: '-125px' }}></div>
                        <div className="bg-cover cover" style={{ backgroundImage: 'url(../../app/assets/images/p2-image2.jpg)' }}></div>
                        <div className="cover bg-black"></div>
                        <div className="video-play">
                        <img className="svg" src="../../app/assets/images/video-play.svg" alt="" />
                        </div>
                        </div>
                    </div> */}
                </section>
                {/* <ImageCropper /> */}
        </div>
        );
    }
}

export default AnalysisPage;
