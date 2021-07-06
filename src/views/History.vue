<template>
  <v-app>   
    <AppBar/>
    <v-main app>
      <v-container fluid>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import AppBar from '@/components/AppBar';

  export default {
    name: 'History',
    components: {
      AppBar,
    },
    data: () => ({
      isActive: true,
    }),
    computed: {
      ...mapGetters({
        authenticated: 'auth/authenticated',
        user: 'auth/user',
      })
    },
    methods: {
      signOut() {
        this.$store.dispatch('auth/signOut')
        .then(() => {
          this.$router.replace({
            name: 'SignIn',
          })
        })
      }
    }
  }
</script>