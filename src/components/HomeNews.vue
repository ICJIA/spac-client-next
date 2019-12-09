<template>
  <div>
    <div v-for="item in content" :key="item.slug" class="mb-3">
      <NewsCard
        :content="item"
        :height="150"
        :elevation="false"
        :readMore="item.displayReadMore"
      ></NewsCard>
    </div>
    <div class="text-center mt-6">
      <v-btn
        class="ma-2 mt-10"
        to="/news"
        aria-label="News Archive"
        outlined
        small
        color="primary"
        >News & Analysis Archive<v-icon right>chevron_right</v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
import NewsCard from "@/components/NewsCard";
export default {
  components: {
    NewsCard
  },
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
.shaded {
  color: #067879;
}
</style>
