<template>
  <v-container
  :style="{'margin-top':margen}">
    <div ref="formula">
      <h1>Codigo de Partida: {{codigo}}</h1>
      <v-btn class="secondary">Exportar a PDF</v-btn>
      <v-row>
        <v-col
        md="3"
        col="3">
          <v-text-field label="Codigo de formula"
          readonly
          v-model="cabecera.codigo">
          </v-text-field>
        </v-col>
        <v-col
        md="3"
        col="3">
          <v-text-field label="Kilos"
          readonly
          v-model="cabecera.kilos">
          </v-text-field>
        </v-col>
        <v-col
        md="3"
        col="3">
          <v-text-field label="Pieles"
          readonly
          v-model="cabecera.pieles">
          </v-text-field>
        </v-col>
        <v-col
        md="3"
        col="3">
          <v-text-field label="Autor de Formula"
          readonly
          v-model="cabecera.usuario">
          </v-text-field>
        </v-col>
      </v-row>
      <v-data-table
      item-key="codigo"
      :headers="headers"
      :items="lista_formulas">
      </v-data-table>
    </div>
  </v-container>
</template>
<script>
import axios from 'axios';
import store from '../store/index';
import EventBus from '../EventBus/EventBus';

export default {
  data() {
    return {
      cabecera: {
        codigo: '',
        kilos: 0,
        pieles: 0,
        usuario: '',
      },
      lista_formulas: [],
      headers: [{
        text: 'Orden',
        value: 'orden',
      },
      {
        text: 'Codigo',
        value: 'codigo',
      },
      {
        text: 'Porcentaje',
        value: 'porcentaje',
      },
      {
        text: 'Codigo de material',
        value: 'material',
      },
      {
        text: 'Material',
        value: 'descripcion',
      },
      {
        text: 'Cantidad',
        value: 'cantidad',
      },
      {
        text: 'Tiempo',
        value: 'tiempo',
      },
      {
        text: 'Observacion',
        value: 'observacion',
      }],
      codigo: this.$route.params.codigo.substring(0, this.$route.params.codigo.length - 2),
      margen: 0,
    };
  },
  mounted() {
    this.margen = this.f_margen();
    this.obtenerformula();
  },
  methods: {
    obtenerformula() {
      let proceso = this.$route.params.codigo.split('-');
      proceso = proceso[proceso.length - 1];
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obt_formula_proceso',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.codigo,
          proceso,
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.cabecera.kilos = data.data.cabecera[0].kilos;
            this.cabecera.codigo = data.data.cabecera[0].codigo;
            this.cabecera.pieles = data.data.cabecera[0].pieles;
            this.cabecera.usuario = data.data.cabecera[0].usuario_creador;
            this.lista_formulas = data.data.detalle;
            for (let i = 0; i < this.lista_formulas.length; i += 1) {
              const cantidad = this.lista_formulas[i].cantidad * this.cabecera.kilos;
              this.lista_formulas[i].cantidad = cantidad.toFixed(5);
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    f_margen() {
      const header = document.getElementsByTagName('header')[0];
      return window.getComputedStyle(header).getPropertyValue('height');
    },
  },

};
</script>
