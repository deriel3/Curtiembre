<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      width="500px"
      class="mx-auto my-5">
        <v-card-text>
          <div align="center">
            <h1>Informacion del acabado: </h1>
            <v-text-field
            :readonly="true"
            v-model="seleccionados[0].codigo"
            label="Codigo del acabado">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].codigo_articulo"
            :readonly = "true"
            label="Codigo del Articulo">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].acabado"
            label="Descripcion del acabado">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].color"
            label="Color">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].calibre"
            label="Calibre">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].frecurtido"
            label="Formula de recurtido"
            :readonly="true">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].facabado"
            :readonly="true"
            label="Formula de acabado">
            </v-text-field>
            <v-btn color="yellow lighten-1" class="mr-4" @click="actualizar">Actualizar</v-btn>
            <v-btn v-if="seleccionados[0].estado === 'Activo'" color="error" @click="desactivar">
              Desactivar</v-btn>
            <v-btn v-else color="success" @click="activar">Activar</v-btn>
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
        text: 'Codigo de articulo',
        value: 'codigo_articulo',
      },
      {
        text: 'Descripcion',
        value: 'acabado',
      },
      {
        text: 'Color',
        value: 'color',
      },
      {
        text: 'Calibre',
        value: 'calibre',
      },
      {
        text: 'Formula de recurtido',
        value: 'frecurtido',
      },
      {
        text: 'Formula de acabado',
        value: 'facabado',
      },
      {
        text: 'Estado',
        value: 'estado',
      }],
      lista_articulos: [],
    };
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    desactivar() {
      this.seleccionados[0].estado = 'Inactivo';
      this.actualizar_estado('Inactivo');
    },
    activar() {
      this.seleccionados[0].estado = 'Activo';
      this.actualizar_estado('Activo');
    },
    actualizar_estado(nuevoestado) {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/estado_acabado',
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
            this.$toast.success('Acabado Actualizado');
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
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_acabados',
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
        url: process.env.VUE_APP_URL_SERVER + '/api/actualizar_acabado',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          acabado: this.seleccionados[0].acabado,
          color: this.seleccionados[0].color,
          calibre: this.seleccionados[0].calibre,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Acabado Actualizado');
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
