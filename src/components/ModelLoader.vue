<template>
    <v-progress-linear
      :active="!dataReady"
      fixed
      stream
      buffer-value="0"
      color="yellow"
    ></v-progress-linear>  
</template>

<script>
export default {
  name: 'ModelLoader',
  data: () => ({
      selectedLink: 0,
      dataReady: true,
  }),
  async mounted() {
    this.dataReady = false;
    await this.$store.dispatch('face/loadModels');
    this.dataReady = this.$store.state.face.loaded;
  },
}
</script>