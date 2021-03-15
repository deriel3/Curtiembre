<template>
  <v-container>
    <v-card width="1500" class="mx-auto pa-4">
      <v-btn color="success" @click="obtener_datos">Refrescar Data</v-btn>
      <v-row>
        <v-col md="2">
          <v-select
            label="Proceso"
            :items="tipo_proceso"
            v-model="proceso_seleccionado"
            item-value="codigo"
            item-text="nombre"
            :error-messages="procesoErros"
            @change="obtener_formulas"
            @input="$v.proceso_seleccionado.$touch()"
            @blur="$v.proceso_seleccionado.$touch()"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="3">
          <v-text-field
          label="Codigo de Teñido"
          readonly
          v-model="codigo"
          @click="verificar_codigo"
          :error-messages="codigoErrors"
          @input="$v.codigo.$touch()"
          @blur="$v.codigo.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="1">
          <v-text-field
          :disabled="proceso_seleccionado === ''"
          label="Kilos"
          v-model="kilo"
          :error-messages="kilosErrors"
          @input="$v.kilo.$touch()"
          @blur="$v.kilo.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="1">
          <v-text-field
          @focusout="verificar_pieles"
          :disabled="proceso_seleccionado === ''"
          label="Pieles"
          v-model="pieles"
          :error-messages="pielesErrors"
          @input="$v.pieles.$touch()"
          @blur="$v.pieles.$touch()"
          ></v-text-field>
        </v-col>
        <v-col md="2">
          <v-select
          :disabled="proceso_seleccionado === ''"
          label="Formula"
          :items="formula"
          item-value="codigo"
          item-text="codigo"
          v-model="Fformula"
          :error-messages="pelambreErrors"
          @input="$v.Fformula.$touch()"
          @blur="$v.Fformula.$touch()"></v-select>
        </v-col>
        <v-col md="3">
          <v-text-field
          :readonly="true"
          v-model="autor"
          label="Autor"
          ></v-text-field>
        </v-col>
      </v-row>
      <div v-if="proceso_seleccionado === '03'">
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
      <div v-if="proceso_seleccionado === '04'">
        <label for="">Procesos Acabado:</label>
        <v-row>
          <v-col md="4" cols="4" v-for="item in items_curtido" :key="item.codigo">
            <v-checkbox
            v-model="proceso"
            :label="item.descripcion"
            :value="item.codigo"
            hide-details></v-checkbox>
          </v-col>
        </v-row>
      </div>
      <v-btn color="primary" @click="nueva_ordenp"
      :disabled="proceso_seleccionado === ''">Guardar</v-btn>
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
    Fformula: { required },
    Fcurtido: { required },
    proceso_seleccionado: { required },
    curtido: { required },
  },
  data() {
    return {
      tipo_proceso: [
        {
          nombre: 'Recurtido',
          codigo: '03',
        },
        {
          nombre: 'Acabado',
          codigo: '04',
        }],
      proceso_seleccionado: '',
      items_pelambre: data.recurtido,
      items_curtido: data.acabado,
      curtido: [],
      codigo: '',
      kilo: '',
      pieles: '',
      Fformula: '',
      autor: store.state.user.id,
      formula: [],
      proceso: [],
    };
  },
  created() {
    this.obtener_datos();
  },
  methods: {
    verificar_pieles() {
      let p = '';
      if (this.proceso_seleccionado === '03') {
        p = 'WB';
      } else {
        p = 'ST';
      }
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/verificar_almacen',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          cod_almacen: p,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            const stock = res.data.data.cabecera[0].cantidad;
            if (parseInt(stock, 10) < parseInt(this.pieles, 10)) {
              if (this.proceso_seleccionado === '03') {
                this.$toast.error('No se tiene suficientes pieles en el almacen de Wet Blue - Cuero Cromado');
              } else {
                this.$toast.error('No se tiene suficientes pieles en el almacen de Semiterminado - Cuero Teñido');
              }
              this.pieles = '';
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
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
            const año = new Date().getFullYear();
            if (res.data.data.codigo.length !== 0) {
              const codigo = res.data.data.codigo[0].codigo.split('-');
              const numero = parseInt(codigo[2], 10) + 1;
              this.codigo = `OT-${año}-${numero}`;
            } else {
              this.codigo = `OT-${año}-1`;
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    obtener_formulas() {
      this.Fformula = '';
      this.proceso = [];
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_formula_ot',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          proceso: this.proceso_seleccionado,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.formula = res.data.data.formulas;
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
          url: process.env.VUE_APP_URL_SERVER + '/api/verificar_codigo_ot',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
        };
        axios(option)
          .then((res) => {
            if (res.data.cod === '200') {
              const año = new Date().getFullYear();
              if (res.data.data.codigo.length !== 0) {
                const codigo = res.data.data.codigo[0].codigo.split('-');
                const numero = parseInt(codigo[2], 10) + 1;
                this.codigo = `OT-${año}-${numero}`;
              } else {
                this.codigo = `OT-${año}-1`;
              }
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
      this.Fformula = '';
      this.proceso = '';
    },
    nueva_ordenp() {
      if (this.verficar()) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/guardar_ot',
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
            formula: this.Fformula,
            proceso: this.proceso,
            autor: this.autor,
            p: this.proceso_seleccionado,
          },
        };
        axios(option)
          .then((res) => {
            if (res.data.cod === '200') {
              this.$toast.success('Orden de Pedido creada correctamente');
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
      this.$v.Fformula.$touch();
      this.$v.proceso_seleccionado.$touch();
      if (!this.$v.codigo.$error
      && !this.$v.kilo.$error
      && !this.$v.pieles.$error
      && !this.$v.Fformula.$error
      && !this.$v.proceso_seleccionado.$error) {
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
      if (!this.$v.Fformula.$dirty) return errors;
      if (!this.$v.Fformula.required) errors.push('El campo obligatorio.');
      return errors;
    },
    procesoErros() {
      const errors = [];
      if (!this.$v.proceso_seleccionado.$dirty) return errors;
      if (!this.$v.proceso_seleccionado.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
};
</script>
