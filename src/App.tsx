import { useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Holistic} from '@mediapipe/holistic'
//import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'

function get_coords(a: {x: number, y: number}) :number[] {
  return [a.x, a.y]
}
function calcMidPoint(a: number[], b: number[]): number[] {
  if (a !== null && b !== null) {
    return [(a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0]
  }
  return [100000, 100000]
}
function coinsUp(model: {counter: number, coins: number}) {
  if (model.counter == 0) {
    model.coins++
    model.counter++
  }
  return model;
}
/*function up(model: {change_counter: number}) {
  model.change_counter++
  return model
}*/
/*function changeCoins() {
  BlorpId = setInterval(coinsUp, 1000, blorp)
}
function stopCoins() {
  clearInterval(BlorpId)
  blorp.counter = 0
}*/

//let BlorpId: number
let counter = 0
let coins = 0
let blorp = {counter, coins}
let change_counter = 0
let cc = {change_counter}
let interval_id = 0
let start_counter = 0
let end_counter = 0
window.innerWidth = 1488
window.innerHeight = 740
const App = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const canvas1 = useRef<HTMLCanvasElement>(null)
  const canvas2 = useRef<HTMLCanvasElement>(null)
  const canvasI = useRef<HTMLCanvasElement>(null)

  /*class Animal {
    image: HTMLImageElement;
    image2: HTMLImageElement;
    display_name: string;
    constructor(obimage:HTMLImageElement, obimage2:HTMLImageElement, obdisplay_name:string) {
      this.image = obimage
      this.image2 = obimage2
      this.display_name = obdisplay_name
    }
  }*/
  const cat_image = new Image()
  cat_image.src = "src/assets/кошка пп 2.png"
  const cat_2 = new Image()
  cat_2.src = "src/assets/кошка пп 1.png"
  //let cat = new Animal(cat_image, cat_2, "Cat")

  const dog_image = new Image()
  dog_image.src = "src/assets/dog 1.png"
  //let dog = new Animal(dog_image, dog_image, "Dog")
  const dog_2 = new Image()
  dog_2.src = "src/assets/dog 2.png"

  const background = new Image(window.innerWidth, window.innerHeight)
  background.src = "src/assets/фон пп.png"

  const arrow_l = new Image()
  arrow_l.src = "src/assets/arrow left.png"
  const arrow_r = new Image()
  arrow_r.src = "src/assets/arrow right.png"


  let animal_image = cat_image

  let animal_coords = {
    x: window.innerWidth / 2 - 128,
    y: window.innerHeight / 2 - 128,
    width: 256,
    height: 256
  }

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    holistic.onResults(onResults)

    let camera: Camera | null = null
    if (webcamRef.current?.video) {
      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current!.video! })
        },
      })
      camera.start()
    }

    return () => {
      camera?.stop()
      holistic.close()
    }
  }, [])

  const onResults = (results: any) => {
    if (!canvasRef.current) return
    if (!canvas1.current) return
    if (!canvas2.current) return
    if (!canvasI.current) return

    const canvasCtx = canvasRef.current.getContext('2d')
    if (!canvasCtx) return

    const canv1 = canvas1.current.getContext('2d')
    if (!canv1) return

    const canv2 = canvas2.current.getContext('2d')
    if (!canv2) return

    const canvI = canvasI.current.getContext('2d')
    if (!canvI) return

    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    canvas1.current.width = window.innerWidth
    canvas1.current.height = window.innerHeight
    canvas2.current.width = window.innerWidth
    canvas2.current.height = window.innerHeight
    canvasI.current.width = window.innerWidth
    canvasI.current.height = window.innerHeight

    canvasCtx.save()
    canv1.save()
    canv2.save()
    canvI.save()
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    canv1.clearRect(0, 0, canvas1.current.width, canvas1.current.height)
    canv2.clearRect(0, 0, canvas2.current.width, canvas2.current.height)
    canvI.clearRect(0, 0, canvasI.current.width, canvasI.current.height)
    canvasCtx.translate(window.innerWidth, 0)
    canvasCtx.scale(-1, 1)
    canv2.translate(window.innerWidth, 0)
    canv2.scale(-1, 1)
    canv1.drawImage(background, 0, 0, canvas1.current.width, canvas1.current.height)
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      360,
      240
    )
    //canvasCtx.globalAlpha = 0.3

    if (results.poseLandmarks) {
      let left_hand1 = [1000, 1000]
      let left_hand2 = [1000, 1000]
      let left_hand3 = [1000, 1000]
      let left_hand4 = [1000, 1000]
      let leftHand =[1000, 1000]
      left_hand1 = get_coords(results.poseLandmarks[15])
      left_hand2 = get_coords(results.poseLandmarks[17])
      left_hand3 = get_coords(results.poseLandmarks[19])
      left_hand4 = get_coords(results.poseLandmarks[21])
      leftHand = calcMidPoint(calcMidPoint(left_hand1, left_hand2), calcMidPoint(left_hand3, left_hand4))
      leftHand = [leftHand[0] * window.innerWidth, leftHand[1] * window.innerHeight]

      let right_hand1 = [1000, 1000]
      let right_hand2 = [1000, 1000]
      let right_hand3 = [1000, 1000]
      let right_hand4 = [1000, 1000]
      let rightHand = [1000, 1000]
      right_hand1 = get_coords(results.poseLandmarks[16])
      right_hand2 = get_coords(results.poseLandmarks[18])
      right_hand3 = get_coords(results.poseLandmarks[20])
      right_hand4 = get_coords(results.poseLandmarks[22])
      rightHand = calcMidPoint(calcMidPoint(right_hand1, right_hand2), calcMidPoint(right_hand3, right_hand4))
      rightHand = [rightHand[0] * window.innerWidth, rightHand[1] * window.innerHeight]

      canv2.fillStyle = 'rgb(255,0,0)'

      canv2.beginPath()
      canv2.ellipse(leftHand[0], leftHand[1], 25, 25, Math.PI / 4, 0, 2 * Math.PI)
      canv2.closePath()
      canv2.fill()

      canv2.beginPath()
      canv2.ellipse(rightHand[0], rightHand[1], 25, 25, Math.PI / 4, 0, 2 * Math.PI)
      canv2.closePath()
      canv2.fill()
      if (start_counter == 0) {
        canvI.font = "40px serif"
        canvI.textAlign = "center"

        canvI.fillText("Правила:", animal_coords.x + 128, 100, 512)
        canvI.fillText("Погладьте питомца 20 раз, чтобы выиграть!", animal_coords.x + 128, 200, 1024)
        canvI.fillText("Чтобы погладить питомца, поднесите руку к центру экрана", animal_coords.x + 128, 300, 1024)
        canvI.fillText("Красные кружочки показывают положение ваших рук относительно питомца", animal_coords.x + 128, 400, 1024)
        canvI.fillText("Чтобы сменить питомца, наведите руку на одну из стрелок на экране", animal_coords.x + 128, 500, 1024)
        canvI.fillText("Наведите руку на эту надпись, чтобы начать :)", animal_coords.x + 128, 650, 1024)
        let leftBool = (leftHand[0] >= animal_coords.x + 128 && leftHand[0] <= animal_coords.x + 1024 + 128) && (leftHand[1] >= 650)
        let rightBool = (rightHand[0] >= animal_coords.x + 128 && rightHand[0] <= animal_coords.x + 1024 + 128) && (rightHand[1] >= 650)
        if (leftBool || rightBool) {
          setTimeout(() => {
            canvI.clearRect(0, 0, window.innerWidth, window.innerHeight)
            start_counter = 1;
            end_counter = 0
          }, 4 * 1000)
          blorp.coins = 0
        }
      } else if (end_counter == 0) {
        canvasCtx.drawImage(animal_image, animal_coords.x, animal_coords.y)
        let leftBool = (leftHand[0] >= animal_coords.x && leftHand[0] <= animal_coords.x + 256) && (leftHand[1] >= animal_coords.y && leftHand[1] <= animal_coords.y + 256)
        let rightBool = (rightHand[0] >= animal_coords.x && rightHand[0] <= animal_coords.x + 256) && (rightHand[1] >= animal_coords.y && rightHand[1] <= animal_coords.y + 256)

        if (leftBool || rightBool) {
          canvasCtx.clearRect(animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height)
          //canvasCtx.drawImage(background, animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height, animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height)
          if (animal_image == cat_image || animal_image == cat_2){
            animal_image = cat_2
          }
          else {
            animal_image = dog_2
          }
          coinsUp(blorp)
        } else if (blorp.counter != 0) {
          canvasCtx.clearRect(animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height)
          //canvasCtx.drawImage(background, animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height, animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height)
          if (animal_image == cat_2 || animal_image == cat_image){
            animal_image = cat_image
          }
          else {
            animal_image = dog_image
          }
          blorp.counter = 0
        }
      
        canvasCtx.drawImage(animal_image, animal_coords.x, animal_coords.y)

        leftBool = (leftHand[0] >= animal_coords.x - window.innerWidth / 7.75 && leftHand[0] <= animal_coords.x - window.innerWidth / 7.75 + 128) && (leftHand[1] >= animal_coords.y && leftHand[1] <= animal_coords.y + 256)
        rightBool = (rightHand[0] >= animal_coords.x - window.innerWidth / 7.75 && rightHand[0] <= animal_coords.x - window.innerWidth / 7.75 + 128) && (rightHand[1] >= animal_coords.y && rightHand[1] <= animal_coords.y + 256)

        let leftBool2 = (leftHand[0] >= animal_coords.x + window.innerHeight / 2.3125 && leftHand[0] <= animal_coords.x + window.innerHeight / 2.3125 + 128) && (leftHand[1] >= animal_coords.y && leftHand[1] <= animal_coords.y + 256)
        let rightBool2 = (rightHand[0] >= animal_coords.x + window.innerHeight / 2.3125 && rightHand[0] <= animal_coords.x + window.innerHeight / 2.3125 + 128) && (rightHand[1] >= animal_coords.y && rightHand[1] <= animal_coords.y + 256)

        //let change_counter = 0

        if ((leftBool || rightBool || leftBool2 || rightBool2) && interval_id == 0) {
          cc.change_counter = 1
          //console.log(cc.change_counter)
        }
        else if (cc.change_counter != 0) {
          if (animal_image == cat_image || animal_image == cat_2){
            animal_image = dog_image
          }
          else {
            animal_image = cat_image
          }
          //console.log(interval_id)
          cc.change_counter = 0
        }

        canvasCtx.clearRect(animal_coords.x, animal_coords.y, animal_coords.width, animal_coords.height)
        canvasCtx.drawImage(animal_image, animal_coords.x, animal_coords.y)
        canvI.font = "50px serif"
        canvI.textAlign = "center"

        canvI.fillText(`Поглаживания: ${blorp.coins}`, animal_coords.x + window.innerWidth / 11.625, animal_coords.y + 356, 256)
        canv1.drawImage(arrow_l, animal_coords.x - window.innerWidth / 7.75, animal_coords.y)
        canv1.drawImage(arrow_r, animal_coords.x + window.innerHeight / 2.3125, animal_coords.y)
        if (blorp.coins >= 20) {
          end_counter = 1
        }
      }
      else {
        canvI.font = "40px serif"
        canvI.textAlign = "center"

        canvI.fillText("Вы молодец!", animal_coords.x + 128, 250, 512)
        canvI.fillText("Наведите руку на эту надпись, чтобы начать заново :)", animal_coords.x + 128, 600, 1024)
        canvI.fillText("(Игра начнётся через несколько секунд)", animal_coords.x + 128, 700, 1024)
        let leftBool = (leftHand[0] >= animal_coords.x + 128 && leftHand[0] <= animal_coords.x + 1024 + 128) && (leftHand[1] >= 600)
        let rightBool = (rightHand[0] >= animal_coords.x + 128 && rightHand[0] <= animal_coords.x + 1024 + 128) && (rightHand[1] >= 600)
        if (leftBool || rightBool) {
          setTimeout(() => {
            canvI.clearRect(0, 0, window.innerWidth, window.innerHeight)
            start_counter = 0;
          }, 4 * 1000)
        }
      }
    }

    canvasCtx.restore()
    canv1.restore()
    canv2.restore()
    canvI.restore()
  }

  return (
    <div>
      <canvas ref={canvasRef} className='ctx' id='main'>
        <Webcam audio={false} mirrored ref={webcamRef} />
      </canvas>
      <canvas ref={canvas1} className='ctx' id='back'>
        
      </canvas>
      <canvas ref={canvas2} className='ctx' id='top'></canvas>
      <canvas ref={canvasI} className='ctx' id='interface'></canvas>
    </div>
  )
}

export default App
