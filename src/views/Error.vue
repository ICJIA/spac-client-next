<template>
  <error-content>
    <template v-slot:content>
      <v-container class="text-center" data-aos="fade-right">
        <v-row align="center">
          <v-col>
            <h1 style="font-size: 48px; color: #067879">Oops.</h1>
            <h2
              class="mt-10"
              v-if="
                $route.params && $route.params.statusCode && $route.params.msg
              "
            >
              {{ $route.params.statusCode }} | {{ $route.params.msg }}
            </h2>

            <div v-if="$store.getters.debug" class="mt-5">
              {{ $route.params.debug }}
            </div>
            <v-btn
              class="mt-12"
              to="/"
              aria-label="Return home"
              outlined
              color="primary"
              ><v-icon left>chevron_left</v-icon>Go back home</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </template>
  </error-content>
</template>

<script>
import ErrorContent from "@/components/ErrorContent";
export default {
  components: {
    ErrorContent
  },
  metaInfo() {
    return {
      title: "Error"
    };
  },
  mounted() {
    this.$store.commit("CLEAR_CACHE");
    this.$ga.page({
      page: this.$route.path,
      title: this.title,
      location: window.location.href
    });
    this.$ga.event({
      eventCategory: "Error",
      eventAction: this.$route.params.msg,
      eventLabel: JSON.stringify(this.$route.params.debug)
    });
  }
};
</script>

<style lang="scss" scoped></style>
