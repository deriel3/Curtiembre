<template>
    <v-container
    :style="{'margin-top':margen}">
      <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab >Lista de producto</v-tab>
        <v-tab >Registrar Producto</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Productos Registrados</h1>
              </div>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Nuevo Producto:</h1>
              </div>
              <registrar></registrar>
          </v-tab-item>
      </v-tabs-items>
    </div>
    </v-container>
</template>
<script>
import registrar from '../components/desarrollo-producto/registrar.vue';

export default {
  components: {
    registrar,
  },
  data() {
    return {
      margen: 0,
      tab: 0,
    };
  },
  mounted() {
    this.margen = this.f_margen();
  },
  methods: {
    f_margen() {
      const header = document.getElementsByTagName('header')[0];
      return window.getComputedStyle(header).getPropertyValue('height');
    },
  },

};
</script>
