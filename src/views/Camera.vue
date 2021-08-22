<template>
  <v-app>
    <AppBar/>   
    <v-main app>
      <v-container fluid>
        <v-layout align-center justify-center>
          <video
            autoplay
            ref="cam"
            width="600"
            height="466"
          >
          </video>
          <canvas
            ref="canvas"
            width="600"
            height="466"
          >
          </canvas>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import api from '@/services/api';
  export default {
    name: 'Camera',
    data: () => ({
      cam: null,
      canvas: null,
      interval: 33,
    }),
    async mounted() {
      this.cam = this.$refs.cam;
      this.canvas = this.$refs.canvas;
      this.canvas.style.position = 'absolute';
      await this.startVideo();
    },
    beforeDestroy() {
      this.$store.dispatch('camera/stopVideo');
    },
    methods: {
      async startVideo() {
        this.$store.dispatch('camera/startVideo')
          .then(stream => {
            this.cam.srcObject = stream;
            const canvasContext = this.canvas.getContext("2d");
            
            setInterval(async () => {
              canvasContext.drawImage(this.cam, 0, 0, this.cam.width, this.cam.height);
              const detection = await this.$store.dispatch('face/getDetections', this.canvas);
              if (detection) {
                this.$store.dispatch('face/drawAll', { canvas: this.canvas, detection});
                this.$store.dispatch('face/bestNow', detection.expressions.asSortedArray()[0]);
                const best = await this.$store.dispatch('face/classifyBestOfAll');
                if (best) {
                  await api.post('emotions', best);
                }
              }
            }, 40);
          })
      },
    }
  }
</script>

<style scoped>
  canvas {
    position: absolute;
  }
</style>