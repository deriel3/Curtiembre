<template>
  <v-container
  :style="{'margin-top':margen}">
  <div>
    <h1 class="d-inline ml-8">Almacenes de la empresa</h1>
    <OrdenIngreso class="d-inline float-right"></OrdenIngreso>
  </div>
  <lista></lista>
  </v-container>
</template>
<script>
import lista from '../components/almacenes/lista.vue';
import OrdenIngreso from '../components/almacenes/orden_ingreso.vue';

export default {
  components: {
    lista,
    OrdenIngreso,
  },
  data() {
    return {
      margen: 0,
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
