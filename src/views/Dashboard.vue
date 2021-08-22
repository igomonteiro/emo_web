<template>
  <v-app>
    <AppBar/>
    <v-main app>
      <v-container fluid>
        <v-row justify="center" class="pa-4">
          <v-banner
            v-if="!this.$store.state.camera.stream"
            class="error--text font-weight-medium text-body-2 mb-10"
            color="accent"
            outlined
            icon="mdi-alert"
            icon-color="error"
          >
            Para começar o monitoramento, é necessário que seu dispositivo de vídeo
            seja inicializado, para isso, acesse o menu câmera e permita que o aplicativo
            use sua câmera.
            Caso este aviso persista, verifique se você tem algum dispositivo conectado
            ou se realmente tem algum dispositivo selecionado em:
            <span class="font-weight-bold">Configurações</span>.
          </v-banner>          
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="computedDateFormattedDatefns"
                color="accent"
                label="Selecione uma data para visualizar o resumo"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              color="secondary"
              header-color="primary"
              locale="pt-br"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="accent"
                @click="modal = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                text
                color="accent"
                @click="$refs.dialog.save(date); filterByDate()"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-row>

        <v-row v-if="!loaded" justify="center">
          <v-progress-circular
            :size="200"
            color="secondary"
            indeterminate
          >
            <span class="text-body-1">PROCURANDO DADOS</span>
          </v-progress-circular>
        </v-row>

        <v-row justify="center">
          <v-col cols="6" class="d-flex justify-center">
            <v-card
              v-if="loaded && loadDayExpressions.length" 
              color="primary"
              elevation="6"
              min-width="300"
            >
              <v-card-title
                class="secondary--text font-weight-bold text-h5 justify-center"
              >
                Resumo do dia!
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text>
                <v-timeline
                  align-top
                  dense
                >
                  <v-timeline-item
                    v-for="value in loadDayExpressions"
                    :key="value.classification"
                    :icon="icons[value.classification].icon"
                    :icon-color="icons[value.classification].color"
                    fill-dot
                  >
                    <div class="text-body-1 text-capitalize accent--text">
                      {{ value.classification }}
                    </div>
                    <span class="font-weight-bold"> {{ value.part }}%</span>
                  </v-timeline-item>
                </v-timeline>                             
              </v-card-text>
            </v-card>          

            <span v-else-if="loaded" class="text-body-1 text-uppercase d-flex flex-column">
              Nenhum dado foi encontrado para hoje!
              <v-icon class="mt-6" size="60">fas fa-dizzy</v-icon>
            </span>
          </v-col>

          <v-col cols="6" class="d-flex justify-center">
              <v-card
                v-if="loaded && loadWeekExpressions.length" 
                color="primary"
                elevation="6"
                min-width="300"
                justify="center"
              >
                <v-card-title
                  class="secondary--text font-weight-bold text-h5 justify-center"
                >
                  Resumo da semana!
                </v-card-title>
                <v-divider></v-divider>
                <v-list class="transparent">
                    <v-list-item
                      v-for="day in loadWeekExpressions"
                      :key="day.day"
                    >
                      <v-list-item-title class="d-flex flex-column justify-space-around">
                        <span class="accent--text">{{ day.day }}</span>
                        <span class="grey--text text-caption">{{ day.date || '' }}</span>
                      </v-list-item-title>
                      <v-list-item-icon>
                        <v-icon :color=" day.classification ? icons[day.classification].color : 'grey'">
                          {{day.classification ?  icons[day.classification].icon : 'fas fa-times'}}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-subtitle class="text-right font-weight-bold">
                        {{ day.part || '0.00' }}%
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
              </v-card>

              <span v-else-if="loaded" class="text-body-1 text-uppercase d-flex flex-column">
                Nenhum dado foi encontrado para essa semana!
                <v-icon class="mt-6" size="60">fas fa-dizzy</v-icon>
              </span> 
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import { format, parseISO } from 'date-fns';

export default {
    name: 'Dashboard',
    data: () => ({
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      modal: false,
      selectedLink: 0,
      dataReady: false,
      expressions: [],
      loaded: false,
      icons: {
        neutro: {
          icon: 'fas fa-meh',
          color: 'grey lighten-1',
        },
        feliz: {
          icon: 'fas fa-smile-beam',
          color: 'yellow',
        },
        triste: {
          icon: 'fas fa-frown',
          color: 'blue',
        },
        irritado: {
          icon: 'fas fa-angry',
          color: 'red',
        },
        surpreso: {
          icon: 'fas fa-surprise',                
          color: 'yellow darken-3'
        },
      },
    }),
    async mounted() {
      this.loaded = false;
      await this.$store.dispatch('expressions/getByDateExpressions', this.date);
      await this.$store.dispatch('expressions/getWeekExpressions', this.date);
      this.loaded = true;
    },
    methods: {
      async filterByDate() {
        this.loaded = false;
        await this.$store.dispatch('expressions/getByDateExpressions', this.date);
        await this.$store.dispatch('expressions/getWeekExpressions', this.date);
        this.loaded = true;
      }
    },
    computed: {
      loadDayExpressions() {
        return this.$store.getters['expressions/dayExpressions'];
      },
      loadWeekExpressions() {
        return this.$store.getters['expressions/weekExpressions'];
      },
      computedDateFormattedDatefns () {
        return this.date ? format(parseISO(this.date), 'dd/MM/yyyy') : ''
      },
    },
  }
</script>