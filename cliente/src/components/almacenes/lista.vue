<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      width="500px"
      class="mx-auto my-5">
        <v-card-text>
          <div align="center">
            <h1>Ver Historial de almacen: <br>{{seleccionados[0].descripcion}}</h1>
            <br>
            <v-btn color="success">Ver historial</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card-title>
          <v-spacer></v-spacer>
          <v-btn
          color="success"
          class="ml-5" @click="actualizar_tabla"><v-icon>mdi-restart</v-icon></v-btn>
      </v-card-title>
      <v-data-table
      v-model="seleccionados"
      item-key="codigo"
      show-select
      :loading="cargando"
      :single-select="true"
      :headers="headers"
      :items="material">
      </v-data-table>
    </v-card>
</template>
<script>
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  data() {
    return {
      cargando: false,
      seleccionados: [],
      headers: [{
        text: 'Codigo de almacen',
        align: 'start',
        value: 'codigo',
      },
      {
        text: 'Almacen',
        value: 'descripcion',
      },
      {
        text: 'Cantidad de Pieles/Cuero',
        value: 'cantidad',
      },
      {
        text: 'Fecha de actualizacion',
        value: 'fecha',
      }],
      material: [],
    };
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    actualizar_tabla() {
      this.cargando = true;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_almacenes',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      };
      axios(option)
        .then((res) => {
          this.cargando = false;
          const { data } = res;
          if (data.cod === '200') {
            this.material = data.data.cabecera;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
  },
};
</script>
