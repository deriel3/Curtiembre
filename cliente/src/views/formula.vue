<template>
  <v-container
  :style="{'margin-top':margen}">
    <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab >Lista de Formulas</v-tab>
        <v-tab>Nueva Formula</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Formulas registradas</h1>
              </div>
              <lista></lista>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Registrar Formula</h1>
              </div>
              <formulario></formulario>
          </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
import formulario from '../components/formula/formulario.vue';
import lista from '../components/formula/lista.vue';

export default {
  components: {
    lista,
    formulario,
  },
  data() {
    return {
      margen: 0,
      tab: 0,
    };
  },
  mounted() {
    this.margen = this.f_margen();
    this.tab = parseInt(this.$route.query.tab, 10);
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
