<template>
  <v-container :style="{'margin-top':margen}">
    <v-tabs  color="primary"
    style="position:fixed; z-index:1"
    v-model="tab">
        <v-tab >Lista de usuarios</v-tab>
        <v-tab >Registrar usuarios</v-tab>
    </v-tabs>
    <div class="font-weight-bold mb-2" :style="{'margin-top':margen}">
      <v-tabs-items v-model="tab">
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Usuarios del sistema</h1>
              </div>
              <lista></lista>
          </v-tab-item>
          <v-tab-item>
              <div>
                  <h1 class="d-inline ml-8">Nuevo Usuario:</h1>
              </div>
              <registro></registro>
          </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
import lista from '../components/gestionar/lista-usuario.vue';
import registro from '../components/gestionar/registrar.vue';

export default {
  components: {
    lista,
    registro,
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
