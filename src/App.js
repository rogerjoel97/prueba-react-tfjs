import React, { useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import Webcam from "react-webcam";




function App() {

  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);
   const [videoId, setVideoId] = React.useState('')
  /*const [model,setModel] = React.useState(null)
  const [tensor, setTensor] = React.useState(null) */

  async function runModel (){
    const model = await tf.loadLayersModel('modeloTipoDocJS/model.json');

    setInterval(() => {
      detect(model);
    }, 10);
  }

  async function detect(model){
    //Chequeamos que el video este activo
    if(
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ){
      //agarramos las propiedades del video
      const video = webcamRef.current.video;
      //const videoWidth = webcamRef.current.video.videoWidth;
      //const videoHeight = webcamRef.current.videoHeight;

      // Ponemos las dimensiones del video
      webcamRef.current.video.width = 224;
      webcamRef.current.video.height = 224;

      //Hacemos la deteccion

      let tensor = preprocessImage(video)
      let prediction = await model.predict(tensor).dataSync();
      //console.log(prediction)
      if(prediction[0] > 0.8){
        console.log('cedula Venezolana')
      } else if (prediction[1] > 0.8) {
        console.log('Desconocido')
      } else if (prediction[2] > 0.8){
        console.log('Licencia Venezolana')
      } else if (prediction[3] > 0.8){
        console.log('No document')
        
      } else if (prediction[4] > 0.8){
        console.log('pasaporte')
      } else if (prediction[5] > 0.8){
        console.log('us_driver_license')
      } else {
        console.log('No se ha detectado un documento')
        
      }
    }
  }

  //Funcion para preprocesar las funciones
  function preprocessImage(image){
    let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([224,224]).toFloat();
    let offset = tf.scalar(127.5)
    return tensor.sub(offset).div(offset).expandDims();
  }

  useEffect(()=>{
    runModel();
  },[])


  /* useEffect(()=>{
    let model = loadModel();
    setModel(model)
  }, [])

  useEffect(() => {
    analizarImagen(model);
  }, [videoId])

  async function loadModel(){
    //const modeldir =  localStorage.getItem('modeloTipoDocJS')
    //console.log(process.env.PUBLIC_URL + 'modeloTipoDocJS/model.json')
    const model = await tf.loadLayersModel('modeloTipoDocJS/model.json');
    //model.summary()
    //console.log(modeldir)
    console.log('se ha cargado el modleo')
    return(model)
  }

  async function UseModel(model, video){
    if (video.readyState >= 3){
      setTensor(tf.browser.fromPixels(video).resizeBilinear([224,224]).expandDims(0));
      //const reshape_tensor = input_tensor.reshape([224,224])
      //input_tensor = input_tensor.expandDims(0)
      let prediction = await model.predict(tensor).dataSync();
      if(prediction[0] > 0.8){
        console.log('cedula Venezolana')
      } else if (prediction[1] > 0.8) {
        console.log('Desconocido')
        UseModel(model,video)
      } else if (prediction[2] > 0.8){
        console.log('Licencia Venezolana')
      } else if (prediction[3] > 0.8){
        console.log('No document')
        UseModel(model,video)
      } else if (prediction[4] > 0.8){
        console.log('pasaporte')
      } else if (prediction[5] > 0.8){
        console.log('us_driver_license')
      } else {
        console.log(prediction)
        UseModel(model,video)
      }
    } else {
    }
    
  }

  async function analizarImagen(model){
    let modelInfer = await model;
    if(videoId !== '' && 
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null 
    ){
  
      const video = webcamRef.current.video;
      //webcamRef.current.video.width = 224;
      //webcamRef.current.video.height = 224;
      video.addEventListener('loadeddata', UseModel(modelInfer,video))
      //analizarImagen(model);
      //const example = tf.browser.fromPixels(webcamRef.current.video);  // for example
      //console.log(example)
    }else {
      //analizarImagen(model)
    }
    
  } */

  

  return (
    <>
      <div>
        <Webcam
          onUserMedia={(r) => { console.log('camera rendered: ', r); setVideoId(r.id) }}
          onUserMediaError={(e) => { console.log('camera error: ', e) }}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        height={500}
        width={500}
        videoConstraints={{
          width: 1080,
          height: 1080,
          aspectRatio: 1,
          facingMode: "user"
        }}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 500,
          height: 500,
        }}
        />
      </div>
    </>

    );
}

export default App;
