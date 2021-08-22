import * as faceapi from 'face-api.js';

export default {
  namespaced: true,
  state: {
    loading: false,
    loaded: false,
    expressions: {
      emotionsTranslated: {
        'neutral': 'neutro',
        'happy': 'feliz',
        'sad': 'triste',
        'angry': 'irritado',
        'surprised': 'surpreso'
      },
    },
    bestEmotions: [],
    bestOfAll: null,
    sizeOfBestEmotionsArray: 100,
  },
  getters: {
  },
  mutations: {
    LOADING_MODELS(state) {
      state.loading = true;
    },
    LOADED_MODELS(state) {
      state.loading = false;
      state.loaded = true;
    },
    BEST_EMOTIONS(state, best) {
      state.bestEmotions.push(best);
    },
    RESET_EMOTIONS(state) {
      state.bestEmotions = [];
    },
    BEST_OF_ALL(state, bestOfAll) {
      state.bestOfAll = bestOfAll;
    },
    BEST_OF_ALL_RESET(state) {
      state.bestOfAll = null;
    }
  },
  actions: {
    async loadModels({commit, state}) {
      if (!state.loading && !state.loaded) {
        commit('LOADING_MODELS');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/face-api/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/face-api/models');
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('face-api/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/face-api/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/face-api/models');
        commit('LOADED_MODELS');
      }
    },
    async getDetections(_, canvas) {
      const detection = await faceapi
        .detectSingleFace(
          canvas,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: JSON.parse(localStorage.getItem('distance')) || 160,
          })
        )
        .withFaceLandmarks(true)
        .withFaceDescriptor()
        .withFaceExpressions();

      return detection;
    },
    drawAll({ state }, { canvas, detection }) {
      let emotion = '';
      let probability = '';
      let minConfidence = JSON.parse(localStorage.getItem('minConfidence')) || 0.5;
      let sorted = detection.expressions.asSortedArray()[0];

      if (sorted.expression !== 'fearful' && sorted.probability > minConfidence) {
        emotion = sorted.expression;
        probability = sorted.probability;
      }

      if (emotion.length) {
        emotion = state.expressions.emotionsTranslated[emotion];
      }

      const detectionBox = detection.detection.box;
      const box = {
        x: detectionBox.x,
        y: detectionBox.y,
        width: detectionBox.width,
        height: detectionBox.height
      }

      const drawOptions = {
        label: `${(detection.detection.score * 100).toFixed(2)}%`,
        boxColor: '#262223',
        lineWidth: 2,
      }

      const text = [
        `Você está: ${emotion}!`,
        `Probabilidade: ${(probability * 100).toFixed(2)}%`,
      ]

      const textAnchor = {
        x: detectionBox.bottomLeft.x, 
        y: detectionBox.bottomLeft.y
      }
      
      const textOptions = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontSize: 14,
      }

      const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
      drawBox.draw(canvas);

      if (emotion.length) {
        const drawText = new faceapi.draw.DrawTextField(text, textAnchor, textOptions);
        drawText.draw(canvas);
      }

      if (JSON.parse(localStorage.getItem('drawLandmarks'))) {
        faceapi.draw.drawFaceLandmarks(canvas, detection, { drawLines: true });
      }
    },
    async bestNow({ commit, state }, best) {
      if (state.bestEmotions.length < state.sizeOfBestEmotionsArray &&
          best.expression !== 'fearful') {
        commit('BEST_EMOTIONS', best);
      }
    },
    classifyBestOfAll({ commit, state }) {
      return new Promise((resolve) => {
        let max = 0;
        let classification = null;   
        let prob = 0;
        if (state.bestEmotions.length == state.sizeOfBestEmotionsArray) {
          let classificationsCounter = {
            neutral: {
              count: 0,
              probSum: 0,
            },
            happy: {
              count: 0,
              probSum: 0,
            },
            sad: {
              count: 0,
              probSum: 0, 
            },
            angry: {
              count: 0,
              probSum: 0,
            },
            surprised: {
              count: 0,
              probSum: 0, 
            }
          }

          state.bestEmotions.forEach((emotion, index, array) => {
            classificationsCounter[emotion.expression].count++;
            classificationsCounter[emotion.expression].probSum += emotion.probability;
            if (index === array.length - 1) {
              for(const c in classificationsCounter) {
                if (classificationsCounter[c].count > max) {
                  max = classificationsCounter[c].count;
                  prob = classificationsCounter[c].probSum;
                  classification = c;
                }  
              }
              
              const theBest = {
                classification,
                probability: parseFloat((prob/max).toFixed(2))
              };

              commit('RESET_EMOTIONS');
              commit('BEST_OF_ALL', theBest);
              resolve(theBest);
            } 
          })
        } 
      })
    },  
  },
}