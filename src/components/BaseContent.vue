<template>
  <div>
    <div
      class="px-4"
      v-if="!loading"
      :class="{ 'py-10': !$browserDetect.isIE, iePull: $browserDetect.isIE }"
    >
      <div
        style="font-family: 'Lato', sans-serif !important; font-weight: 900 !important;"
      >
        <slot name="title"></slot>
      </div>
      <slot name="printer"></slot>
      <slot name="content"></slot>
    </div>
    <div v-else>
      <v-container>
        <v-row>
          <v-col>
            <loader></loader>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
export default {
  components: {
    Loader
  },
  mounted() {
    //console.log(this.$browserDetect.isIE);
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped>
.iePull {
  margin-top: -75px;
}
</style>
