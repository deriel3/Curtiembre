<template>
  <v-container
  :style="{'margin-top':margen}">
    <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab >Lista de Materiales</v-tab>
        <v-tab >Importar Materiales</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Materiales Registrados</h1>
                  <v-btn class="d-inline float-right"
                  icon
                  outlined
                  color="primary"
                  @click="nuevo_material">
                      <v-icon>mdi-plus</v-icon>
                  </v-btn>
              </div>
              <lista></lista>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Importar materiales</h1>
              </div>
              <importar></importar>
          </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
import lista from '../components/material/ListaMaterial.vue';
import importar from '../components/material/ImportarMaterial.vue';

export default {
  components: {
    lista,
    importar,
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
    nuevo_material() {
    },
  },

};
</script>
