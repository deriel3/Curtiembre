<template>
  <v-main class="grey lighten-2 full-height">
    <v-container
    fill-height>
      <div style="width:100%" align="center">
        <v-card
        :width="anchura">
            <v-card-title class="justify-center mb-4 primary white--text">
                <h1 class="display-1 font-weight-bold">Inicio de Sesion</h1>
            </v-card-title>
            <v-card-text>
              <v-text-field
              v-model="usuario"
              label="Usuario"
              :error-messages="usuarioErrors"
              @input="$v.usuario.$touch()"
              @blur="$v.usuario.$touch()">
              </v-text-field>
              <v-text-field
              v-model="contrasena"
              label="Contraseña"
              :error-messages="passwordErrors"
              @input="$v.contrasena.$touch()"
              @blur="$v.contrasena.$touch()"
              type="password">
              </v-text-field>
              <v-btn class="mr-2 primary mt-5"
              @click="iniciar_sesion">
                Iniciar Sesion
              </v-btn>
              <v-btn class="success mt-5">
                Recuperar Contraseña
              </v-btn>
            </v-card-text>
        </v-card>
        <div class="mt-15">
          <v-row>
            <v-col
            class=""
            md="2"
            offset-md="3"
            sm="4"
            cols=4>
            <v-img
            class="mb-10"
            :lazy-src="url_base+'/api/imagen?imagen=logo_citeccal.png&width=10&height=10'"
            :max-height="150"
            :max-width="imagen_width"
            :src="url_base+'/api/imagen?imagen=logo_citeccal.png&width=200&height=100'"
          ></v-img>
            </v-col>
            <v-col
            md="2"
            sm="4"
            cols=4>
            <v-img
            class="mb-10"
            :lazy-src="url_base+'/api/imagen?imagen=logo_itp.png&width=10&height=10'"
            :max-height="150"
            :max-width="imagen_width"
            :src="url_base+'/api/imagen?imagen=logo_itp.png&width=200&height=100'"
          ></v-img>
            </v-col>
            <v-col
            md="2"
            sm="4"
            cols=4>
            <v-img
            class="mb-10"
            :lazy-src="url_base+'/api/imagen?imagen=logo_ministerio.png&width=10&height=10'"
            :max-height="150"
            :max-width="imagen_width"
            :src="url_base+'/api/imagen?imagen=logo_ministerio.png&width=200&height=100'"
          ></v-img>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </v-main>
</template>
<script>
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import store from '../store/index';

export default {
  mixins: [validationMixin],
  validations: {
    usuario: { required },
    contrasena: { required },
  },
  data() {
    return {
      usuario: '',
      contrasena: '',
      url_base: process.env.VUE_APP_URL_SERVER,
    };
  },
  computed: {
    anchura() {
      const x = window.screen.width;
      if (x > 960) {
        return '500px';
      } return '5px';
    },
    imagen_width() {
      const x = window.screen.width;
      if (x > 960) {
        return '200px';
      } return '1px';
    },
    imagen_height() {
      const x = window.screen.width;
      if (x > 960) {
        return '100px';
      } return '25px';
    },
    usuarioErrors() {
      const errors = [];
      if (!this.$v.usuario.$dirty) return errors;
      if (!this.$v.usuario.required) errors.push('El campo obligatorio.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.contrasena.$dirty) return errors;
      if (!this.$v.contrasena.required) errors.push('El campo obligatorio.');
      return errors;
    },
  },
  methods: {
    iniciar_sesion() {
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/inicio_sesion',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          usuario: this.usuario,
          contrasena: this.contrasena,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            console.log(res.data.permisos);
            store.commit('SET_USER', { usuario: this.usuario, id: res.data.id, permisos: res.data.permisos });
            store.commit('SET_TOKEN', res.data.token);
            this.$toast.success(`Bienvenid@ ${this.usuario}`);
            this.$router.push('/CiteccalProd/inicio');
          } else {
            this.$toast.error('Usuario o contraseña erroneos');
            this.usuario = '';
            this.contrasena = '';
          }
        },
        (error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style>
.full-height {
    height: 100vh
}
</style>
