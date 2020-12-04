<template>
  <v-container
  :style="{'margin-top':margen}">
    <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab >Formula de Preremojo y Pelambre</v-tab>
        <v-tab >Formula de Curtido</v-tab>
        <v-tab >Formula de Recurtido</v-tab>
        <v-tab >Formula de Acabado</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Lista de formulas: Preremojo y Pelambre</h1>
                  <v-btn class=" float-right"
                  dark
                  fab
                  small
                  color="primary"
                  :to="{name:'nueva-formula', query: { tipo: 'Preremojo y Pelambre', n: '0' }}">
                      <v-icon>mdi-plus</v-icon>
                  </v-btn>
              </div>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Lista de formulas: Curtido</h1>
                  <v-btn class=" float-right"
                  dark
                  fab
                  small
                  color="primary"
                  :to="{name:'nueva-formula', query: { tipo: 'Curtido', n: '1' }}">
                      <v-icon>mdi-plus</v-icon>
                  </v-btn>
              </div>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Lista de formulas: Recurtido</h1>
                  <v-btn class=" float-right"
                  dark
                  fab
                  small
                  color="primary"
                  :to="{name:'nueva-formula', query: { tipo: 'Recurtido', n: '2' }}">
                      <v-icon>mdi-plus</v-icon>
                  </v-btn>
              </div>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Lista de formulas: Acabado</h1>
                  <v-btn class=" float-right"
                  dark
                  fab
                  small
                  color="primary"
                  :to="{name:'nueva-formula', query: { tipo: 'Acabado', n: '3' }}">
                      <v-icon>mdi-plus</v-icon>
                  </v-btn>
              </div>
          </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
export default {
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
