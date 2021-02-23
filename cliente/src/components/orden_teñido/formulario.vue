<template>
  <v-container>
    <v-card width="1500" class="mx-auto pa-4">
      <v-btn color="success" @click="obtener_datos">Refrescar Data</v-btn>
      <v-select
        label="Formula"
        :items="f_pelambre"
        item-value="codigo"
        item-text="codigo"
        v-model="Fpelambre"
        :error-messages="pelambreErrors"
        @input="$v.Fpelambre.$touch()"
        @blur="$v.Fpelambre.$touch()"></v-select>
      <v-row>
        <v-col md="3">
          <v-text-field
          label="Codigo de Partida"
          v-model="codigo"
          @focusout="verificar_codigo"
          :error-messages="codigoErrors"
          @input="$v.codigo.$touch()"
          @blur="$v.codigo.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="1">
          <v-text-field
          label="Kilos"
          v-model="kilo"
          :error-messages="kilosErrors"
          @input="$v.kilo.$touch()"
          @blur="$v.kilo.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="1">
          <v-text-field
          label="Pieles"
          v-model="pieles"
          :error-messages="pielesErrors"
          @input="$v.pieles.$touch()"
          @blur="$v.pieles.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="2">
          <v-select
          label="Formula"
          :items="f_pelambre"
          item-value="codigo"
          item-text="codigo"
          v-model="Fpelambre"
          :error-messages="pelambreErrors"
          @input="$v.Fpelambre.$touch()"
          @blur="$v.Fpelambre.$touch()"></v-select>
        </v-col>
        <v-col md="3">
          <v-text-field
          :readonly="true"
          v-model="autor"
          label="Autor"
          ></v-text-field>
        </v-col>
      </v-row>
      <div>
        <label for="">Procesos Recurtido:</label>
        <v-row>
          <v-col md="4" cols="4" v-for="item in items_pelambre" :key="item.codigo">
            <v-checkbox
            v-model="proceso"
            :label="item.descripcion"
            :value="item.codigo"
            hide-details></v-checkbox>
          </v-col>
        </v-row>
      </div>
      <div>
        <label for="">Procesos Acabado:</label>
        <v-row>
          <v-col md="4" cols="4" v-for="item in items_curtido" :key="item.codigo">
            <v-checkbox
            v-model="curtido"
            :label="item.descripcion"
            :value="item.codigo"
            hide-details></v-checkbox>
          </v-col>
        </v-row>
      </div>
      <v-btn color="primary" @click="nueva_ordenp">Guardar</v-btn>
    </v-card>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';
import EventBus from '../../EventBus/EventBus';
import store from '../../store/index';
import data from '../../help/datos.json';

export default {
  mixins: [validationMixin],

  validations: {
    codigo: { required },
    kilo: { required },
    pieles: { required },
    Fpelambre: { required },
    Fcurtido: { required },
    proceso: { required },
    curtido: { required },
  },
  data() {
    return {
      items_pelambre: data.recurtido,
      items_curtido: data.acabado,
      proceso: [],
      curtido: [],
      codigo: '',
      kilo: '',
      pieles: '',
      Fpelambre: '',
      Fcurtido: '',
      autor: store.state.user.id,
      f_pelambre: [],
      f_curtido: [],
    };
  },
  created() {
    this.obtener_datos();
  },
  methods: {
    obtener_datos() {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_datos_ot',
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
            this.f_pelambre = res.data.data.pelambre;
            this.f_curtido = res.data.data.curtido;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    verificar_codigo() {
      if (this.codigo !== '') {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/verificar_codigo_op',
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
              this.$toast.success('Codigo disponible.');
            } else {
              this.$toast.error('Codigo ya guardado');
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
    reiniciar() {
      this.codigo = '';
      this.kilo = '';
      this.pieles = '';
      this.Fpelambre = '';
      this.Fcurtido = '';
      this.proceso = '';
      this.curtido = '';
    },
    nueva_ordenp() {
      if (this.verficar()) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/guardar_op',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            codigo: this.codigo,
            kilo: this.kilo,
            piele: this.pieles,
            fpelambre: this.Fpelambre,
            fcurtido: this.Fcurtido,
            autor: this.autor,
            ppelambre: this.proceso,
            pcurtido: this.curtido,
          },
        };
        axios(option)
          .then((res) => {
            if (res.data.cod === '200') {
              this.$toast.error('Orden de Pedido creada correctamente');
              this.reiniciar();
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      } else {
        this.$toast.error('Ingrese correctamente los campos.');
      }
    },
    verficar() {
      this.$v.codigo.$touch();
      this.$v.kilo.$touch();
      this.$v.pieles.$touch();
      this.$v.Fpelambre.$touch();
      this.$v.Fcurtido.$touch();
      this.$v.proceso.$touch();
      this.$v.curtido.$touch();
      if (!this.$v.codigo.$error
      && !this.$v.kilo.$error
      && !this.$v.pieles.$error
      && !this.$v.Fpelambre.$error
      && !this.$v.Fcurtido.$error
      && !this.$v.proceso.$error
      && !this.$v.curtido.$error) {
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
    kilosErrors() {
      const errors = [];
      if (!this.$v.kilo.$dirty) return errors;
      if (!this.$v.kilo.required) errors.push('El campo obligatorio.');
      return errors;
    },
    pielesErrors() {
      const errors = [];
      if (!this.$v.pieles.$dirty) return errors;
      if (!this.$v.pieles.required) errors.push('El campo obligatorio.');
      return errors;
    },
    pelambreErrors() {
      const errors = [];
      if (!this.$v.Fpelambre.$dirty) return errors;
      if (!this.$v.Fpelambre.required) errors.push('El campo obligatorio.');
      return errors;
    },
    curtidoErros() {
      const errors = [];
      if (!this.$v.Fcurtido.$dirty) return errors;
      if (!this.$v.Fcurtido.required) errors.push('El campo obligatorio.');
      return errors;
    },
    procesoErros() {
      const errors = [];
      if (!this.$v.proceso.$dirty) return errors;
      if (!this.$v.proceso.required) errors.push('El campo obligatorio.');
      return errors;
    },
    pcurtidoErrors() {
      const errors = [];
      if (!this.$v.curtido.$dirty) return errors;
      if (!this.$v.curtido.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
};
</script>
