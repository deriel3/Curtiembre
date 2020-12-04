<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      width="500px"
      class="mx-auto my-5">
        <v-card-text>
          <div align="center">
            <h1>Material: </h1>
            <v-text-field
            :readonly="true"
            v-model="seleccionados[0].codigo"
            label="Codigo">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].descripcion"
            label="Descripcion">
            </v-text-field>
            <v-btn color="yellow lighten-1" class="mr-4" @click="actualizar">Actualizar</v-btn>
            <v-btn v-if="seleccionados[0].estado === 'Activo'" color="error" @click="desactivar">
              Desactivar</v-btn>
            <v-btn v-else color="success" @click="activar">Activar</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card-title>
          Lista de Materiales
          <v-spacer></v-spacer>
          <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details></v-text-field>
      </v-card-title>
      <v-data-table
      v-model="seleccionados"
      item-key="codigo"
      show-select
      :loading="cargando"
      :single-select="true"
      :headers="headers"
      :items="material"
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
      cargando: true,
      seleccionados: [],
      search: '',
      headers: [{
        text: 'Codigo',
        align: 'start',
        value: 'codigo',
      },
      {
        text: 'Descripcion del material',
        value: 'descripcion',
      },
      {
        text: 'Estado',
        value: 'estado',
      }],
      material: [],
    };
  },
  created() {
    const { token } = store.state;
    const option = {
      // eslint-disable-next-line prefer-template
      url: process.env.VUE_APP_URL_SERVER + '/api/obtener_materiales',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    axios(option)
      .then((res) => {
        this.material = res.data.data;
        this.cargando = false;
      })
      .catch((err) => {
        if (err.response.status === 401) {
          EventBus.$emit('cerrar_sesion');
        }
      });
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
        url: process.env.VUE_APP_URL_SERVER + '/api/estado_material',
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
            this.$toast.success('Material Actualizado');
            this.seleccionados = [];
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
        url: process.env.VUE_APP_URL_SERVER + '/api/actualizar_material',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          descripcion: this.seleccionados[0].descripcion,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Material Actualizado');
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
