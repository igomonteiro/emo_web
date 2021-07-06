<template>
  <v-app-bar
    app
    color="primary"
    dense
    dark
  >
    <v-container class="d-flex">
        <v-img
          v-if="$vuetify.theme.dark"
          src="../assets/logo.png"
          max-height="70"
          max-width="70"
          contain
        ></v-img>

        <v-img
          v-else
          src="../assets/dark_logo.png"
          max-height="70"
          max-width="70"
          contain
        ></v-img>

        <template>
          <router-link
            class="text-button ml-8"
            :class="[$vuetify.theme.dark ? 'bar-link-dark' : 'bar-link-light']"
            to="/dashboard"
            :active-class="$vuetify.theme.dark ? 'active-link-dark' : 'active-link-light'"
            exact
          >
            HOJE
          </router-link>

          <router-link
            class="text-button ml-8"
            :class="[$vuetify.theme.dark ? 'bar-link-dark' : 'bar-link-light']"
            to="/history"
            :active-class="$vuetify.theme.dark ? 'active-link-dark' : 'active-link-light'"
            exact
          >
            HISTÓRICO
          </router-link>

          <router-link
            class="text-button ml-8"
            :class="[$vuetify.theme.dark ? 'bar-link-dark' : 'bar-link-light']"
            to="/cam"
            :active-class="$vuetify.theme.dark ? 'active-link-dark' : 'active-link-light'"
            exact
          >
            CÂMERA
          </router-link>
        </template>
      </v-container>

      <v-spacer></v-spacer>

      <v-row justify="center">
        <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              large
              v-on="on"
            >
              <v-avatar
                color="brown"
                size="42"
              >
                <img src="https://i.pinimg.com/736x/cc/ec/06/ccec06bfcef089196f335c17e837b9eb.jpg"/>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list dense>
              <v-list-item-group v-model="selectedItem">
                <v-list-item to="/profile">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Perfil</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-icon class="mr-2">mdi-weather-night</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Dark mode</v-list-item-title>
                  </v-list-item-content>
                  <v-switch color="secondary" v-model="$vuetify.theme.dark"></v-switch>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="signOut">
                  <v-list-item-content>
                    <v-list-item-title>Sair</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
  </v-app-bar>
</template>

<script>

export default {
  name: 'AppBar',
  data: () => ({
    selectedItem: 0,
  }),
  methods: {
    signOut() {
      this.$store.dispatch('auth/signOut')
      .then(() => {
        this.$router.replace({
          name: 'SignIn',
        })
      })
    },
  }
}
</script>

<style scoped>
  .avatar {
    cursor: pointer;
  }
</style>