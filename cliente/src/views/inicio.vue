<template>
  <div>
    <v-card outlined>
      <v-img
      height="100vh"
      :src="url_base+'/api/imagen?imagen=bienvenida.png&width=1000&height=700'"
      :lazy-src="url_base+'/api/imagen?imagen=bienvenida.png&width=10&height=10'">
        <v-container
        fill-height>
          <div align="center" style="width:100%">
            <v-card :width="anchura" style="background-color:rgba(30,30,30,0.6)">
              <div class="py-10">
                <div class=" px-5">
                  <!-- eslint-disable -->
                  <h3 class="font-weight-bold display-1 font-weight-black mv-0 mb-3 text-left white--text">
                      Bienvenid@ al sistema de control de produccion para empresas de curtiembre CITECCAL AQP CURT-PROD
                  </h3>
                  <v-divider color="white"></v-divider>
                  <!-- eslint-disable -->
                  <p class="base-body body-1 mt-10 text-left white--text">
                      Con esta herramienta usted podra gestionar recursos indispensables para su empresa entre los cuales se encuentran:
                      <ul class="">
                        <li>Materiales (No Logistico)</li>
                        <li>Formulas</li>
                        <li>Ordenes de Produccion</li>
                        <li>Ordenes de Tiras</li>
                        <li>Reportes de Seguimiento</li>
                      </ul> 
                  </p>
                  <div align="center">
                      <v-btn
                      class="primary white--text justify-center mr-3"
                      rounded>Cambiar Contraseña</v-btn>
                      <v-btn
                      class="success white--text justify-center"
                      rounded>
                        Gestionar Empresa
                      </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </v-container>
      </v-img>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url_base: process.env.VUE_APP_URL_SERVER,
    };
  },
  computed: {
    anchura() {
      const x = window.screen.width;
      if (x > 960) {
        return '1200px';
      } return '500px';
    },
    altura() {
      const x = window.screen.width;
      if (x > 960) {
        return '40vh';
      } return '100vh';
    },
  },
};
</script>
