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
            seja inicializado, para isso, acesse o menu câmera.
            Caso o aviso persista, verifique se você tem algum dispositivo conectado
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

        <v-row v-else-if="loaded && loadDayExpressions.length" justify="center">
          <v-card
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
                  <div class="text-body-1 text-capitalize accent--text font-weight-bold">
                    {{ value.classification }}
                  </div>
                  <span class="font-weight-bold"> {{ value.part + '%'}} </span>
                </v-timeline-item>
              </v-timeline>                             
            </v-card-text>
          </v-card>                     
        </v-row>
     
        <v-row v-else justify="center">
          <span class="text-h5 text-uppercase">
            Nenhum dado foi encontrado para esta data!
          </span> 
        </v-row>

        <v-row class="mt-10" justify="center">
          <v-col cols="12">
            <v-card color="primary">
              <pie-chart v-if="loaded && loadDayExpressions.length" :chartdata="chartData" :options="options"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import PieChart from '@/components/PieChart';
import { format, parseISO } from 'date-fns';

export default {
    name: 'Dashboard',
    components: {
      PieChart
    },
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
        }
      },
      chartData: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Gráfico Expressão x Tempo',
          data: [1, 1, 1, 1, 1, 1, 1],
          borderWidth: 2,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 0, 20)',
            'rgb(30, 18, 33)',
            'rgb(10, 90, 100)',
            'rgb(0, 200, 0)',
          ],
          hoverOffset: 10,
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: '#FFFFFF',
            fontFamily: "'Poppins', sans-serif",
            fontStyle: 'normal',
            color: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(255, 0, 20)',
              'rgb(30, 18, 33)',
              'rgb(10, 90, 100)',
              'rgb(0, 200, 0)',
            ]
          }
        },
        title: {
          display: true,
          text: 'Fração das emoções durante os dias da semana',
          fontColor: '#FFFFFF',
          fontSize: 16,
          fontFamily: "'Poppins', sans-serif",
          fontStyle: 'normal'
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }),
    async mounted() {
      await this.$store.dispatch('expressions/getAllTodayExpressions');
      this.loaded = false;
      await this.$store.dispatch('expressions/getByDateExpressions', this.date);
      this.loaded = true;
    },
    methods: {
      async filterByDate() {
        this.loaded = false;
        await this.$store.dispatch('expressions/getByDateExpressions', this.date);
        this.loaded = true;
      }
    },
    computed: {
      loadDayExpressions() {
        return this.$store.getters['expressions/dayExpressions'];
      },
      computedDateFormattedDatefns () {
        return this.date ? format(parseISO(this.date), 'dd/MM/yyyy') : ''
      },
    },
  }
</script>