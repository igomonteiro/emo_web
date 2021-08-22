<template>
  <div>
    <ModelLoader/>
    <v-app-bar
      app
      color="primary"
      dense
    >
      <v-container fluid class="d-flex align-center">
        <router-link to="/">
          <v-img
            to="/"
            src="../assets/logo_symbol.png"
            max-height="50"
            max-width="50"
            contain
          ></v-img>
        </router-link>
        <template>
          <router-link
            class="text-button ml-8 bar-link"
            to="/dashboard"
            active-class="active-link"
            exact
          >
            DASHBOARD
          </router-link>

          <router-link
            class="text-button ml-8 bar-link"
            to="/camera"
            active-class="active-link"
            exact
          >
            CÂMERA
          </router-link>
        </template>
        
        <v-spacer></v-spacer>
          
        <span>{{ name }}</span>
        <v-menu
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              class="ml-2"
              large
              v-on="on"
              color="accent"
            >
              <v-avatar color="secondary" size="42">
                <img
                  v-if="imageUrl.length > 0 && imageUrl"
                  :src="imageUrl"
                />

                <span v-else class="primary--text font-weight-medium text-h5">{{ name.charAt(0) }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list dense>
              <v-list-item-group v-model="selectedItem">
                <v-list-item to="/profile">
                  <v-icon color="accent" class="mr-2">mdi-account</v-icon>
                  <v-list-item-content>
                    <v-list-item-title class="accent--text">Perfil</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item to="/settings">
                  <v-icon color="accent" class="mr-2">mdi-cog</v-icon>
                  <v-list-item-content>
                    <v-list-item-title class="accent--text">Configurações</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="signOut">
                  <v-icon color="accent" class="mr-2">mdi-logout</v-icon>
                  <v-list-item-content>
                    <v-list-item-title class="accent--text">Sair</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>

import ModelLoader from '@/components/ModelLoader';

export default {
  name: 'AppBar',
  components: {
    ModelLoader,
  },
  data: () => ({
    selectedItem: 0,
    name: '',
    imageUrl: '',
  }),
  mounted() {
    this.name = this.$store.state.user.profile.name;
    this.imageUrl = this.imageUrl || this.$store.state.user.profile.avatar.url;
  },
  methods: {
    signOut() {
      this.$store.dispatch('auth/signOut')
      .then(() => {
        this.$router.replace({
          name: 'SignIn',
        })
      })
    },
  },
}
</script>

<style scoped>
  .avatar {
    cursor: pointer;
  }
</style>