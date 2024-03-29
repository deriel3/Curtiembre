import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/Error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '../views/error.vue'),
  },
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    beforeEnter: (to, from, next) => {
      if (store.state.token) {
        next('/CiteccalProd');
      } else {
        next();
      }
    },
  },
  {
    path: '/CiteccalProd',
    name: 'CiteccalProd',
    component: () => import(/* webpackChunkName: "bienvenida" */ '../views/bienvenida.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.state.token) {
        next('/');
      } else {
        next();
      }
    },
    children: [{
      path: 'inicio',
      name: 'inicio',
      component: () => import(/* webpackChunkName: "inicio" */ '../views/inicio.vue'),
    },
    {
      path: 'material',
      name: 'material',
      component: () => import(/* webpackChunkName: "material" */ '../views/material.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 1).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'almacenes',
      name: 'almacenes',
      component: () => import(/* webpackChunkName: "almacenes" */ '../views/almacenes.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 1).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'articulo',
      name: 'articulo',
      component: () => import(/* webpackChunkName: "articulo" */ '../views/articulo.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 9).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'acabados',
      name: 'acabados',
      component: () => import(/* webpackChunkName: "acabados" */ '../views/acabado.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 9).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'formulas',
      name: 'formulas',
      component: () => import(/* webpackChunkName: "formulas" */ '../views/formula.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 2
        || val.cod_rol === 3
        || val.cod_rol === 4
        || val.cod_rol === 5).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'gestionar-cuentas',
      name: 'gestionar-cuentas',
      component: () => import(/* webpackChunkName: "gestionar-cuentas" */ '../views/gestionar-cuentas.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 0).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'editar-formula/:codigo',
      name: 'editar-formula',
      component: () => import(/* webpackChunkName: "editar-formula" */ '../views/editar-formula.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 10).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'orden_pedido',
      name: 'orden_pedido',
      component: () => import(/* webpackChunkName: "orden_pedido" */ '../views/orden_pedido.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 6).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'descargar_formula/:codigo',
      name: 'descargar_formula',
      component: () => import(/* webpackChunkName: "descargar_formula" */ '../views/descargar_formula.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 6).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'orden_pedido_seguimiento/:codigo',
      name: 'orden_pedido_seguimiento',
      component: () => import(/* webpackChunkName: "orden_pedido_seguimiento" */ '../views/orden_pedido_seguimiento.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 6).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'orden_tenido',
      name: 'orden_tenido',
      component: () => import(/* webpackChunkName: "orden_tenido" */ '../views/orden_tenido.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 7).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    {
      path: 'orden_tenido_seguimiento/:codigo',
      name: 'orden_tenido_seguimiento',
      component: () => import(/* webpackChunkName: "orden_tenido_seguimiento" */ '../views/orden_tenido_seguimiento.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.user.permisos.filter((val) => val.cod_rol === 6).length > 0) {
          next();
        } else {
          next('/CiteccalProd/inicio');
        }
      },
    },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
