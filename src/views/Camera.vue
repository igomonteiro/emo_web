<template>
  <v-app>
    <AppBar/>   
    <v-main app>
      <v-container fluid>
        <v-layout align-center justify-center>
          <video
            autoplay
            id="cam"
            width="720"
            height="560"
          >
          </video>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import AppBar from '@/components/AppBar';

  export default {
    name: 'Camera',
    components: {
      AppBar,
    },
    data: () => ({

    }),
    mounted: () => {
    },
    methods: {
    }
  }
</script>