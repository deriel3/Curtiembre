<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      class="mx-auto my-5">
        <v-card-title>
            <v-spacer></v-spacer>
            <v-btn
            color="warning"
            class="ml-5" :to="{name:'editar-formula', params:{codigo: seleccionados[0].codigo}}"
            >Editar Formula</v-btn>
        </v-card-title>
        <v-card-text>
          <div align="center">
            <h1>Detalle de formula: {{seleccionados[0].codigo}}</h1>
            <v-data-table
            :loading="cargando_detalle"
            :headers="detalle_headers"
            :items="lista_detalle"></v-data-table>
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
      :items="lista_formulas"
      :search="search"
      @item-selected="cabecera_seleccionada">
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
        text: 'Peso Base',
        value: 'peso_base',
      },
      {
        text: 'Usuario Autor',
        value: 'usuario_creador',
      },
      {
        text: 'Tipo de formula',
        value: 'proceso',
      }],
      detalle_headers: [{
        text: 'Orden',
        value: 'orden',
      },
      {
        text: 'Codigo',
        align: 'start',
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
      lista_formulas: [],
      cargando_detalle: false,
      lista_detalle: [],
    };
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    cabecera_seleccionada(item) {
      if (item.value) {
        this.obtener_detalle(item.item.codigo);
      }
    },
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
    obtener_detalle(cabecera) {
      this.cargando_detalle = true;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_detalle',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cabecera,
        },
      };
      axios(option)
        .then((res) => {
          this.cargando_detalle = false;
          const { data } = res;
          if (data.cod === '200') {
            this.lista_detalle = data.data;
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
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_formula',
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
            this.lista_formulas = data.data;
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
