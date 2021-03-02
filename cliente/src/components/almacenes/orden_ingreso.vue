<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          outlined
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Orden de ingreso
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Orden de ingreso:<br>Materia Prima - Piel cruda
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="cantidad"
                  label="Cantidad de pieles"
                  :error-messages="cantidadErrors"
                  @input="$v.cantidad.$touch()"
                  @blur="$v.cantidad.$touch()"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="12"
              >
                <v-textarea
                  v-model="observacion"
                  label="Observaciones"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="black"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="primary"
            text
            @click="guardar"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
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
    cantidad: { required },
  },
  data() {
    return {
      dialog: false,
      cantidad: 0,
      observacion: '',
    };
  },
  computed: {
    cantidadErrors() {
      const errors = [];
      if (!this.$v.cantidad.$dirty) return errors;
      if (!this.$v.cantidad.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
  methods: {
    guardar() {
      this.$v.cantidad.$touch();
      if (this.cantidad !== 0 && !this.$v.cantidad.$error) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/guardar_ingreso',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            accion: 0,
            cod_almacen: 'MP',
            cantidad: this.cantidad,
            observacion: this.observacion,
          },
        };
        axios(option)
          .then((res) => {
            const { data } = res;
            console.log(data.data);
            if (data.cod === '200') {
              this.cantidad = 0;
              this.observacion = '';
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      } else {
        this.$toast.error('Ingrese una cantidad correcta');
      }
    },
  },
};
</script>
