<template>
  <v-main class="full-height">
    <v-app-bar
      style="position:fixed; z-index:1"
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{usuario_actual}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="blue--text text--primary-5"
        >
          <v-list-item to="inicio">
            <v-list-item-title>Bienvenida</v-list-item-title>
          </v-list-item>
          <v-list-item to="material"
          :disabled="validar_permiso(1)"
          >
            <v-list-item-title>Materiales</v-list-item-title>
          </v-list-item>
          <v-list-item to="almacenes"
          :disabled="validar_permiso(1)"
          >
            <v-list-item-title>Almacenes</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'formulas'}"
          :disabled="validar_permiso(2)
          || validar_permiso(3)
          || validar_permiso(4)
          || validar_permiso(5)">
            <v-list-item-title>Base de datos de Formulas</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'articulo'}"
          :disabled="validar_permiso(9)">
            <v-list-item-title>Base de datos de Articulos</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'acabados'}"
          :disabled="validar_permiso(9)">
            <v-list-item-title>Base de datos de Acabados</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'orden_pedido'}"
          :disabled="validar_permiso(6)">
            <v-list-item-title>Orden de Pedido</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{name:'orden_tenido'}"
          :disabled="validar_permiso(7)">
            <v-list-item-title>Orden de Teñido</v-list-item-title>
          </v-list-item>
          <v-list-item to="gestionar-cuentas"
          :disabled="validar_permiso(0)">
            <v-list-item-title>Gestionar Cuentas</v-list-item-title>
          </v-list-item>
          <v-list-item @click="cerrar_sesion">
            <v-list-item-title class="red--text">Cerrar Sesion</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </v-main>
</template>
<script>
import EventBus from '../EventBus/EventBus';
import store from '../store/index';

export default {
  data: () => ({
    drawer: false,
    group: null,
    permisos: [],
    usuario_actual: '',
  }),
  created() {
    this.usuario_actual = store.state.user.usuario;
    this.permisos = store.state.user.permisos;
    const actual = this.$route.name;
    if (actual === 'CiteccalProd') {
      this.$router.push({ name: 'inicio' });
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    cerrar_sesion() {
      EventBus.$emit('cerrar_sesion');
    },
    validar_permiso(permiso) {
      return this.permisos.filter((val) => val.cod_rol === permiso).length === 0;
    },

  },
};
</script>
<style>
.full-height {
    height: 100vh
}
.fade-enter, .fade-leave-to{
  opacity : 0;
  transform: translateX(2em)
}
.fade-enter-active, .fade-leave-active{
  transition: all .3s ease;
}
</style>
