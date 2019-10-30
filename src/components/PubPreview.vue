<template>
  <div>
    <v-card
      style="background: #fff; border-bottom: 1px solid #eee;min-height: 350px"
      class="pt-3 pb-4 elevation-4"
    >
      <div class="px-4 lato">
        <div class="text-right spac-purple mt-2">
          <div class="heavy category" @click="routeToCategory(item)">
            {{ strapiEnumToObject("publications", item.category)[0].title }}
          </div>
        </div>
        <h2
          style="margin: 0; padding: 0; width: 100%;"
          class="hover mt-5 mb-3 title-link"
          @click="download(item)"
        >
          {{ item.title }}
        </h2>

        <v-card-text class="pb-5"
          ><div
            class="hover"
            style="float: left; margin-right: 20px; margin-bottom: 10px;"
          >
            <v-img
              :contain="true"
              :src="getThumbnailLink(item.mediaMaterial)"
              class="cover elevation-0 px-1"
              width="120"
              style="border: 1px solid #bbb"
              @click="download(item)"
            />
            <div class="text-xs-center mt-2">
              <v-btn
                small
                outlined
                color="purple darken-2"
                class="white--text"
                style="margin-left: 20px; margin-top: 10px;"
                @click="download(item)"
              >
                READ
                <v-icon right dark>cloud_download</v-icon>
              </v-btn>
            </div>
          </div>
          <p class="default-font table-font" style="min-height: 135px">
            {{ item.summary }}
          </p>
          <div></div>
        </v-card-text>
        <v-card-text class="mt-3" v-if="mode !== 'minimal'">
          <TagList :tags="item.tags"></TagList>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { getThumbnailLink } from "@/services/Image";
import { strapiEnumToObject } from "@/services/Utilities";
import TagList from "@/components/TagList";
// import { EventBus } from "@/event-bus";

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TagList
  },
  data() {
    return {
      getThumbnailLink,
      strapiEnumToObject
    };
  },
  methods: {
    routeToCategory(item) {
      let categoryObj = strapiEnumToObject("publications", item.category);
      let path = `/publications/${categoryObj[0].slug}`;
      this.$router.push(`${path}`);
    },
    download(item) {
      if (item.mediaMaterial.file) {
        let path = item.mediaMaterial.file.url;
        window.open(this.$store.getters.config.baseURL + path);
        let ext = item.mediaMaterial.file.name.split(".").pop();
        console.log(
          "Download event: ",
          item.mediaMaterial.file.hash + "." + ext
        );
        this.$ga.event({
          eventCategory: "File",
          eventAction: "Download",
          eventLabel: item.mediaMaterial.file.hash + "." + ext
        });
      }
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: "full"
    }
  }
};
</script>

<style>
.category {
  background: purple;
  color: #fff;
  padding: 5px 10px;
  font-size: 12px;
  display: inline;
  cursor: pointer;
  transition: 0.3s;
}

.category:hover {
  background: #ccc;
  color: #000;
}
</style>
