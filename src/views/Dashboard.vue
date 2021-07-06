<template>
  <v-app>
    <AppBar/>   
    <v-main app>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-card elevation="6" min-width="300">
            <v-card-title
              class="grey--text secondary--text font-weight-bold text-h5 justify-center"
            >
              Resumo de hoje!
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-timeline
                align-top
                dense
              >
                <v-timeline-item
                  v-for="message in messages"
                  :key="message.time"
                  :color="message.color"
                  :icon="message.icon"
                  fill-dot
                >
                  <div class="text-body-1 secondary--text font-weight-normal">
                    <strong>{{ message.emotion }}</strong>
                  </div>
                  <span class="font-weight-bold">{{ message.quantity }}</span>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card> 
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import AppBar from '@/components/AppBar';

  export default {
    name: 'Dashboard',
    components: {
      AppBar,
    },
    data: () => ({
      selectedLink: 0,
      messages: [
        {
          emotion: 'Neutro',
          quantity: '45%',
          color: 'grey darken-2',
          icon: 'mdi-emoticon-neutral',
        },
        {
          emotion: 'Feliz',
          quantity: '35%',
          color: 'yellow darken-1',
          icon: 'mdi-emoticon-excited',
        },
        {
          emotion: 'Confuso',
          quantity: '8%',
          color: 'brown darken-2',
          icon: 'mdi-emoticon-confused',
        },
        {
          emotion: 'Triste',
          quantity: '6%',
          color: 'blue-grey lighten-1',
          icon: 'mdi-emoticon-sad',
        },
        {
          emotion: 'Enfurecido',
          quantity: '6%',
          color: 'red darken-2',
          icon: 'mdi-emoticon-angry',
        },
      ],
    }),
  }
</script>