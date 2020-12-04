<template>
  <div>
    <v-card
      class="mx-auto my-12"
      max-width="500">
      <v-file-input
        v-model="file"
        label="Seleccione un archivo .csv"
        accept=".csv"
        @change="visualizararchivo"
      ></v-file-input>
    </v-card>
    <div v-if="seleccion">
      <v-data-table
      v-model="seleccionados"
      item-key="codigo"
      show-select
      :loading="cargando"
      :single-select="false"
      :headers="headers"
      :items="materiales"
      :search="search"
      :options="{itemsPerPage:50}">
      </v-data-table>
      <v-btn v-if="verificar" @click="GuardarMaterial" color="primary">Guardar Seleccionados</v-btn>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx';
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  data() {
    return {
      file: {},
      cargando: false,
      seleccion: false,
      seleccionados: [],
      search: '',
      headers: [{
        text: 'codigo',
        align: 'start',
        value: 'codigo',
      },
      {
        text: 'Descripcion',
        value: 'descripcion',
      }],
      material: [],
    };
  },
  computed: {
    materiales() {
      return this.material;
    },
    verificar() {
      return this.seleccionados.length > 0;
    },
  },
  methods: {
    visualizararchivo() {
      this.cargando = true;
      this.seleccion = true;
      const f = this.file;
      this.material = [];
      if (typeof f !== 'undefined') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const datos = XLSX.utils.sheet_to_json(worksheet);
          if (typeof datos[0].codigo !== 'undefined' || typeof datos[0].descripcion !== 'undefined') {
            this.BorrarDuplicados(datos);
          } else {
            this.$toast.error('Seleccione un Archivo que cumpla con la plantilla correspondiente.');
            this.cargando = false;
            this.seleccion = false;
          }
        };
        reader.readAsArrayBuffer(f);
      } else {
        this.cargando = false;
        this.seleccion = false;
      }
    },
    BorrarDuplicados(datos) {
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
          let flag = false;
          const todos = res.data.data;
          for (let i = 0; i < datos.length; i += 1) {
            flag = false;
            for (let j = 0; j < todos.length; j += 1) {
              if (datos[i].codigo.toString() === todos[j].codigo.toString()) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              this.material.push(datos[i]);
            }
          }
          this.cargando = false;
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    GuardarMaterial() {
      const valor = this.seleccionados.map((obj) => Object.values(obj));
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/importar_materiales',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          materiales: valor,
        },
      };
      axios(option)
        .then((res) => {
          console.log(res);
          if (res.data.cod === '200') {
            this.$toast.success('Datos importados con exito.');
            this.material = [];
            this.cargando = false;
            this.seleccion = false;
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
