<template>
    <v-container
    :style="{'margin-top':margen}">
    <v-btn class="secondary" target="_blank"
    :to="{name:'descargar_formula', params:{codigo: codigo}}"
    >Descargar Formula de Pelambre</v-btn>
    <h1>Seguimiento de partida: {{codigo}}</h1>
    <br>
    <h3>Proceso de Pelambre:</h3>
    <pelambre></pelambre>
    </v-container>
</template>
<script>
import pelambre from '../components/orden_pedido_seguimiento/pelambre.vue';

export default {
  components: {
    pelambre,
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
