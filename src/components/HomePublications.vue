<template>
  <div>
    <div class="text-center mb-4 hidden-sm-and-down">
      <span v-for="index in dots" :key="index">
        <span
          class="dot mx-1 hover"
          :class="{ active: index === segment }"
          @click="displaySegment(index)"
        ></span>
      </span>
    </div>

    <base-list :items="pubsToDisplay" empty="Loading ..." class="px-2">
      <template slot-scope="item">
        <div>
          <pub-preview
            :item="item"
            mode="minimal"
            class="post default-font mb-3"
            :key="forceRenderClick"
          />
        </div>
      </template>
    </base-list>
  </div>
</template>

<script>
import BaseList from "@/components/BaseList";
import PubPreview from "@/components/PubPreview";
import { EventBus } from "@/event-bus";
export default {
  mounted() {
    EventBus.$on("previousFeatured", () => {
      this.previousFeatured();
    });
    EventBus.$on("nextFeatured", () => {
      this.nextFeatured();
    });
    if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
      this.pubsToDisplay = this.publications;
    } else {
      this.display = this.$store.getters.config.frontPageItems.publications;

      if (this.pubsTotal > this.display) {
        this.pubsToDisplay = this.publications.slice(
          this.currentIndex,
          this.display
        );
      } else {
        this.pubsToDisplay = this.publications;
      }
    }
    this.$emit("init");
  },
  data() {
    return {
      display: null,
      pubsTotal: this.publications.length,
      pubsToDisplay: [],
      currentIndex: 0,
      disableNext: false,
      segment: 1,
      forceRenderClick: 1
    };
  },
  components: {
    BaseList,
    PubPreview
  },
  methods: {
    displaySegment(index) {
      this.currentIndex = this.display * index - this.display;
      this.pubsToDisplay = this.publications.slice(
        this.currentIndex,
        this.currentIndex + this.display
      );
      this.segment = index;
    },
    nextFeatured() {
      //   console.log(
      //     this.currentIndex,
      //     this.display,
      //     this.segment,
      //     this.pubsTotal
      //   );
      this.forceRenderClick = this.forceRenderClick + 1;
      if (this.currentIndex + this.display >= this.pubsTotal) {
        this.pubsToDisplay = this.publications.slice(
          this.currentIndex,
          this.pubsTotal
        );
        this.currentIndex = 0 - this.display;
        this.segment = 0;
      }
      if (this.currentIndex + this.display <= this.pubsTotal) {
        this.currentIndex = this.currentIndex + this.display;
        this.pubsToDisplay = this.publications.slice(
          this.currentIndex,
          this.currentIndex + this.display
        );
        this.segment = this.segment + 1;
        this.$ga.event({
          eventCategory: "Featured (Next)",
          eventAction: "Click",
          eventLabel: "Click"
        });
      }
    },
    previousFeatured() {
      //   console.log(
      //     this.currentIndex,
      //     this.display,
      //     this.segment,
      //     this.pubsTotal
      //   );
      this.forceRenderClick = this.forceRenderClick + 1;
      if (this.currentIndex > 0) {
        this.segment = this.segment - 1;
        this.currentIndex = this.segment * this.display - this.display;
        this.pubsToDisplay = this.publications.slice(
          this.currentIndex,
          this.currentIndex + this.display
        );
      } else {
        this.segment = this.dots;
        this.currentIndex = this.segment * this.display - this.display;
        this.pubsToDisplay = this.publications.slice(
          this.currentIndex,
          this.pubsTotal
        );
      }
      this.$ga.event({
        eventCategory: "Featured (Previous)",
        eventAction: "Click",
        eventLabel: "Click"
      });
    }
  },
  props: {
    publications: {
      type: Array,
      default: () => []
    },
    dots: {
      type: Number,
      default: 2
    }
  }
};
</script>

<style scoped>
.dot {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
.dot.active {
  background-color: #690b63;
}
</style>
