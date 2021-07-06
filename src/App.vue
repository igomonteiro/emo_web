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
  .bar-link-dark {
    color: #BDBDBD !important;
    text-decoration: none;
  }

  .bar-link-dark:hover {
    color: white !important;
  }

  .bar-link-light {
    color: #828282 !important;
    text-decoration: none;
  }

  .bar-link-light:hover {
    color: black !important;
  }

  .active-link-light {
    color: black !important;
  }

  .active-link-dark {
    color: white !important;
  }
</style>