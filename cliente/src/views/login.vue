<template>
  <v-main class="grey lighten-2 full-height">
      <v-container
      class="d-flex align-center full-height">
          <v-card
          class="mx-auto"
          :width="anchura">
              <v-card-title>
                  Inicio de Sesion
              </v-card-title>
              <v-card-text>
                <v-text-field>
                </v-text-field>
                <v-text-field>
                </v-text-field>
                <v-btn class="mr-2">
                  Iniciar Sesion
                </v-btn>
                <v-btn>
                  Recuperar Contraseña
                </v-btn>
              </v-card-text>
          </v-card>
      </v-container>
  </v-main>
</template>
<script>
export default {
  computed: {
    anchura() {
      const x = window.screen.width;
      if (x > 960) {
        return '500px';
      } return '5px';
    },
  },
};
</script>
<style>
.full-height {
    height: 100vh
}
</style>
