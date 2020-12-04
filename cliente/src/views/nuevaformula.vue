<template>
  <v-container
  :style="{'margin-top':margen}">
    <v-btn
    class="my-3"
    :to="{name:'formulas', query: { tab: tab}}"
    color="error">
      Volver
    </v-btn>
    <v-card>
      <v-card-title>
        <h1 class="display-1">Nueva Formula: {{tipo}}</h1>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
          md="4"
          sm="4"
          cols="4">
            <v-text-field
            label="Codigo de Formula:">
            </v-text-field>
          </v-col>
          <v-col
          md="4"
          sm="4"
          cols="4">
            <v-text-field
            readonly
            label="Peso Base (Kg):"
            value="1">
            </v-text-field>
          </v-col>
          <v-col
          md="4"
          sm="4"
          cols="4">
            <v-text-field
            readonly
            label="Elaborado por:"
            v-model="usuario">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <registro :tab="tab" :cabeceras="encabezados"></registro>
  </v-container>
</template>
<script>
import store from '../store/index';
import registro from '../components/formula/formulario.vue';

export default {
  components: {
    registro,
  },
  data() {
    return {
      tipo: '',
      margen: 0,
      usuario: '',
      tab: '',
      encabezados: [
        ['Remojo', 'Pelambre', 'Caleado'],
        ['Curtido'],
        ['Recurtido'],
        ['Acabado'],
      ],
    };
  },
  mounted() {
    this.margen = this.f_margen();
  },
  created() {
    this.tipo = this.$route.query.tipo;
    this.usuario = store.state.user.id;
    this.tab = this.$route.query.n;
  },
  methods: {
    f_margen() {
      const header = document.getElementsByTagName('header')[0];
      return window.getComputedStyle(header).getPropertyValue('height');
    },
  },
};
</script>
