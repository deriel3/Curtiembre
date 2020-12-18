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
        <v-card v-if="codigo_validado" class="mx-auto ma-5">
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
            <v-btn color="primary" @click="agregar_material">Agregar material</v-btn>
          </v-card-text>
        </v-card>
        <h1>Vista Previa</h1>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn
          color="error"
          class="ml-5" v-if="seleccionados.length>0" @click="borrar_seleccionado">
          Borrar seleccionados</v-btn>
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
        @click="guardar_formula"
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
          text: 'Orden',
          value: 'orden',
        },
        {
          text: 'Codigo del Detalle',
          value: 'codigo',
        },
        {
          text: 'Porcentaje',
          value: 'porcentaje',
        },
        {
          text: 'Codigo',
          value: 'codigo_material',
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
          text: 'Tiempo (min)',
          value: 'tiempo',
        },
        {
          text: 'Observacion',
          value: 'observacion',
        },
      ],
      lista_previa: [],
      lista_detalle: [],
      seleccionados: [],
      orden: '',
      porcentaje: '',
      material: '',
      tiempo: '',
      observacion: '',
    };
  },
  created() {
    this.obtener_proceso();
  },
  computed: {
    cantidad() {
      if (this.porcentaje !== '') {
        const cantidad = (parseFloat(this.porcentaje) * 1) / 100;
        return parseFloat(cantidad).toFixed(4);
      }
      return '0';
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
    borrar_seleccionado() {
      const nuevalista = [];
      const nuevodetalle = [];
      for (let i = 0; i < this.lista_previa.length; i += 1) {
        let flag = false;
        for (let j = 0; j < this.seleccionados.length; j += 1) {
          if (this.lista_previa[i].codigo === this.seleccionados[j].codigo) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          nuevalista.push(this.lista_previa[i]);
          const detalle = {
            codigo: this.lista_previa[i].codigo,
            cabecera: this.codigo.toUpperCase(),
            material: this.lista_previa[i].codigo_material,
            porcentaje: this.lista_previa[i].porcentaje,
            cantidad: this.lista_previa[i].cantidad,
            tiempo: this.lista_previa[i].tiempo,
            observacion: this.lista_previa[i].observacion,
          };
          nuevodetalle.push(detalle);
        }
      }
      this.lista_previa = nuevalista;
      this.seleccionados = [];
      this.lista_detalle = nuevodetalle;
    },
    reiniciar() {
      this.codigo = '';
      this.tipo_formula = '';
      this.lista_previa = [];
      this.lista_detalle = [];
    },
    guardar_formula() {
      const valor = this.lista_detalle.map((obj) => Object.values(obj));
      console.log(valor);
      if (this.codigo_validado) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/guardar_formula',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            codigo: this.codigo.toUpperCase(),
            usuario_creado: this.creado,
            proceso: this.tipo_formula,
            detalle_formula: valor,
          },
        };
        axios(option)
          .then((res) => {
            if (res.data.cod === '200') {
              this.$toast.success('Formula registrada');
              this.reiniciar();
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      } else {
        this.$toast.error('Codigo erroneo');
      }
    },
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
              this.codigo = '';
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
      if (this.codigo !== ''
      && this.porcentaje !== ''
      && this.material !== ''
      && this.cantidad !== '') {
        const datomaterial = this.material.split('-');
        const random = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
        const material = {
          orden: this.orden,
          codigo: `${this.codigo}-${random}`,
          porcentaje: this.porcentaje,
          codigo_material: datomaterial[0],
          material: datomaterial[1],
          cantidad: this.cantidad,
          tiempo: this.tiempo,
          observacion: this.observacion,
        };
        const detalle = {
          orden: this.orden,
          codigo: `${this.codigo}-${random}`,
          cabecera: this.codigo.toUpperCase(),
          material: datomaterial[0],
          porcentaje: this.porcentaje,
          cantidad: this.cantidad,
          tiempo: this.tiempo,
          observacion: this.observacion,
        };
        this.lista_previa.push(material);
        this.lista_detalle.push(detalle);
        this.porcentaje = '';
        this.material = '';
        this.tiempo = '';
        this.observacion = '';
      } else {
        this.$toast.error('LLene los campos requeridos.');
      }
    },
  },
};
</script>
