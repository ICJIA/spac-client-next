<template>
  <div>
    <div v-if="!$browserDetect.isIE">
      <home-splash></home-splash>

      <home-boxes></home-boxes>
      <home-about
        :about="about"
        :upcoming="upcoming"
        v-if="about && upcoming"
      ></home-about>
    </div>

    <div style=" background: #fff">
      <base-content :loading="loading">
        <template v-slot:content>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="7"
                class="mb-10"
                style="margin-top: -45px"
              >
                <h2
                  class="heavy rule uppercase"
                  style="font-size: 36px; color: purple;"
                >
                  News & Analysis
                </h2>
                <home-news
                  :content="news"
                  v-if="news"
                  data-aos="fade"
                ></home-news>
              </v-col>
              <v-col cols="12" sm="12" md="5" style="margin-top: -33px;">
                <div
                  class="text-xs-left mb-5 px-2"
                  style="display: flex; justify-content: space-between; padding-bottom: 7px; border-bottom: 1px solid #aaa;"
                >
                  <span
                    style="font-size: 36px; color: purple; font-weight: 900;"
                    >FEATURED</span
                  >
                  <span class="hidden-sm-and-down"
                    ><v-btn
                      dark
                      small
                      color="purple lighten-1"
                      class="white--text "
                      style="padding: 0; margin: 0; margin-top: 10px"
                      @click="previousFeatured()"
                      aria-label="Navigate to Previous"
                      ><v-icon dark>navigate_before</v-icon>
                    </v-btn>

                    <v-btn
                      dark
                      small
                      color="purple lighten-1"
                      class="white--text ml-2"
                      style="padding: 0; margin: 0; margin-top: 10px"
                      aria-label="Navigate to Next"
                      @click="nextFeatured()"
                    >
                      <v-icon dark>navigate_next</v-icon>
                    </v-btn></span
                  >
                </div>
                <home-publications
                  :publications="publications"
                  :dots="dots"
                  v-if="publications"
                ></home-publications>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </base-content>
    </div>
  </div>
</template>

<script>
import HomeSplash from "@/components/HomeSplash";
import HomeBoxes from "@/components/HomeBoxes";
import HomeNews from "@/components/HomeNews";
import HomePublications from "@/components/HomePublications";
import HomeAbout from "@/components/HomeAbout";
import BaseContent from "@/components/BaseContent";
import moment from "moment";
import { EventBus } from "@/event-bus";
import {
  getPage,
  getFrontPageNews,
  getFrontPagePublications,
  getUpcomingMeetings
} from "@/services/Content";
import { getHash } from "@/services/Utilities";
// import Illinois from "@/components/Illinois";
export default {
  components: {
    HomeBoxes,
    HomeNews,
    HomePublications,
    HomeAbout,
    HomeSplash,
    BaseContent
  },
  data() {
    return {
      loading: true,
      about: null,
      news: null,
      publications: null,
      upcoming: null,
      dots: 0
    };
  },
  methods: {
    featuredPubsMounted() {
      this.ready = true;
    },
    previousFeatured() {
      EventBus.$emit("previousFeatured");
    },
    nextFeatured() {
      EventBus.$emit("nextFeatured");
    }
  },
  async created() {
    this.loading = true;

    const contentMap = new Map();

    contentMap.set("getPage", {
      hash: getHash("getPage-home"),
      query: getPage,
      params: { slug: "home" }
    });

    contentMap.set("getFrontPageNews", {
      hash: getHash("getFrontPageNews-home"),
      query: getFrontPageNews,
      params: { limit: this.$store.getters.config.frontPageItems.news }
    });

    contentMap.set("getFrontPagePublications", {
      hash: getHash("getFrontPagePublications-home"),
      query: getFrontPagePublications,
      params: {}
    });
    const targetDate = moment()
      .subtract(1, "d")
      .format();
    console.log(targetDate);
    contentMap.set("getUpcomingMeetings", {
      hash: getHash("getUpcomingMeetings-home"),
      query: getUpcomingMeetings,
      params: { targetDate }
    });

    await this.$store.dispatch("cacheContent", contentMap);

    this.about = this.$store.getters.getContentFromCache(contentMap, "getPage");

    this.news = this.$store.getters.getContentFromCache(
      contentMap,
      "getFrontPageNews"
    );

    this.publications = this.$store.getters.getContentFromCache(
      contentMap,
      "getFrontPagePublications"
    );

    this.upcoming = this.$store.getters.getContentFromCache(
      contentMap,
      "getUpcomingMeetings"
    );

    this.dots = Math.ceil(
      this.publications.length /
        this.$store.getters.config.frontPageItems.publications
    );

    this.$ga.page({
      page: this.$route.path,
      title: "Home",
      location: window.location.href
    });

    this.loading = false;
  }
};
</script>

<style></style>
