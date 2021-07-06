<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-card color="accent" elevation="10">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card-title class="font-weight-bold secondary--text text-h3 justify-center mt-6">
              Cadastro
            </v-card-title>
          </v-col>

          <v-col cols="12">
            <v-card-text>
              <v-form class="mr-10 ml-10">
                <v-text-field
                  color="secondary"
                  v-model="form.name"
                  :error-messages="nameErrors"
                  label="Nome"
                  required
                  placeholder="Insira seu nome"
                  prepend-inner-icon="mdi-text-short"
                  class="mt-n4"
                  @input="$v.form.name.$touch()"
                  @blur="$v.form.name.$touch()"
                ></v-text-field>

                <v-text-field
                  color="secondary"
                  v-model="form.email"
                  :error-messages="emailErrors"
                  name="email"
                  label="E-mail"
                  required
                  placeholder="Insira o seu e-mail"
                  prepend-inner-icon="mdi-account-outline"
                  @input="$v.form.email.$touch()"
                  @blur="$v.form.email.$touch()"
                ></v-text-field>

                <v-text-field
                  color="secondary"
                  v-model="form.password"
                  :error-messages="passwordErrors"
                  :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show_password ? 'text' : 'password'"
                  label="Senha"
                  placeholder="Insira a sua senha"
                  prepend-inner-icon="mdi-lock-outline"
                  @click:append="show_password = !show_password"
                  @input="$v.form.password.$touch()"
                  @blur="$v.form.password.$touch()"
                ></v-text-field>

                <v-card-text
                  class="text-center"
                >
                  <v-btn
                    rounded
                    block
                    class="font-weight-bold"
                    color="secondary"
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

                <v-card-text class="secondary--text text-body-1 text-center">
                  Já tem uma conta?
                </v-card-text>
                
                <v-card-text class="secondary--text text-body-1 mt-n8 text-center">
                  <router-link
                    class="no-decoration"
                    to="/"
                  >
                    Faça login
                  </router-link>
                </v-card-text>

              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-layout>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
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
</template>

<script>
  import { required, maxLength, minLength, email } from 'vuelidate/lib/validators';

  export default {
    name: 'SignUp',
    data: () => ({
      form: {
        name: '',
        email: '',
        password: '',
      },
      submitStatus: null,
      snackbar: false,
      snackbarMessage: '',
      show_password: false,
      timeout: 3000,
    }),
    validations: {
      form: {
        name: { required, minLength: minLength(3), maxLength: maxLength(26) },
        email: { required, email },
        password: { required, minLength: minLength(8), maxLength: maxLength(40) }
      }
    },
    computed: {
      nameErrors() {
        const errors = []
        if (!this.$v.form.name.$dirty) return errors
        !this.$v.form.name.minLength && errors.push('Este campo precisa de pelo menos 3 caracteres.')
        !this.$v.form.name.maxLength && errors.push('Este campo pode ter no máximo 26 caracteres.')
        !this.$v.form.name.required && errors.push('O nome é obrigatório.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.form.email.$dirty) return errors
        !this.$v.form.email.email && errors.push('Você não inseriu um e-mail válido.')
        !this.$v.form.email.required && errors.push('O e-mail é obrigatório.')
        return errors
      },
      passwordErrors() {
        const errors = []
        if (!this.$v.form.password.$dirty) return errors
        !this.$v.form.password.minLength && errors.push('A senha deve ter no mínimo 8 caracteres.')
        !this.$v.form.password.maxLength && errors.push('A senha pode ter no máximo 40 caracteres')
        !this.$v.form.password.required && errors.push('A senha é obrigatória.')
        return errors
      }
    },
    methods: {
      async submit() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.submitStatus = null;
          this.snackbarMessage = 'Por favor, verifique as suas informações.'
          this.snackbar = true;
        } else {
          this.submitStatus = 'LOADING';
          
          this.$store.dispatch('auth/signUp', this.form)
          .then(() => {
            this.submitStatus = null;
            this.timeout = 2000;
            this.snackbarMessage = 'Seu usuário foi criado com sucesso, você será redirecionado para a tela de login.';
            this.snackbar = true;
            setTimeout(this.goToLogin, this.timeout);
          })
          .catch(() => {
            this.submitStatus = null;
            this.snackbarMessage = 'Já existe um cadastro com este e-mail.'
            this.snackbar = true;
          });
        }
      },
      goToLogin() {
        this.$router.replace({ name: 'SignIn' });
      }
    }
  }
</script>

<style>
  .no-decoration {
    text-decoration: none;
  }

  .no-decoration:visited {
    color: inherit;
  }

  .no-decoration:link {
    color: inherit;
  }

  .no-decoration:hover {
    color: #0270c9;
  }
</style>