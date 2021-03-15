<template>
    <v-container
    :style="{'margin-top':margen}">
    <v-btn class="secondary" target="_blank"
    :to="{name:'descargar_formula', params:{codigo: `${codigo}-0`}}"
    >Ver Formula</v-btn>
    <h1>Seguimiento de partida: {{codigo}}</h1>
    <br>
    <proceso></proceso>
    </v-container>
</template>
<script>
import proceso from '../components/orden_tenido_seguimiento/proceso.vue';

export default {
  components: {
    proceso,
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
    mostrar_curtido() {
      this.curtido = true;
    },
  },

};
</script>
