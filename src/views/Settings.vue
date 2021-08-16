<template>
  <v-app>
    <AppBar/>   
    <v-main app>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-card color="primary" elevation="10" max-height="600" max-width="600">
            <v-row align="center" justify="center" class="mx-6 my-6">
              <v-card-title class="justify-center text-h4 font-weight-bold">
                CONFIGURAÇÕES
              </v-card-title>
              <v-card-text>
                <v-select
                  color="white"
                  item-color="accent"
                  @change="setStandardDevice"
                  v-model="selectedVideo"
                  :items="items"
                  :menu-props="{ offsetY: true }"
                  hint="Selecione seu dispositivo de vídeo"
                  prepend-inner-icon="mdi-webcam"
                  persistent-hint
                  item-text="label"
                  no-data-text="Não foi detectado nenhum dispositivo de vídeo"
                  single-line
                  return-object
                ></v-select>
              </v-card-text>
              <v-card-text>
                <span class="text-h6">
                  Desenhar linhas de rosto na detecção?
                </span>
                <v-radio-group
                  @change="setDrawLandmarks"
                  v-model="drawLandmarks"
                  mandatory
                  dense
                  row
                >
                  <v-radio
                    label="Sim"
                    value="true"
                    color="accent"
                  ></v-radio>
                  <v-radio
                    label="Não"
                    value="false"
                    color="accent"
                  ></v-radio>
                </v-radio-group>

                <span class="text-h6">
                  Mínimo de probabilidade a ser detectada
                </span>

                <v-slider
                  @change="setMinConfidence"
                  v-model="minConfidence"
                  color="accent"
                  thumb-label
                  thumb-color="yellow darken-3"
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ value + '%'}}
                  </template>
                </v-slider>
              </v-card-text>
            </v-row>
          </v-card>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template> 

<script>

export default {
  data: () => ({
    items: [],
    selectedVideo: null,
    minConfidence: 0,
    drawLandmarks: false,
  }),
  beforeMount() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          if (device.kind === 'videoinput') {
            const camera = Object.assign({ label: device.label, device: device});
            this.items.push(camera);
          }
        })
      });
  },
  mounted() {
    const standardDevice = JSON.parse(localStorage.getItem('standardDevice'));
    this.selectedVideo = Object.assign({ label: standardDevice.label, device: standardDevice });

    const standardDrawLandmarks = JSON.parse(localStorage.getItem('drawLandmarks'));
    this.drawLandmarks = standardDrawLandmarks;

    const standardConfidence = JSON.parse(localStorage.getItem('minConfidence'));
    this.minConfidence = standardConfidence * 100;
  },
  methods: {
    setStandardDevice() {
      localStorage.setItem('standardDevice', JSON.stringify(this.selectedVideo.device));
      this.$store.dispatch('camera/stopVideo');
    },
    setDrawLandmarks() {
      localStorage.setItem('drawLandmarks', this.drawLandmarks);
    },
    setMinConfidence() {
      localStorage.setItem('minConfidence', this.minConfidence/100);
    }
  }
}
</script>

<style>

</style>