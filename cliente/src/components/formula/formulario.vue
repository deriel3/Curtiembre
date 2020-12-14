<template>
  <div>
    <v-card width="1500px" class="mx-auto">
      <v-card-title>
        <v-row>
          <v-col
          md="3"
          sm="3"
          cols="5">
            <v-text-field
            v-model="codigo"
            @focusout="validar()"
            :error-messages="codigoErrors"
            @input="$v.codigo.$touch()"
            @blur="$v.codigo.$touch()"
            label="Codigo de Formula">
            </v-text-field>
          </v-col>
          <v-col
          md="1"
          sm="1"
          cols="3">
            <v-text-field
            v-model="peso"
            :readonly="true"
            label="Peso (KG)">
            </v-text-field>
          </v-col>
          <v-col
          md="2"
          sm="2"
          cols="4">
            <v-select
            :error-messages="tipoErrors"
            @input="$v.tipo_formula.$touch()"
            @blur="$v.tipo_formula.$touch()"
            :items="items"
            v-model="tipo_formula"
            item-value="codigo"
            item-text="proceso"
            label="Tipo de formula">
            </v-select>
          </v-col>
          <v-col
          md="2"
          sm="2"
          cols="4">
            <v-text-field
            v-model="version"
            :readonly="true"
            label="Version:">
            </v-text-field>
          </v-col>
          <v-col
          md="3"
          sm="3"
          cols="8">
            <v-text-field
            v-model="creado"
            :readonly="true"
            label="Creado por (DNI):">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-card v-if="codigo_validado" width="1000" class="mx-auto ma-5">
          <v-card-title>Agregar Material a la formula</v-card-title>
          <v-card-text>
            <v-row>
              <v-col md="3">
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
              <v-col md="3">
                <v-text-field
                :readonly="true"
                type="number"
                v-model="cantidad"
                label="Cantidad"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-text-field
                v-model="tiempo"
                label="Tiempo "></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="agregar_material">Agregar material</v-btn>
          </v-card-text>
        </v-card>
        <h1>Vista Previa</h1>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn
          color="error"
          class="ml-5" v-if="seleccionados.length>0" >Borrar seleccionados</v-btn>
      </v-card-title>
        <v-data-table
        v-model="seleccionados"
        show-select
        item-key="codigo"
        :headers="cabecera"
        :items="lista_previa"
        :single-select="false"
        class="elevation-1 mt-5"></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary"
        >Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';
import EventBus from '../../EventBus/EventBus';
import store from '../../store/index';

export default {
  mixins: [validationMixin],

  validations: {
    codigo: { required },
    tipo_formula: { required },
  },
  data() {
    return {
      codigo_validado: false,
      codigo: '',
      peso: 1,
      tipo_formula: '',
      version: 1,
      creado: store.state.user.id,
      items: [],
      lista_materiales: [],
      cabecera: [
        {
          text: 'Codigo del Detalle',
          value: 'codigo',
        },
        {
          text: 'Porcentaje',
          value: 'porcentaje',
        },
        {
          text: 'Material',
          value: 'material',
        },
        {
          text: 'Cantidad',
          value: 'cantidad',
        },
        {
          text: 'Tiempo',
          value: 'tiempo',
        },
      ],
      lista_previa: [],
      seleccionados: [],
      porcentaje: '',
      material: '',
      tiempo: 0,
    };
  },
  created() {
    this.obtener_proceso();
  },
  computed: {
    cantidad() {
      if (this.porcentaje !== '') {
        const cantidad = (parseInt(this.porcentaje, 10) * 1) / 100; 
        return cantidad;
      } else {
        return "No se pudo calcular";
      }
    },
    codigoErrors() {
      const errors = [];
      if (!this.$v.codigo.$dirty) return errors;
      if (!this.$v.codigo.required) errors.push('El campo obligatorio.');
      return errors;
    },
    tipoErrors() {
      const errors = [];
      if (!this.$v.tipo_formula.$dirty) return errors;
      if (!this.$v.tipo_formula.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
  methods: {
    validar() {
      if (this.codigo !== '') {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/validar_codigo_formula',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            codigo: this.codigo,
          },
        };
        axios(option)
          .then((res) => {
            if (res.data.cod === '200') {
              this.$toast.success('Codigo correcto');
              this.codigo_validado = true;
            } else {
              this.$toast.error('Codigo ya registrado.');
              this.codigo_validado = false;
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      } else {
        this.$toast.error('Ingresa un codigo valido');
      }
    },
    obtener_proceso() {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_proceso',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.items = res.data.data;
            this.lista_materiales = res.data.material;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    agregar_material() {
      if (this.codigo !== '') {
        const random = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
        const material = {
          codigo: `${this.codigo}-${random}`,
          porcentaje: this.porcentaje,
          material: this.material,
          cantidad: this.cantidad,
          tiempo: this.tiempo,
        };
        this.lista_previa.push(material);
      } else {
        this.$toast.error('Ingrese un codigo para la formula.');
      }
    },
  },
};
</script>
