<template>
    <v-container>
      <h5>Procesos planificados: {{proceso}}</h5>
      <v-row>
        <v-col md="2" cols="4" v-for="item in items" :key="item.codigo">
          <v-card
            class="mx-auto"
            outlined>
            <v-list-item>
              <v-list-item-content v-if="listaProceso.includes(item.codigo)">
                <div class="overline mb-4">
                  {{item.descripcion}}
                  <div v-if="parseInt(listafalta[0]) === parseInt(item.codigo)">
                    <v-dialog
                      v-model="dialog"
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          Comenzar
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">Comienzo de proceso</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
                              >
                                <v-text-field
                                  label="Kilos"
                                  v-model="kilo"
                                  :error-messages="kilosErrors"
                                  @input="$v.kilo.$touch()"
                                  @blur="$v.kilo.$touch()"
                                ></v-text-field>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
                              >
                                <v-text-field
                                  label="Pieles"
                                  v-model="pieles"
                                  :error-messages="pielesErrors"
                                  @input="$v.pieles.$touch()"
                                  @blur="$v.pieles.$touch()"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="dialog = false"
                          >
                            Close
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="Guardarseguimiento"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                  <div v-if="listafinalizada.includes(item.codigo)">
                    <v-btn
                      color="danger"
                      dark
                      @click="desechoclick(item)"
                    >
                      Desechos
                    </v-btn>
                  </div>
                </div>
              </v-list-item-content>
              <v-list-item-content v-else>
                <div class="overline mb-4 grey--text" >
                  {{item.descripcion}}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
      <v-btn v-if="listafalta.length === 0 && this.fin === 0" class="success"
      @click="dialog4 = true">Finalizar Orden de Teñido</v-btn>
      <v-dialog
        v-model="dialog2"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Desechos del proceso</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    readonly
                    v-model="descripcion"
                    label="Proceso"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    label="Desecho de Agua (L)"
                    v-model="agua"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="grasa"
                    label="Desecho de Grasa (Kl)"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="recorte_piel"
                    label="Desecho de Recorte de piel (Kl)"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="carnaza"
                    label="Desecho de Carnaza (Kl)"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12">
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
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="Guardardesecho"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog4"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span v-if="proceso_base === '2'"
            class="headline">Pieles SemiTerminado resultantes</span>
            <span v-else class="headline">Pieles Acabadas resultantes</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    label="Pieles"
                    v-model="pieles"
                    :error-messages="pielesErrors"
                    @input="$v.pieles.$touch()"
                    @blur="$v.pieles.$touch()"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialog4 = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="fin_orden"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';
import store from '../../store/index';
import EventBus from '../../EventBus/EventBus';
import datos from '../../help/datos.json';

