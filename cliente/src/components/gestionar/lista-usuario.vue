<template>
    <v-card>
      <v-card v-if="seleccionados.length !== 0"
      width="500px"
      class="mx-auto my-5">
        <v-card-text>
          <div align="center">
            <h1>Informacion del Usuario: </h1>
            <v-text-field
            :readonly="true"
            v-model="seleccionados[0].codigo"
            label="Codigo">
            </v-text-field>
            <v-text-field
            v-model="seleccionados[0].nombre"
            label="Nombre del usuario">
            </v-text-field>
            <label for="">Permisos:</label>
            <v-row>
              <v-col
              v-for="(item, index) in lista_roles" :key="index"
              md="4"
              sm="4"
              cols="4">
                <v-checkbox
                v-model="permisos"
                :label="item.rol"
                :value="item.codigo"></v-checkbox>
              </v-col>
            </v-row>
            <v-btn color="yellow lighten-1" class="mr-4" @click="actualizar">Actualizar</v-btn>
            <v-btn v-if="seleccionados[0].estado === 'Activo'" color="error" @click="desactivar">
              Desactivar</v-btn>
            <v-btn v-else color="success" @click="activar">Activar</v-btn>
          </div>
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
          class="ml-5" @click="actualizar_tabla"><v-icon>mdi-restart</v-icon></v-btn>
      </v-card-title>
      <v-data-table
      v-model="seleccionados"
      item-key="codigo"
      show-select
      @item-selected="seleccionado"
      :loading="cargando"
      :single-select="true"
      :headers="headers"
      :items="lista_usuarios"
      :search="search">
      </v-data-table>
    </v-card>
</template>
<script>
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';

export default {
  data() {
    return {
      cargando: false,
      seleccionados: [],
      search: '',
      headers: [{
        text: 'DNI',
        align: 'start',
        value: 'codigo',
      },
      {
        text: 'Nombre',
        value: 'nombre',
      },
      {
        text: 'Estado',
        value: 'estado',
      }],
      lista_usuarios: [],
      lista_permisos: [],
      lista_roles: [],
      permisos: [],
    };
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    seleccionado(seleccionado) {
      this.permisos = this.lista_permisos
        .filter((item) => item.cod_usuario === seleccionado.item.codigo);
      this.permisos = this.permisos.map((val) => val.cod_rol);
    },
    desactivar() {
      this.seleccionados[0].estado = 'Inactivo';
      this.actualizar_estado('Inactivo');
    },
    activar() {
      this.seleccionados[0].estado = 'Activo';
      this.actualizar_estado('Activo');
    },
    actualizar_estado(nuevoestado) {
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/estado_usuario',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          estado: nuevoestado,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Usuario Actualizado');
            this.seleccionados = [];
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    actualizar_tabla() {
      this.cargando = true;
      const { token } = store.state;
      const dni = store.state.user.id;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_usuarios',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: dni,
        },
      };
      axios(option)
        .then((res) => {
          this.cargando = false;
          const { data } = res;
          if (data.cod === '200') {
            this.lista_usuarios = data.data.usuarios;
            this.lista_permisos = data.data.permisos;
            this.lista_roles = data.data.roles;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    nuevos_permisos() {
      const tmp = [];
      for (let i = 0; i < this.permisos.length; i += 1) {
        tmp[i] = [this.permisos[i], this.seleccionados[0].codigo];
      }
      return tmp;
    },
    actualizar() {
      const { token } = store.state;
      const NuevosPermisos = this.nuevos_permisos();
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/actualizar_usuario',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: this.seleccionados[0].codigo,
          nombre: this.seleccionados[0].nombre,
          permisos: NuevosPermisos,
        },
      };
      axios(option)
        .then((res) => {
          if (res.data.cod === '200') {
            this.$toast.success('Usuario Actualizado');
            this.seleccionados = [];
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
