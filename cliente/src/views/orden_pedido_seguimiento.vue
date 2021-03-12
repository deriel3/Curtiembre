<template>
    <v-container
    :style="{'margin-top':margen}">
    <v-btn class="secondary" target="_blank"
    :to="{name:'descargar_formula', params:{codigo: `${codigo}-0`}}"
    >Ver Formula de Pelambre</v-btn>
    <h1>Seguimiento de partida: {{codigo}}</h1>
    <br>
    <h3>Proceso de Pelambre:</h3>
    <pelambre @cambiartexto=mostrar_curtido></pelambre>
    <div v-if="curtido">
      <h3>Proceso de Curtido:</h3>
      <curtido></curtido>
    </div>
    </v-container>
</template>
<script>
import pelambre from '../components/orden_pedido_seguimiento/pelambre.vue';
import curtido from '../components/orden_pedido_seguimiento/curtido.vue';

export default {
  components: {
    pelambre,
    curtido,
  },
  data() {
    return {
      curtido: false,
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