export default {
  mixins: [validationMixin],

  validations: {
    kilo: { required },
    pieles: { required },
  },
  data() {
    return {
      fin: 0,
      cod_pro: '',
      descripcion: '',
      agua: '',
      grasa: '',
      recorte_piel: '',
      carnaza: '',
      observacion: '',
      proceso_seleccionado: 0,
      proceso_base: '',
      proceso: '',
      kilo: '',
      pieles: '',
      dialog: false,
      dialog2: false,
      dialog4: false,
      curtido: false,
      listafalta: [],
      listafinalizada: [],
      listaProceso: [],
      listaRealizada: [],
      items: [],
    };
  },
  computed: {
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
  },
  created() {
    this.actualizar_tabla();
  },
  methods: {
    almacenar() {
      const cod = this.$route.params.codigo;
      let codAlmacen = '';
      if (this.proceso_base === '2') {
        codAlmacen = 'ST';
      } else {
        codAlmacen = 'AC';
      }
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
          cod_almacen: codAlmacen,
          accion: '0',
          cantidad: this.pieles,
          observacion: cod,
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.kilo = 0;
            this.pieles = 0;
            this.$toast.success('Pieles almacenadas en almacen.');
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    fin_orden() {
      const cod = this.$route.params.codigo;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/fin_orden_ot',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cod,
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.fin = 1;
            this.dialog4 = false;
            this.$toast.success('Orden de Pedido finalizada.');
            this.almacenar();
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    desechoclick(item) {
      this.proceso_seleccionado = item.codigo;
      this.cod_pro = item.codigo;
      this.descripcion = item.descripcion;
      while (typeof this.listaRealizada[this.proceso_seleccionado] === 'undefined') {
        this.proceso_seleccionado -= 1;
      }
      this.agua = this.listaRealizada[this.proceso_seleccionado].agua;
      this.grasa = this.listaRealizada[this.proceso_seleccionado].grasa;
      this.recorte_piel = this.listaRealizada[this.proceso_seleccionado].recorte_piel;
      this.carnaza = this.listaRealizada[this.proceso_seleccionado].carnaza;
      this.observacion = this.listaRealizada[this.proceso_seleccionado].observacion;
      this.dialog2 = true;
    },
    Guardardesecho() {
      const proceso = this.cod_pro;
      const cod = this.$route.params.codigo;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/guardar_desecho_ot',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cod,
          proceso_base: this.proceso_base,
          proceso,
          agua: this.agua,
          grasa: this.grasa,
          recorte_piel: this.recorte_piel,
          carnaza: this.carnaza,
          observacion: this.observacion,
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.listaRealizada[this.proceso_seleccionado].agua = this.agua;
            this.listaRealizada[this.proceso_seleccionado].grasa = this.grasa;
            this.listaRealizada[this.proceso_seleccionado].recorte_piel = this.recorte_piel;
            this.listaRealizada[this.proceso_seleccionado].carnaza = this.carnaza;
            this.listaRealizada[this.proceso_seleccionado].observacion = this.observacion;
            this.$toast.success('Desechos Guardados');
            this.dialog2 = false;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    Guardarseguimiento() {
      const proceso = this.listafalta[0];
      const cod = this.$route.params.codigo;
      const { token } = store.state;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/guardar_seguimiento_ot',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          codigo: cod,
          proceso_base: this.proceso_base,
          proceso,
          kilo: this.kilo,
          pieles: this.pieles,
        },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            const nuevorealizado = {
              codigo_partida: cod,
              proceso_base: 0,
              proceso: this.listafalta[0],
              agua: 0,
              grasa: 0,
              recorte_piel: 0,
              carnaza: 0,
              observacion: '',
              codigo_seguimiento: `${cod}-0-${this.listafalta[0]}`,
            };
            this.listaRealizada.push(nuevorealizado);
            this.listafinalizada.push(this.listafalta[0]);
            this.listafalta.splice(0, 1);
            if (this.listafalta.length === 0) {
              this.$emit('cambiartexto');
            }
            this.kilo = 0;
            this.pieles = 0;
            this.$toast.success('Seguimiento Guardado.');
            this.dialog = false;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            EventBus.$emit('cerrar_sesion');
          }
        });
    },
    actualizar_tabla() {
      const { token } = store.state;
      const cod = this.$route.params.codigo;
      const option = {
        // eslint-disable-next-line prefer-template
        url: process.env.VUE_APP_URL_SERVER + '/api/obtener_seguimiento_ot',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: { codigo: cod },
      };
      axios(option)
        .then((res) => {
          const { data } = res;
          if (data.cod === '200') {
            this.fin = data.data.ot[0].finalizado;
            this.listaProceso = data.data.ot[0].proceso.split(',');
            this.listaRealizada = data.data.seguimiento;
            this.listafinalizada = this.listaRealizada.map((x) => x.proceso);
            this.listafalta = data.data.ot[0].proceso.split(',');
            this.listafalta = this.listafalta.sort();
            this.listafalta.splice(0, this.listaRealizada.length);
            if (data.data.ot[0].proceso_base === '03') {
              this.items = datos.recurtido;
              this.proceso = 'Recurtido';
              this.proceso_base = '2';
            } else {
              this.items = datos.acabado;
              this.proceso = 'Acabado';
              this.proceso_base = '3';
            }
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
