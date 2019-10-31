<template>
  <div>
    <v-card
      style="border-bottom: 1px solid #eee;min-height: 350px"
      class="pt-3 pb-4 elevation-4"
      :class="{ cardBackground: mode !== 'minimal' }"
    >
      <div class="px-4 lato">
        <v-row v-if="mode === 'minimal'">
          <v-col cols="12">
            <div class="text-right spac-purple">
              <div class="heavy category" @click="routeToCategory(item)">
                {{ strapiEnumToObject("publications", item.category)[0].title }}
              </div>
            </div>
          </v-col>
        </v-row>
        <div
          style="font-weight: 700; font-size: 12px; color: #999"
          class="mt-5"
        >
          {{ item.year }}
        </div>

        <h2 style="margin: 0; padding: 0; width: 100%;" class="mb-3 title-link">
          <span
            v-if="item.mediaMaterial && item.mediaMaterial.file"
            @click="download(item)"
            class="hover pubTitle"
          >
            {{ item.title }}
          </span>
          <span
            v-else-if="
              item.externalMediaMaterial && item.externalMediaMaterial.url
            "
            @click="gotoExternal(item)"
            class="hover pubTitle"
          >
            {{ item.title }}
          </span>
          <span v-else>
            {{ item.title }}
          </span>
        </h2>

        <v-card-text class="pb-5">
          <div class="hover" style="float: left; margin-bottom: 30px;">
            <div v-if="item.mediaMaterial && item.mediaMaterial.thumbnail">
              <v-img
                :contain="true"
                :src="getThumbnailLink(item.mediaMaterial)"
                class="cover elevation-0 px-1"
                width="120"
                style="margin-right: 20px; border: 1px solid #bbb"
                @click="download(item)"
              />
            </div>

            <div
              v-else-if="
                item.externalMediaMaterial &&
                  item.externalMediaMaterial.thumbnail
              "
            >
              <v-img
                :contain="true"
                :src="getThumbnailLink(item.externalMediaMaterial)"
                class="cover elevation-0 px-1"
                width="120"
                style="margin-right: 20px; border: 1px solid #bbb; "
                @click="gotoExternal(item)"
              />
            </div>
          </div>
          <div class="default-font table-font" style="min-height: 130px">
            {{ item.summary }}<br />
            <v-chip
              small
              class="mt-4 hover"
              color="primary"
              outlined
              pill
              @click="download(item)"
              v-if="item.mediaMaterial && item.mediaMaterial.file"
            >
              READ
              <v-icon right>cloud_download</v-icon>
            </v-chip>
            <v-chip
              small
              class="mt-4 hover"
              color="primary"
              outlined
              pill
              @click="gotoExternal(item)"
              v-if="
                item.externalMediaMaterial && item.externalMediaMaterial.url
              "
            >
              GO TO
              <v-icon right>open_in_new</v-icon>
            </v-chip>
          </div>
        </v-card-text>

        <v-card-text class="mt-3" v-if="mode !== 'minimal'">
          <TagList :tags="item.tags"></TagList>
        </v-card-text>
        <v-card-text class="mt-3" v-else>
          <div style="height: 10px"></div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { getThumbnailLink, getDefaultThumbnail } from "@/services/Image";
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
      getDefaultThumbnail,
      strapiEnumToObject
    };
  },
  methods: {
    routeToCategory(item) {
      let categoryObj = strapiEnumToObject("publications", item.category);
      let path = `/publications/${categoryObj[0].slug}`;
      this.$router.push(`${path}`);
    },
    gotoExternal(item) {
      //console.log(item.externalMediaMaterial.url);
      if (item.externalMediaMaterial.url) {
        this.$ga.event({
          eventCategory: "Video",
          eventAction: "Play",
          eventLabel: item.externalMediaMaterial.url
        });
        window.open(item.externalMediaMaterial.url);
      }
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

.cardBackground {
  background: #f5f5f5 !important;
}

.pubTitle:hover {
  color: #666;
}
</style>
