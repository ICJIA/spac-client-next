<template>
  <div>
    <div v-if="!$browserDetect.isIE">
      <home-splash></home-splash>
      <home-boxes></home-boxes>
    </div>

    <!-- <div>
      <home-about :content="about" v-if="about" data-aos="fade"></home-about>
    </div> -->
    <base-content :loading="loading">
      <template v-slot:content>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="12" md="6" class="mb-10">
              <h2 class="heavy rule uppercase">News & Events</h2>
              <home-news
                :content="news"
                v-if="news"
                data-aos="fade"
              ></home-news>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
              style="padding-left: 30px; padding-right: 30px"
              class="mb-10"
            >
              <h2 class="heavy rule uppercase">
                Publications here
              </h2>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </base-content>
  </div>
</template>

<script>
import HomeCarousel from "@/components/HomeCarousel";
import HomeSplash from "@/components/HomeSplash";
import HomeBoxes from "@/components/HomeBoxes";
import HomeNews from "@/components/HomeNews";
import HomeAbout from "@/components/HomeAbout";
import BaseContent from "@/components/BaseContent";
import { getPage, getFrontPageNews } from "@/services/Content";
import { getHash } from "@/services/Utilities";
// import Illinois from "@/components/Illinois";
export default {
  components: {
    HomeCarousel,
    HomeBoxes,
    HomeNews,
    HomeAbout,
    HomeSplash,
    BaseContent
  },
  data() {
    return {
      loading: true,
      about: null,
      news: null
    };
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

    await this.$store.dispatch("cacheContent", contentMap);

    this.about = this.$store.getters.getContentFromCache(contentMap, "getPage");

    this.news = this.$store.getters.getContentFromCache(
      contentMap,
      "getFrontPageNews"
    );

    this.loading = false;
  }
};
</script>

<style></style>
