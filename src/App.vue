<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    value: 0
  }),
};
</script>

<style>
  .bar-link {
    color: #BDBDBD !important;
    text-decoration: none;
  }

  .bar-link:hover {
    color: white !important;
  }

  .active-link {
    color: white !important;
  }
</style>