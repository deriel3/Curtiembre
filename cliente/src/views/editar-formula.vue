<template>
  <v-container
  :style="{'margin-top':margen}">
    <h1 class="ma-3">Edicion de formula: {{codigo}}</h1>
    <formulario></formulario>
  </v-container>
</template>
<script>
import formulario from '../components/editar-formula/formulario.vue';

export default {
  components: {
    formulario,
  },
  data() {
    return {
      margen: 0,
      codigo: this.$route.params.codigo,
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
