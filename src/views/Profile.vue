<template>
  <v-app>
    <AppBar/>   
    <v-main app>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-card color="accent" elevation="10">
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-card-title class="justify-center mt-6">
                  <template>
                    <picture-input  
                      ref="pictureInput" 
                      @change="onChange" 
                      width="200" 
                      height="200" 
                      margin="16" 
                      radius="50"
                      zIndex="0"
                      accept="image/jpeg,image/png" 
                      size="10"
                      :hideChangeButton="true"
                      :customStrings="{
                        drag: 'Pegue e arraste sua imagem aqui!'
                      }">
                    </picture-input>
                  </template>
                </v-card-title>
              </v-col>

              <v-col cols="12">
                <v-card-text>
                  <v-form class="mr-10 ml-10">
                    <v-text-field
                      v-model="profile.name"
                      :error-messages="nameErrors"
                      color="secondary"
                      label="Nome"
                      required
                      placeholder="Insira seu novo nome"
                      prepend-inner-icon="mdi-text-short"
                      class="mt-n4"
                      @input="$v.profile.name.$touch()"
                      @blur="$v.profile.name.$touch()"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.oldPassword"
                      color="secondary"
                      :error-messages="oldPasswordErrors"
                      :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showOldPassword ? 'text' : 'password'"
                      label="Senha antiga"
                      placeholder="Insira a sua antiga senha"
                      prepend-inner-icon="mdi-lock-outline"
                      @click:append="showOldPassword = !showOldPassword"
                      @input="$v.profile.oldPassword.$touch()"
                      @blur="$v.profile.oldPassword.$touch()"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.password"
                      color="secondary"
                      :error-messages="passwordErrors"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      label="Nova senha"
                      placeholder="Insira a sua nova senha"
                      prepend-inner-icon="mdi-lock-outline"
                      @click:append="showPassword = !showPassword"
                      @input="$v.profile.password.$touch()"
                      @blur="$v.profile.password.$touch()"
                    ></v-text-field>

                    <v-card-text
                      class="text-center"
                    >
                      <v-btn
                        rounded
                        block
                        class="font-weight-bold"
                        :class="$vuetify.theme.dark ? 'primary--text' : 'white--text'"
                        :color="$vuetify.theme.dark ? 'white' : 'secondary'"
                        :disabled="submitStatus === 'LOADING'"
                        @click="submit"
                      >
                        <v-progress-circular
                          indeterminate
                          v-if="submitStatus === 'LOADING'"
                          color="primary"
                        ></v-progress-circular>
                        <span v-else>Confirmar</span>
                      </v-btn>
                    </v-card-text>
                  </v-form>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-layout>

         <v-snackbar
            v-model="snackbar"
            timeout="2000"
            color="secondary"
            top
          >
            {{ snackbarMessage }}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="primary"
                icon
                v-bind="attrs"
                @click="snackbar = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  
import AppBar from '@/components/AppBar';
import PictureInput from 'vue-picture-input';

import { required, requiredIf, maxLength, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'Profile',
  components: {
    AppBar,
    PictureInput,
  },
  data: () => ({
    showOldPassword: false,
    showPassword: false,
    submitStatus: null,
    snackbarMessage: '',
    snackbar: false,
    imageUrl: '',
    profile: {
      name: '',
      oldPassword: '',
      password: '',
      image: '',
    },
  }),
  validations: {
    profile: {
      name: { required, minLength: minLength(3), maxLength: maxLength(26) },
      oldPassword: { minLength: minLength(8), maxLength: maxLength(40) },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(40),
        required: requiredIf(function () {
          return this.profile.oldPassword.length >= 8
        }),
      },
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.profile.name.$dirty) return errors
      !this.$v.profile.name.minLength && errors.push('Este campo precisa de pelo menos 3 caracteres.')
      !this.$v.profile.name.maxLength && errors.push('Este campo pode ter no máximo 26 caracteres.')
      !this.$v.profile.name.required && errors.push('Este campo é obrigatório.')
      return errors
    },
    oldPasswordErrors() {
      const errors = []
      if (!this.$v.profile.oldPassword.$dirty) return errors
      !this.$v.profile.oldPassword.minLength && errors.push('A senha deve ter no mínimo 8 caracteres.')
      !this.$v.profile.oldPassword.maxLength && errors.push('A senha pode ter no máximo 40 caracteres')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.profile.password.$dirty) return errors
      !this.$v.profile.password.minLength && errors.push('A senha deve ter no mínimo 8 caracteres.')
      !this.$v.profile.password.maxLength && errors.push('A senha pode ter no máximo 40 caracteres')
      !this.$v.profile.password.required && errors.push('Esse campo é necessário se deseja trocar sua senha')
      return errors
    }
  },
  mounted() {
    this.profile.name = this.$store.state.user.profile.name;
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = null;
        this.snackbarMessage = 'Por favor, verifique as informações inseridas.'
        this.snackbar = true;
      } else {
        this.submitStatus = 'LOADING';
        this.$store.dispatch('user/updateProfile', this.profile)
        .then(() => {
          this.submitStatus = null;
          this.snackbarMessage = 'Suas informações foram alteradas com sucesso.';
          this.snackbar = true;
          this.clear();
        })
        .catch(() => {
          this.submitStatus = null;
          this.snackbarMessage = 'Algo deu errado, tente novamente mais tarde.'
          this.snackbar = true;
          this.clear();
        });
      }
    },
    onChange (image) {
      console.log('New picture selected!')
      if (image) {
        console.log('Picture loaded.')
        this.image = image
      } else {
        console.log('FileReader API not supported: use the <form>, Luke!')
      }
    },
    clear() {
      this.profile.oldPassword = '';
      this.profile.password = '';
    }
  }
}
</script>

<style>
  .rounded-img {
    border-radius: 50%;
  }
</style>