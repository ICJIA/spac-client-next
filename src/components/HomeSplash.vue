<template>
  <div>
    <v-img
      src="@/assets/img/spac-columns.jpg"
      lazy-src="@/assets/img/spac-columns-min.jpg"
      height="500"
      aspect-ratio="1.3"
      class="mt-0"
      style="border-bottom: 1px solid #bbb;"
      @click="hideQuery"
    >
      <div style="" class="banner">
        <v-container bg grid-list-md text-center style=" " class="text-center">
          <v-layout row wrap align-center>
            <v-flex class="text-center">
              <div
                :class="{
                  'splash-margin-sm':
                    $vuetify.breakpoint.xs || $vuetify.breakpoint.sm,
                  'splash-margin-xl':
                    $vuetify.breakpoint.md ||
                    $vuetify.breakpoint.lg ||
                    $vuetify.breakpoint.xl
                }"
              >
                <h1
                  class="default-font home-title"
                  style="color: #fff; font-weight: 900;"
                >
                  THE ILLINOIS SENTENCING POLICY ADVISORY COUNCIL
                </h1>
                <div
                  class="mt-3 default-font carousel-medium carousel-sub-text"
                >
                  The Illinois Sentencing Policy Advisory Council (SPAC) was
                  created to more accurately determine the consequences of
                  sentencing policy decisions and to review the effectiveness
                  and efficiency of current sentencing policies and practices.
                </div>
                <v-flex class="text-center" style="width: 100% !important">
                  <SearchMini
                    style="background: #fff;position: relative;"
                    class="py-3 px-3 mt-8"
                  />
                </v-flex>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-img>
  </div>
</template>

<script>
import SearchMini from "@/components/SearchMini";
import { EventBus } from "../event-bus.js";

export default {
  components: {
    SearchMini
  },
  methods: {
    hideQuery() {
      EventBus.$emit("hideQuery");
    }
  },
  mounted() {}
};
</script>

<style>
.banner {
  width: 100%;
  background: rgba(79, 80, 79, 0.6);
  padding: 50px;
  margin-top: 30px;
}

@media only screen and (max-width: 600px) {
  .banner {
    margin-top: 10px;
    background: rgba(79, 80, 79, 0.5);
  }

  h1.home-title {
    font-size: 22px;
  }
}
</style>
