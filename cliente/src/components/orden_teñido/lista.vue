<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      width="1500px"
      class="mx-auto my-5">
        <v-card-text>
          <div align="center">
            <h1>Seguimiento de la Orden de Teñido: </h1>
            <v-text-field
            :readonly="true"
            v-model="seleccionados[0].codigo"
            label="Codigo">
            </v-text-field>
            <v-btn color="primary" class="mr-4"
            :to="{name:'orden_tenido_seguimiento', params:{codigo: seleccionados[0].codigo}}">
            Seguimiento</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details></v-text-field>
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
      :items="lista_articulos"
      :search="search">
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
      search: '',
      headers: [{
        text: 'Codigo',
        align: 'start',
        value: 'codigo',
      },
      {
        text: 'Kilos',
        value: 'kilos',
      },
      {
        text: 'Pieles',
        value: 'pieles',
      },
      {
        text: 'Formula',
        value: 'formula',
      }],
      lista_articulos: [],
    };
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    actualizar_estado(nuevoestado) {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/estado_articulo',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          estado: nuevoestado,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Articulo Actualizado');
            this.seleccionados = [];
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    actualizar_tabla() {
      this.cargando = true;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_ot',
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
            this.lista_articulos = data.data;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    actualizar() {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/actualizar_articulo',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          base: this.seleccionados[0].base,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Usuario Actualizado');
            this.seleccionados = [];
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
