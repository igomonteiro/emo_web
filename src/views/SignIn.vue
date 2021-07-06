<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-card color="accent" elevation="10">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card-title class="font-weight-bold secondary--text text-h3 justify-center mt-6">
              Login
            </v-card-title>
          </v-col>

          <v-col cols="12">
            <v-card-text>
              <v-form class="mr-10 ml-10">
                <v-text-field
                  class="mt-n4"
                  v-model="form.email"
                  :error-messages="emailErrors"
                  color="secondary"
                  centered
                  label="E-mail"
                  placeholder="Insira o seu e-mail"
                  prepend-inner-icon="mdi-account-outline"
                  @input="$v.form.email.$touch()"
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
                ></v-text-field>

                <v-card-text
                  class="text-center"
                >
                  <v-btn
                    rounded
                    block
                    class="font-weight-bold"
                    color="secondary"
                    @click="submit"
                  >
                    ENTRAR
                  </v-btn>
                </v-card-text>
                
                <v-card-text class="secondary--text text-body-1 text-center">
                  Ainda não tem uma conta?
                </v-card-text>
                
                <v-card-text class="secondary--text text-body-1 mt-n8 text-center">
                  <router-link
                    class="no-decoration"
                    to="/signup"
                  >
                    Cadastre-se
                  </router-link>
                </v-card-text>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import { required, maxLength, minLength, email } from 'vuelidate/lib/validators';

  export default {
    name: 'SignIn',
    data: () => ({
      form: {
        email: '',
        password: '',
      },
      show_password: false,
    }),
    validations: {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(8), maxLength: maxLength(40) }
      }
    },
    computed: {
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
      submit() {
        if (!this.$v.$invalid) {
          this.$store.dispatch('auth/signIn', this.form)
          .then(() => this.$router.replace({
              name: 'Dashboard',
          }))
          .catch(() => {
            console.log('Login failed');
          });
        }
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