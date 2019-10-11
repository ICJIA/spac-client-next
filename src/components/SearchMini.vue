<template>
  <div style="z-index: unset">
    <v-text-field
      ref="textfield"
      v-model="query"
      class="pt-3"
      placeholder="Search SPAC"
      label="Search"
      @keyup="instantSearch"
    >
    </v-text-field>

    <v-card
      v-if="query.length"
      style="position: absolute; margin-top: -5px; margin-left: -12px; width: 50%; postition: absolute; top: 82px; width: 100%; z-index: 500000"
      class="py-2 mr-5 text-xs-left"
    >
      <base-list :items="queryResults" empty="">
        <template slot-scope="item">
          <div class="px-8 py-2 lato hover text-left" @click="route(item)">
            {{ item.title }}
          </div>
        </template>
      </base-list>
    </v-card>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import BaseList from "@/components/BaseList";
import { getSearchIndex } from "@/services/Search";
import { EventBus } from "@/event-bus";
export default {
  components: {
    BaseList
  },
  async created() {
    this.searchContent = await getSearchIndex();

    this.fuse = await new Fuse(
      this.searchContent,
      this.$store.getters.config.search
    );
  },
  async mounted() {
    // this.$nextTick(() => {
    //   this.$refs.textfield.focus()
    // })
    EventBus.$on("hideQuery", () => {
      this.hideQuery();
    });
    // if (this.searchQuery) {
    //   this.query = this.searchQuery;
    //   this.$nextTick(() => {
    //     this.$refs.textfield.focus();
    //   });
    //   this.instantSearch();
    // }
  },
  data() {
    return {
      query: "",
      queryResults: [],
      content: "",
      config: null,
      searchContent: [],
      fuse: null
    };
  },
  methods: {
    instantSearch() {
      this.queryResults = this.fuse.search(this.query).slice(0, 4);
    },
    hideQuery() {
      this.query = "";
      this.queryResults = [];
    },
    route(item) {
      if (!item.slug) return;
      if (item.parentPath === "/") {
        this.$router.push(`/${item.slug}`);
      } else {
        this.$router.push(`${item.parentPath}/${item.slug}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
