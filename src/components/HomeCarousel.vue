<template>
  <v-img
    :src="require('@/assets/img/spac-columns.jpg')"
    :lazy-src="require('@/assets/img/spac-columns.jpg')"
    aspect-ratio="1"
    class="grey lighten-2"
    max-height="600"
    ><v-container
      class="fill-height text-center"
      fluid
      style="margin: 0; padding: 0"
    >
      <v-row align="center">
        <div class="banner">
          <v-col cols="12">
            <h1 class="default-font carousel-large heavy carousel-main-text">
              THE ILLINOIS SENTENCING POLICY ADVISORY COUNCIL
            </h1>
            <div
              class="default-font carousel-medium mt-10 px-12 carousel-sub-text"
            >
              SPAC was created to more accurately determine the consequences of
              sentencing policy decisions and to review the effectiveness and
              efficiency of current sentencing policies and practices.
            </div>
          </v-col>
        </div>
      </v-row>
    </v-container>
  </v-img>
</template>

<script>
import SearchMini from "@/components/SearchMini";
import { EventBus } from "../event-bus.js";
export default {
  components: {
    SearchMini
  },
  data() {
    return {
      colors: ["grey darken-1", "grey darken-1", "grey darken-1"],
      slides: ["First", "Second", "Third"]
    };
  },
  mounted() {
    // a11y fix for nav buttons

    document.addEventListener("DOMContentLoaded", () => {
      let arr = [
        ...document.getElementsByClassName("v-carousel__controls__item")
      ];
      arr.forEach(item => {
        item.setAttribute("aria-label", "navigation button");
      });
    });
  }
};
</script>

<style scoped>
.banner {
  width: 100%;
  background: rgba(79, 80, 79, 0.7);
  padding: 20px;
  margin-top: -300px;
}

@media only screen and (max-width: 600px) {
  .banner {
    height: 100%;
    margin-top: -20px;
    background: rgba(79, 80, 79, 0.5);
  }
}
</style>
