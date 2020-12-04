<template>
  <div>
    <v-card v-for="(item, index) in cabeceras[tab]" :key="index">
      <v-card-title>
        <h1 class="display-1 font-weight-bold">{{item}}</h1>
        
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    tab: Number,
    cabeceras: Number,
  },
};
</script>
