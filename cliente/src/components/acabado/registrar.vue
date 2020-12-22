<template>
  <v-container>
    <v-card
    class="mx-auto pa-5" width ="500">
    <v-btn color="success" @click="obtener_data">Refrescar Data</v-btn>
      <v-select
      v-model="codigo"
      item-value="codigo"
      item-text="base"
      :items="items_articulo"
      :error-messages="codigoErrors"
      @input="$v.codigo.$touch()"
      @blur="$v.codigo.$touch()"
      label="Articulo">
      </v-select>
      <v-text-field
      v-model="codigo_acabado"
      @focusout="verificar_codigo"
      :error-messages="codigo_acabadoErrors"
      @input="$v.codigo_acabado.$touch()"
      @blur="$v.codigo_acabado.$touch()"
      label="Codigo del acabado">
      </v-text-field>
      <v-text-field
      v-model="descripcion"
      :error-messages="descripcionErrors"
      @input="$v.descripcion.$touch()"
      @blur="$v.descripcion.$touch()"
      label="Descripcion del acabado">
      </v-text-field>
      <v-text-field
      v-model="calibre"
      :error-messages="calibreErrors"
      @input="$v.calibre.$touch()"
      @blur="$v.calibre.$touch()"
      label="Calibre">
      </v-text-field>
      <v-text-field
      v-model="color"
      :error-messages="colorErrors"
      @input="$v.color.$touch()"
      @blur="$v.color.$touch()"
      label="Color">
      </v-text-field>
      <v-select
      v-model="frecurtido"
      item-value="codigo"
      item-text="codigo"
      :items="items_frecurtido"
      :error-messages="frecurtidoErrors"
      @input="$v.frecurtido.$touch()"
      @blur="$v.frecurtido.$touch()"
      label="Formula de Recurtido">
      </v-select>
      <v-select
      v-model="facabado"
      item-value="codigo"
      item-text="codigo"
      :items="items_facabado"
      :error-messages="facabadoErrors"
      @input="$v.facabado.$touch()"
      @blur="$v.facabado.$touch()"
      label="Formula de Acabado">
      </v-select>
      <v-btn
      class="my-2"
      @click="guardar_producto"
      color="primary">
        Guardar
      </v-btn>
    </v-card>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  mixins: [validationMixin],

  validations: {
    codigo: { required },
    codigo_acabado: { required },
    descripcion: { required },
    calibre: { required },
    color: { required },
    frecurtido: { required },
    facabado: { required },
  },
  data() {
    return {
      codigo: '',
      codigo_acabado: '',
      descripcion: '',
      calibre: '',
      color: '',
      frecurtido: '',
      facabado: '',
      items_articulo: [],
      items_frecurtido: [],
      items_facabado: [],
    };
  },
  created() {
    this.obtener_data();
  },
  methods: {
    obtener_data() {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_data_acabado',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.items_articulo = res.data.data.articulo;
            this.items_frecurtido = res.data.data.frecurtido;
            this.items_facabado = res.data.data.facabado;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    verificar_codigo() {
      if (this.codigo_acabado !== '') {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/verificar_codigo_acabado',
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
            const { data } = res;
            if (data.cod === '200') {
              this.$toast.success('Codigo Disponible');
            } else {
              this.$toast.error('Codigo ya registrado');
              this.codigo = '';
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      }
    },
    guardar_producto() {
      if (this.validar()) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/nuevo_acabado',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            producto: [this.codigo,
              this.codigo_acabado,
              this.descripcion,
              this.color,
              this.calibre,
              this.frecurtido,
              this.facabado,
            ],
          },
        };
        axios(option)
          .then((res) => {
            const { data } = res;
            if (data.cod === '200') {
              this.$toast.success('Producto registrado');
              this.reiniciar();
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      }
    },
    reiniciar() {
      this.codigo = '';
      this.codigo_acabado = '';
      this.color = '';
      this.calibre = '';
      this.frecurtido = '';
      this.facabado = '';
      this.descripcion = '';
    },
    validar() {
      this.$v.codigo.$touch();
      this.$v.codigo_acabado.$touch();
      this.$v.descripcion.$touch();
      this.$v.calibre.$touch();
      this.$v.color.$touch();
      this.$v.frecurtido.$touch();
      this.$v.facabado.$touch();
      if (!this.$v.codigo.$error
      && !this.$v.codigo_acabado.$error
      && !this.$v.descripcion.$error
      && !this.$v.calibre.$error
      && !this.$v.color.$error
      && !this.$v.frecurtido.$error
      && !this.$v.facabado.$error) {
        return true;
      }
      return false;
    },
  },
  computed: {
    codigoErrors() {
      const errors = [];
      if (!this.$v.codigo.$dirty) return errors;
      if (!this.$v.codigo.required) errors.push('El campo obligatorio.');
      return errors;
    },
    codigo_acabadoErrors() {
      const errors = [];
      if (!this.$v.codigo_acabado.$dirty) return errors;
      if (!this.$v.codigo_acabado.required) errors.push('El campo obligatorio.');
      return errors;
    },
    descripcionErrors() {
      const errors = [];
      if (!this.$v.descripcion.$dirty) return errors;
      if (!this.$v.descripcion.required) errors.push('El campo obligatorio.');
      return errors;
    },
    calibreErrors() {
      const errors = [];
      if (!this.$v.calibre.$dirty) return errors;
      if (!this.$v.calibre.required) errors.push('El campo obligatorio.');
      return errors;
    },
    colorErrors() {
      const errors = [];
      if (!this.$v.color.$dirty) return errors;
      if (!this.$v.color.required) errors.push('El campo obligatorio.');
      return errors;
    },
    frecurtidoErrors() {
      const errors = [];
      if (!this.$v.frecurtido.$dirty) return errors;
      if (!this.$v.frecurtido.required) errors.push('El campo obligatorio.');
      return errors;
    },
    facabadoErrors() {
      const errors = [];
      if (!this.$v.facabado.$dirty) return errors;
      if (!this.$v.facabado.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
};
</script>
