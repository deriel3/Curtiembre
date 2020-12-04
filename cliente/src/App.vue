<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import EventBus from './EventBus/EventBus';
import store from './store/index';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  created() {
    EventBus.$on('cerrar_sesion', () => {
      this.cerrar_sesion();
    });
  },
  methods: {
    cerrar_sesion() {
      this.$toast.error('Sesion Cerrada');
      store.commit('DELETE_USER');
      store.commit('DELETE_TOKEN');
      this.$router.push('/');
    },
  },
};
</script>
