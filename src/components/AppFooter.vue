<template>
  <v-footer dark padless class="noprint">
    <v-card
      flat
      tile
      class="white--text text-center"
      color="secondary"
      style="width: 100%"
    >
      <v-card-text>
        <span v-for="link in sections" :key="link.title" class="flexitem">
          <span v-if="link.displayFooter">
            <v-btn
              :to="link.slug === 'home' ? '/' : `/${link.slug}`"
              depressed
              class="heavy"
              dark
              color="secondary"
              :aria-label="link.name"
            >
              <span style="font-size: 12px">{{ link.title }}</span>
            </v-btn>
          </span>
        </span>
      </v-card-text>
    </v-card>
    <v-card
      flat
      tile
      class="white--text text-center"
      color="primary"
      style="width: 100%"
    >
      <v-divider></v-divider>

      <v-card-text class="white--text">
        <img
          :src="require('@/assets/img/spac-horizontal-white.png')"
          alt="Illinois Criminal Justice Information Authority"
          width="250"
          class="mt-3 hover"
          @click="
            $router.push('/').catch(err => {
              $vuetify.goTo(0);
            })
          "
        />

        <div class="mt-3">
          <a
            href="https://www.linkedin.com/company/illinois-sentencing-policy-advisory-council"
            target="_blank"
            rel="noreferrer"
            class="social-icon"
            aria-label="SPAC LinkedIn"
          >
            <v-icon color="white" class="mx-2">mdi-linkedin</v-icon>
          </a>
          <a
            href="https://x.com/spacillinois"
            target="_blank"
            rel="noreferrer"
            class="social-icon"
            aria-label="SPAC X/Twitter"
          >
            <v-icon color="white" class="mx-2">mdi-twitter</v-icon>
          </a>
        </div>

        <div style="font-size: 12px" class="mt-2">
          <strong
            ><a
              href="https://archive.icjia.cloud/"
              target="_blank"
              rel="noreferrer"
              class="footer-link"
              >Document Archive</a
            ></strong
          >
          &nbsp;|&nbsp;<strong
            ><router-link class="footer-link" to="/contact"
              >Contact</router-link
            ></strong
          >
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  mounted() {
    //console.log(process.env);
  },
  methods: {
    getArchive() {
      return `https://${process.env.VUE_APP_ARCHIVE_SERVER_URL}`;
    }
  },
  props: {
    sections: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    icons: ["fab fa-facebook", "fab fa-twitter"]
  })
};
</script>

<style>
.footer-link {
  color: #fff !important;
  text-decoration: none;
}

.footer-link:hover {
  color: #aaa !important;
}

.social-icon {
  text-decoration: none;
  transition: opacity 0.2s ease-in-out;
}

.social-icon:hover {
  opacity: 0.7;
}

.social-icon .v-icon {
  font-size: 24px;
}
</style>
