<template>
    <v-container
    :style="{'margin-top':margen}">
      <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab>Seguimiento de Ordenes de Teñido</v-tab>
        <v-tab>Registrar Orden de teñido</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Ordenes de teñido registradas</h1>
              </div>
              <lista></lista>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Nueva Orden de teñido:</h1>
              </div>
              <formulario></formulario>
          </v-tab-item>
      </v-tabs-items>
    </div>
    </v-container>
</template>
<script>
import formulario from '../components/orden_teñido/formulario.vue';
import lista from '../components/orden_teñido/lista.vue';

export default {
  components: {
    formulario,
    lista,
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
