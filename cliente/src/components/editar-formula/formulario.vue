<template>
  <v-card class="mx-auto">
    <v-card-text>
      <div>
        <v-row class="ma-1">
          <v-col
          md=3
          cols=4>
          <v-select
          :items="procesos"
          v-model="tipo_formula"
          item-value="codigo"
          item-text="proceso"
          label="Tipo de formula">
          </v-select></v-col>
          <v-col
          md="2"
          sm="2"
          cols="4">
            <v-text-field
            v-model="peso"
            :readonly="true"
            label="Peso (KG)">
            </v-text-field>
          </v-col>
          <v-col
          md=3
          cols=3>
          <v-text-field
          :readonly="true"
          label="Autor"
          v-model="autor"></v-text-field></v-col>
          <v-col
          md=1
          cols=1>
          <v-text-field
          :readonly="true"
          label="Version"
          v-model="version"></v-text-field></v-col>
        </v-row>
      </div>
      <v-card v-if="seleccionados.length === 0" class="mx-auto ma-5">
          <v-card-title>Agregar Material a la formula</v-card-title>
          <v-card-text>
            <v-row>
              <v-col md="1">
                <v-text-field
                type="number"
                v-model="orden"
                label="Orden"></v-text-field>
              </v-col>
              <v-col md="2">
                <v-text-field
                type="number"
                v-model="porcentaje"
                label="Porcentaje"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-autocomplete
                :items="lista_materiales"
                item-value="codigo"
                item-text="descripcion"
                v-model="material"
                label="Material">
                </v-autocomplete>
              </v-col>
              <v-col md="2">
                <v-text-field
                :readonly="true"
                type="number"
                v-model="cantidad"
                label="Cantidad"></v-text-field>
              </v-col>
              <v-col md="1">
                <v-text-field
                v-model="tiempo"
                label="Tiempo (min)"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                v-model="observacion"
                label="Observacion"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="agregar_material(0)">Agregar material</v-btn>
          </v-card-text>
      </v-card>
      <v-card v-if="seleccionados.length !== 0" class="mx-auto ma-5">
          <v-card-title>Editar Material</v-card-title>
          <v-card-text>
            <v-row>
              <v-col md="1">
                <v-text-field
                type="number"
                v-model="seleccionados[0].orden"
                label="Orden"></v-text-field>
              </v-col>
              <v-col md="2">
                <v-text-field
                type="number"
                v-model="seleccionados[0].porcentaje"
                label="Porcentaje"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-autocomplete
                :items="lista_materiales"
                item-value="codigo"
                item-text="descripcion"
                v-model="seleccionados[0].material"
                label="Material">
                </v-autocomplete>
              </v-col>
              <v-col md="2">
                <v-text-field
                :readonly="true"
                type="number"
                v-model="cantidad_editar"
                label="Cantidad"></v-text-field>
              </v-col>
              <v-col md="1">
                <v-text-field
                v-model="seleccionados[0].tiempo"
                label="Tiempo (min)"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                v-model="seleccionados[0].observacion"
                label="Observacion"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="secondary" class="mr-3" @click="actualizar">Guardar</v-btn>
            <v-btn color="error" @click="eliminar"> Eliminar material</v-btn>
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
        class="ml-5" @click="actualizar_data"><v-icon>mdi-restart</v-icon></v-btn>
      </v-card-title>
      <v-data-table
      v-model="seleccionados"
      item-key="codigo"
      show-select
      :loading="cargando"
      :single-select="true"
      :headers="headers"
      :items="lista_formulas"
      :search="search">
      </v-data-table>
      <p class="red--text">*Al presionar el boton guardar cambios se creara una nueva version
      de la formula sustituyendo a la anterior.</p>
      <v-btn color="primary" class="mr-3" @click="guardar_cambios">Guardar Cambios</v-btn>
      <v-btn color="error">Cancelar</v-btn>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  data() {
    return {
      peso: 1,
      procesos: [],
      seleccionados: [],
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
      lista_materiales: [],
      lista_formulas: [],
      search: '',
      cargando: false,
      tipo_formula: '',
      autor: '',
      version: '',
      orden: '',
      porcentaje: '',
      material: '',
      tiempo: '',
      observacion: '',
      codigo: this.$route.params.codigo,
    };
  },
  created() {
    this.actualizar_data();
  },
  computed: {
    desc() {
      if (this.material !== '') {
        const el = this.lista_materiales.filter((item) => item.codigo === this.material);
        return el;
      }
      return '';
    },
    desc_editar() {
      if (this.seleccionados[0].material !== '') {
        const elemento = this.seleccionados[0].material;
        const el = this.lista_materiales.filter((item) => item.codigo === elemento);
        return el[0].descripcion;
      }
      return '';
    },
    cantidad() {
      if (this.porcentaje !== '') {
        const cantidad = (parseFloat(this.porcentaje) * 1) / 100;
        return parseFloat(cantidad).toFixed(4);
      }
      return '0';
    },
    cantidad_editar() {
      if (this.seleccionados[0].porcentaje !== '') {
        const cant = (parseFloat(this.seleccionados[0].porcentaje) * 1) / 100;
        return parseFloat(cant).toFixed(4);
      }
      return '0';
    },
  },
  methods: {
    guardar_cambios() {
      this.cargando = true;
      const valor = this.lista_formulas.map((obj) => Object.values(obj));
      for (let i = 0; i < valor.length; i += 1) {
        valor[i].splice(5, 1);
      }
      const cod = this.$route.params.codigo;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/guardar_cambios',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cod,
          detalle: valor,
        },
      };
      console.log(option);
      axios(option)
        .then((res) => {
          this.cargando = false;
          const { data } = res;
          if (data.cod === '200') {
            this.$toast.success('Formula actualizada');
            this.actualizar_data();
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    eliminar() {
      this.lista_formulas = this.lista_formulas.filter((item) => {
        if (item.codigo !== this.seleccionados[0].codigo) {
          return true;
        }
        return false;
      });
      this.$toast.success('Material eliminado');
      this.seleccionados = [];
    },
    actualizar() {
      this.seleccionados[0].cantidad = this.cantidad_editar;
      this.seleccionados[0].descripcion = this.desc_editar;
      this.$toast.success('Datos actualizados.');
      this.seleccionados = [];
    },
    agregar_material(tipo) {
      if (tipo === 0) {
        if (this.codigo !== ''
        && this.porcentaje !== ''
        && this.material !== ''
        && this.cantidad !== '') {
          const datomaterial = this.material.split('-');
          const random = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
          const detalle = {
            orden: this.orden,
            codigo: `${this.codigo}-${random}`,
            cabecera: this.codigo.toUpperCase(),
            porcentaje: this.porcentaje,
            material: datomaterial[0],
            descripcion: this.desc[0].descripcion,
            cantidad: this.cantidad,
            tiempo: this.tiempo,
            observacion: this.observacion,
          };
          this.lista_formulas.push(detalle);
          this.porcentaje = '';
          this.material = '';
          this.tiempo = '';
          this.observacion = '';
        } else {
          this.$toast.error('LLene los campos requeridos.');
        }
      }
    },
    actualizar_data() {
      this.cargando = true;
      const cod = this.$route.params.codigo;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_formula',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cod,
        },
      };
      axios(option)
        .then((res) => {
          this.cargando = false;
          const { data } = res;
          if (data.cod === '200') {
            this.lista_formulas = data.data.detalle;
            this.procesos = data.data.proceso;
            this.tipo_formula = data.data.cabecera[0].proceso;
            this.autor = data.data.cabecera[0].usuario_creador;
            this.version = data.data.cabecera[0].version;
            this.lista_materiales = data.data.material;
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
