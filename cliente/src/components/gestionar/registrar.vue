<template>
    <v-container>
      <v-card class="pa-5 mx-auto"
      max-width="800">
        <v-text-field
        v-model="codigo"
        label="DNI"
        @focusout="verificar_codigo"
        @input="$v.codigo.$touch()"
        @blur="$v.codigo.$touch()"
        :error-messages="codigoErrors"></v-text-field>
        <v-text-field
        v-model="nombre"
        label="Nombre"
        @input="$v.nombre.$touch()"
        @blur="$v.nombre.$touch()"
        :error-messages="nombreErrors"></v-text-field>
        <v-text-field
        v-model="usuario"
        label="Usuario"
        @input="$v.usuario.$touch()"
        @blur="$v.usuario.$touch()"
        :error-messages="usuarioErrors"></v-text-field>
        <v-text-field
        type="password"
        v-model="password"
        label="Password"
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
        :error-messages="passwordErros"></v-text-field>
        <label for="">Permisos:</label>
        <v-row>
          <v-col
          v-for="item in lista_roles" :key="item.codigo"
          md="4"
          sm="4"
          cols="4">
            <v-checkbox
            :error-messages="permisosErrors"
            @input="$v.permisos.$touch()"
            @blur="$v.permisos.$touch()"
            v-model="permisos"
            :label="item.rol"
            :value="item.codigo"></v-checkbox>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="primary mr-3" @click="registrar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  mixins: [validationMixin],

  validations: {
    nombre: { required },
    usuario: { required },
    password: { required },
    permisos: { required },
    codigo: { required, minLength: minLength(8), maxLength: maxLength(8) },
  },
  data() {
    return {
      nombre: '',
      usuario: '',
      password: '',
      permisos: [],
      codigo: '',
      lista_roles: [],
    };
  },
  created() {
    const { token } = store.state;
    const option = {
      // eslint-disable-next-line prefer-template
      url: process.env.VUE_APP_URL_SERVER + '/api/obtener_roles',
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
          this.lista_roles = data.data.roles;
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          EventBus.$emit('cerrar_sesion');
        }
      });
  },
  methods: {
    verificar_codigo() {
      if (this.codigo.length === 8) {
        const { token } = store.state;
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/verificar_codigo',
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
              this.$toast.success('DNI Correcto');
            } else {
              this.$toast.error('DNI ya registrado');
              this.codigo = '';
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              EventBus.$emit('cerrar_sesion');
            }
          });
      } else {
        this.$toast.error('Ingrese un DNI valido.');
      }
    },
    validar() {
      this.$v.codigo.$touch();
      this.$v.nombre.$touch();
      this.$v.usuario.$touch();
      this.$v.password.$touch();
      this.$v.permisos.$touch();
      if (!this.$v.codigo.$error
      && !this.$v.nombre.$error
      && !this.$v.usuario.$error
      && !this.$v.password.$error
      && !this.$v.permisos.$error) {
        return true;
      }
      return false;
    },
    array_permiso() {
      const tmp = [];
      for (let i = 0; i < this.permisos.length; i += 1) {
        tmp[i] = [this.permisos[i], this.codigo];
      }
      return tmp;
    },
    reiniciar() {
      this.codigo = '';
      this.nombre = '';
      this.usuario = '';
      this.password = '';
      this.permisos = [];
    },
    registrar() {
      if (this.validar()) {
        const { token } = store.state;
        const ArrayPermiso = this.array_permiso();
        const option = {
          // eslint-disable-next-line prefer-template
          url: process.env.VUE_APP_URL_SERVER + '/api/nuevo_usuario',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            usuario: [this.codigo,
              this.nombre,
              this.usuario,
              this.password],
            permisos: ArrayPermiso,
          },
        };
        axios(option)
          .then((res) => {
            const { data } = res;
            if (data.cod === '200') {
              this.$toast.success('Usuario registrado');
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
  },
  computed: {
    codigoErrors() {
      const errors = [];
      if (!this.$v.codigo.$dirty) return errors;
      if (!this.$v.codigo.minLength) errors.push('Ingrese un dni correcto.');
      if (!this.$v.codigo.maxLength) errors.push('Ingrese un dni correcto.');
      if (!this.$v.codigo.required) errors.push('El campo obligatorio.');
      return errors;
    },
    nombreErrors() {
      const errors = [];
      if (!this.$v.nombre.$dirty) return errors;
      if (!this.$v.nombre.required) errors.push('El campo obligatorio.');
      return errors;
    },
    passwordErros() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push('El campo obligatorio.');
      return errors;
    },
    usuarioErrors() {
      const errors = [];
      if (!this.$v.usuario.$dirty) return errors;
      if (!this.$v.usuario.required) errors.push('El campo obligatorio.');
      return errors;
    },
    permisosErrors() {
      const errors = [];
      if (!this.$v.permisos.$dirty) return errors;
      if (!this.$v.permisos.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
};
</script>
