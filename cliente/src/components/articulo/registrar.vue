<template>
  <v-container>
    <v-card
    class="mx-auto pa-5" width ="500">
      <v-text-field
      v-model="codigo"
      :error-messages="codigoErrors"
      @focusout="verificar_codigo"
      @input="$v.codigo.$touch()"
      @blur="$v.codigo.$touch()"
      label="Codigo del articulo">
      </v-text-field>
      <v-text-field
      v-model="base"
      :error-messages="baseErrors"
      @input="$v.base.$touch()"
      @blur="$v.base.$touch()"
      label="Nombre del articulo">
      </v-text-field>
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
    base: { required },
  },
  data() {
    return {
      codigo: '',
      base: '',
      articulo: true,
    };
  },
  methods: {
    verificar_codigo() {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/verificar_codigo_articulo',
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
    },
    guardar_producto() {
      if (this.validar()) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/nuevo_articulo',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            producto: [this.codigo,
              this.base],
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
      this.base = '';
      this.color = '';
      this.calibre = '';
      this.articulo = true;
    },
    validar() {
      this.$v.codigo.$touch();
      this.$v.base.$touch();
      if (!this.$v.codigo.$error
      && !this.$v.base.$error) {
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
    baseErrors() {
      const errors = [];
      if (!this.$v.base.$dirty) return errors;
      if (!this.$v.base.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
};
</script>
