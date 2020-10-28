<template>
  <v-app id="page-top">
    <app-nav :sections="sections"></app-nav>
    <app-drawer :sections="sections"></app-drawer>

    <breadcrumb></breadcrumb>
    <outdated-browser v-if="$browserDetect.isIE"></outdated-browser>
    <div v-if="!loading">
      <v-main
        id="content-top"
        aria-live="polite"
        style="background: #fafafa; min-height: 68vh"
      >
        <Corona ref="alert" />
        <Census :key="$route.path"></Census>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-main>

      <app-footer :sections="sections"></app-footer>
    </div>
    <div v-if="loading">
      <v-container>
        <v-row>
          <v-col class="text-center">
            <div style="margin-top: 150px;">
              <loader></loader>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import AppNav from "@/components/AppNav";
import Census from "@/components/Census";
import AppDrawer from "@/components/AppDrawer";
import AppFooter from "@/components/AppFooter";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/components/Loader";
import Corona from "@/components/Corona";
import OutdatedBrowser from "@/components/OutdatedBrowser";
import { getAllSections } from "@/services/Content";
export default {
  name: "App",
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Illinois Sentencing Policy Advisory Council",
      // all titles will be injected into this template
      titleTemplate: "SPAC | %s",
      htmlAttrs: {
        lang: "en"
      },
      link: [{ rel: "canonical", href: this.canonical }],
      meta: [
        { charset: "utf-8" },
        {
          vmid: "robots",
          name: "robots",
          content: "index, follow"
        },
        {
          vmid: "description",
          name: "description",
          content:
            "The Illinois Sentencing Policy Advisory Council (SPAC) was created to more accurately determine the consequences of sentencing policy decisions. "
        }
      ]
    };
  },
  components: {
    AppNav,
    AppDrawer,
    AppFooter,
    Breadcrumb,
    Loader,
    OutdatedBrowser,
    Corona,
    Census
  },
  methods: {},
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.canonical = this.$store.getters.config.clientURL + this.$route.path;
      console.log("Canonical: ", this.canonical);
      if (this.$refs.alert) this.$refs.alert.reset();
    }
  },
  async mounted() {},
  async created() {
    this.loading = true;

    if (!this.$store.state.isAppReady) {
      const configPromise = process.BROWSER_BUILD
        ? import("@/config.json")
        : Promise.resolve(require("@/config.json"));
      let config = await configPromise;
      this.$store.dispatch("setConfig", config);
      this.sections = config.sections;
      this.canonical = config.clientURL + this.$route.path;

      // eslint-disable-next-line no-console
      console.log("Debug: ", this.$store.getters.debug);
      // const routesPromise = process.BROWSER_BUILD
      //   ? import("@/api/routes.json")
      //   : Promise.resolve(require("@/api/routes.json"));
      // let routes = await routesPromise;
      // this.$store.dispatch("setRoutes", routes);

      const searchIndexPromise = process.BROWSER_BUILD
        ? import("@/api/searchIndex.json")
        : Promise.resolve(require("@/api/searchIndex.json"));
      let searchIndex = await searchIndexPromise;
      this.$store.dispatch("setSearchIndex", searchIndex);

      this.sections = await getAllSections();
      this.$store.dispatch("setSections", this.sections);

      await this.$store.dispatch("setApiStatus");

      this.$store.dispatch("initApp");
      this.loading = false;
    }
  },
  data() {
    return {
      sections: [],
      loading: true,
      test: [],
      env: process.env.NODE_ENV,
      canonical: null
    };
  }
};
</script>
<style></style>
