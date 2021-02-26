<template>
  <v-container
  :style="{'margin-top':margen}">
    <div ref="formula">
      <h1>Codigo de Partida: {{codigo}}</h1>

    </div>
  </v-container>
</template>
<script>

export default {
  data() {
    return {
      tipo: this.$route.params.proceso,
      codigo: this.$route.params.codigo,
      margen: 0,
    };
  },
  mounted() {
    this.margen = this.f_margen();
    this.obtenerformula();
  },
  methods: {
    f_margen() {
      const header = document.getElementsByTagName('header')[0];
      return window.getComputedStyle(header).getPropertyValue('height');
    },
  },

};
</script>
