/* eslint-disable no-console */
const { request } = require("graphql-request");
const jsonfile = require("jsonfile");
const config = require("./src/config.json");
const fs = require("fs");
var sm = require("sitemap");
// const slug = require("slug");
// slug.defaults.mode = "rfc3986";
const api = `${config.baseURL}/graphql`;
const apiDir = "./src/api";
const filename = "routes.json";
const sections = [
  "pages",
  "news",
  "tags",
  "meetings",
  "publications",
  "sections"
];
let routes = [];

const query = `{
  pages (where: {isPublished: true}) {
    slug
    section {
      slug
    }
    
  }

  sections (where: {isPublished: true}){
    slug
  }

  news: posts (where: {isPublished: true}) {
    slug
  }

   publications (where: {isPublished: true}){
    slug
    category
  }
  
  meetings (where: {isPublished: true}){
    slug
    category
  }

 

  tags {
    slug
  }
  
}`;

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
  console.log(`Created: ${apiDir}/`);
}

request(api, query).then(res => {
  sections.forEach(section => {
    let sectionRoutes = res[section].map(item => {
      let path;
      /**
       *
       * Pages
       *
       */
      // if (section === "pages") {
      //   path = `/${item.section.slug}`;
      // }
      /**
       *
       * Sections
       *
       */
      if (section === "sections") {
        path = `/${item.slug}`;
      }
      /**
       *
       * News
       *
       */
      if (section === "news") {
        path = `/news/${item.slug}`;
      }
      /**
       *
       * Tags
       *
       */
      if (section === "tags") {
        path = `/tags/${item.slug}`;
      }
      /**
       *
       * Publications
       *
       */
      if (section === "publications") {
        let catEnum = config.strapiEnums.publications.filter(cat => {
          return item.category === cat.enum;
        });

        path = `/publications/${catEnum[0].slug}/${item.slug}`;
      }
      /**
       *
       * Meetings
       *
       */
      let catEnum = config.strapiEnums.meetings.filter(cat => {
        return item.category === cat.enum;
      });
      if (section === "meetings") {
        path = `/meetings/${catEnum[0].slug}/${item.slug}`;
      }
      return `${config.publicPath}${path}`;
    });
    routes.push(...sectionRoutes);
  });
  let temp = routes.filter(Boolean);
  // remove dupes
  let paths = [...new Set(temp)];
  // add root
  paths.push("/");
  jsonfile.writeFile(`${apiDir}/${filename}`, paths, function(err) {
    if (err) console.error(err);
    console.log(`Created: ${apiDir}/${filename}`);
  });

  let urls = paths.map(route => {
    let obj = {};
    obj.url = route;
    obj.changefreq = "weekly";
    obj.priority = 0.8;
    // obj.lastmodrealtime = true;
    return obj;
  });

  let sitemap = sm.createSitemap({
    hostname: `${config.clientURL}`,
    cacheTime: 600000, //600 sec (10 min) cache purge period
    urls
  });

  fs.writeFileSync("./public/sitemap.xml", sitemap.toString());
  console.log(`Created: ./public/sitemap.xml`);
});
