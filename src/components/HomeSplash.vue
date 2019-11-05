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

                <blockquote class="splash">
                  All penalities
                  <span style="color: #fff">shall be determined</span> both
                  according to the seriousness of the offense and with the
                  object of
                  <span style="color: #fff">restoring the offender</span> to
                  useful citizenship.
                  <cite
                    >The Illinois Constitution Article I, Section 11
                    (1970)</cite
                  >
                </blockquote>
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
.purple {
  color: purple;
}
.banner {
  width: 100%;
  background: rgba(79, 80, 79, 0.6);
  padding: 50px;
  margin-top: 30px;
}

blockquote.splash {
  font-family: Georgia, serif;
  font-size: 18px;
  font-style: italic;

  padding: 0.35em 10px;
  line-height: 1.45;
  position: relative;
  color: #fff;
}

/* blockquote.splash:before {
  display: block;
  padding-left: 20px;
  content: "\201C";
  font-size: 80px;
  position: absolute;
  left: -30px;
  top: -20px;
  color: #fff;
} */

blockquote.splash cite {
  color: #eee;
  font-size: 14px;
  display: block;
  margin-top: 5px;
  text-align: right;
}

blockquote.splash cite:before {
  content: "\2014 \2009";
}

@media only screen and (max-width: 600px) {
  .banner {
    margin-top: 25px;
    background: rgba(79, 80, 79, 0.5);
  }

  blockquote.splash {
    display: none;
  }

  h1.home-title {
    font-size: 26px;
  }
}

@media only screen and (max-width: 1024px) {
  blockquote.splash:before {
    padding-left: 20px;
    left: -50px;
    top: -20px;
  }
}
</style>
