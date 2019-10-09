/* eslint-disable no-console */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { EventBus } from "@/event-bus";
const config = require("@/config.json");
const xss = require("xss");

const axios = require("axios");
const api = axios.create({
  baseURL: config.baseURL,
  timeout: 10000
});

api.interceptors.request.use(config => {
  NProgress.start();
  return config;
});

api.interceptors.response.use(response => {
  NProgress.done();
  return response;
});

async function queryEndpoint(query) {
  let content = await api({
    url: "/graphql",
    method: "post",
    data: {
      query
    }
  });
  return content;
}

const getPageQuery = slug => {
  return `{
  pages (where: {slug: "${slug}", isPublished: true}) {
    id
    createdAt
    updatedAt
    title
    showToc
    addDivider
    slug
    content
    isPublished
    summary
    displayNav
    tags {
      name
      slug
    }
    
    
  }
}`;
};

const getPostQuery = slug => {
  return `{
  posts  (where: {slug: "${slug}", isPublished: true}) {
    id
    createdAt
    updatedAt
    title
    slug
    content
    isPublished
    summary
    tags {
      name
      slug
    }
    
    
  }
}`;
};

const getFrontPageNewsQuery = limit => {
  return `{
  posts(sort: "createdAt:desc", limit: ${limit}, where: {isPublished: true}) {
    title
    isPublished
    slug
    tags {
      name
      slug
    }
    summary
    content
    createdAt
    isPublished
    
  }
}`;
};

const getAllNewsQuery = () => {
  return `{
  posts(sort: "createdAt:desc", where: {isPublished: true}) {
    title
    slug
    isPublished
    tags {
      name
      slug
    }
    summary
    content
    createdAt
    isPublished
    
  }
}`;
};

const getFeaturedPublicationsQuery = () => {
  return `{
  publications  {
    title
    slug
    category
    tags {
      name
      slug
    }
    summary
    createdAt
    isPublished
    year
    file {
      name
      url
    }
    externalURL
    thumbnail {
      url
      name
    }
    
  }
} `;
};

const getAllPublicationsQuery = () => {
  return `{
  publications (sort: "title:asc", where: {isPublished: true}) {
    title
    slug
    category
    tags {
      name
      slug
    }
    summary
    createdAt
    isPublished
    year
    file {
      name
      url
    }
    externalURL
    thumbnail {
      url
      name
    }
    
  }
} `;
};

const getContentByTagQuery = slug => {
  return `
  {
  tags(where: { slug: "${slug}" }) {
    name
    slug
    content

    sites(sort: "title:asc", where: { isPublished: true }) {
      id
      title
      slug
      summary
      content
      siteType
      showToc
      createdAt
      updatedAt
      tags {
        name
        slug
      }
    }

    meetings (sort: "scheduledDate:desc", where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    
    
     tags {
      name
      slug
    }
  }

    pages(sort: "title:asc", where: { isPublished: true }) {
      title
      slug
      summary
      content
      addDivider
      showToc
      isPublished
      updatedAt
      createdAt
      section {
      title
      slug
    }
      tags {
        name
        slug
      }
    }


    resources (sort: "publicationDate:desc", where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    publicationDate
    summary
    category
    content
    
    
     tags {
      name
      slug
    }
  }

    



    biographies(sort: "alphabetizeBy:asc", where: { isPublished: true }) {
      firstName
      middleName
      lastName
      membership
      order
      slug
      prefix
      suffix
      title
      content
      category
      tags {
        name
        slug
      }
      alphabetizeBy
      headshot {
        url
        name
      }
    }
    news: posts(sort: "createdAt:desc", where: { isPublished: true }) {
      title
      slug
      isPublished
      tags {
        name
        slug
      }
      summary
      content
      createdAt
      isPublished
    }
  }
}
  
  `;
};

const getSinglePublicationQuery = slug => {
  return `{
  publications (where: {slug: "${slug}", isPublished: true})  {
    title
    slug
    category
    tags {
      name
      slug
    }
    summary
    createdAt
    isPublished
    year
    file {
      name
      url
    }
    externalURL
    thumbnail {
      url
      name
    }
   
  }
} 
`;
};

const getAllSectionsQuery = () => {
  return `{
  sections (sort: "order:asc" where: { isPublished: true}) {
    title
    slug
    isPublished
    summary
    searchMeta
    summary
    order
    hasSubMenus
    displayNav
    displayFooter
    displayDrawer
    
    pages (sort: "order:asc", where: { isPublished: true}) {
      title
      slug
      order
      isPublished
      displayNav
      summary
      addDivider
    }
  }
}`;
};

const getPageBySectionQuery = (section, slug) => {
  return `{
  sections(where: { slug: "${section}" }) {
    title
    slug
    summary
    hasSubMenus
    searchMeta
    pages(where: { isPublished: true, slug: "${slug}" }) {
      id
      createdAt
      updatedAt
      title
      showToc
      addDivider
      slug
      content
      isPublished
      summary
      tags {
        name
        slug
      }
      
    }
  }
}`;
};

const getSiteDescriptionQuery = slug => {
  return `{
  sites (where: {isPublished: true, slug: "${slug}"}){
    id
    title
    slug
    summary
    content
    siteType
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}`;
};

const getAllSiteDescriptionsQuery = () => {
  return `{
  sites (sort: "title:asc", where: {isPublished: true}){
    id
    title
    slug
    summary
    content
    siteType
    showToc
     createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}`;
};

const getAllBiographiesQuery = () => {
  return `
  {
  biographies (sort: "alphabetizeBy:asc", where: {isPublished: true}){
    isPublished,
    firstName
    middleName
    lastName
    membership
    order
    slug
    prefix
    suffix
    title
    content
    category
    tags {
      name
      slug
    }
    alphabetizeBy
     headshot {
      url
      name
    }
  }
}`;
};

const getSingleBiographiesQuery = slug => {
  return `
  {
  biographies (where: {slug: "${slug}", isPublished: true}){
    isPublished
    firstName
    middleName
    lastName
    membership
    order
    prefix
    suffix
    slug
    title
    content
    category
     tags {
      name
      slug
    }
    alphabetizeBy
     headshot {
      url
      name
    }
  }
}`;
};

const getAllMeetingsQuery = () => {
  return `{
  meetings (sort: "scheduledDate:desc", where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    externalMediaMaterial {
      name
      url
      summary
    }
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getSingleMeetingQuery = slug => {
  return `
  {
  meetings (sort: "scheduledDate:desc", where: {slug: "${slug}", isPublished: true}) {
   createdAt
    updatedAt
    title
    slug
    scheduledDate
    summary
    category
    content
    externalMediaMaterial {
      name
      url
      summary
    }
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    tags {
      name
      slug
    }
  }
}`;
};

const getAllResourcesQuery = () => {
  return `{
  resources (sort: "publicationDate:desc", where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    publicationDate
    summary
    category
    content
    externalMediaMaterial {
      name
      url
      summary
    }
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    
     tags {
      name
      slug
    }
  }
}
  `;
};

const getResourceByCategoryQuery = category => {
  return `{
  resources (where: {isPublished: true, category: "${category}"}) {
    createdAt
    updatedAt
    title
    slug
    publicationDate
    summary
    category
    content
    externalMediaMaterial {
      name
      url
      summary
    }
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
     tags {
      name
      slug
    }
  }
}
  `;
};

const getSingleResourceQuery = slug => {
  return `
  {
  resources (sort: "publicationDate:desc", where: {slug: "${slug}", isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    publicationDate
    summary
    category
    content
    externalMediaMaterial {
      name
      url
      summary
    }
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
  
     tags {
      name
      slug
    }
  }
}`;
};

const getPage = async ({ slug }) => {
  try {
    slug = xss(slug);
    let page = await queryEndpoint(getPageQuery(slug));
    return page.data.data.pages;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("getPage error", e.toString());
    return [];
  }
};

const getPost = async ({ slug }) => {
  try {
    slug = xss(slug);
    let post = await queryEndpoint(getPostQuery(slug));
    return post.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getFrontPageNews = async ({ limit }) => {
  try {
    limit = xss(limit);
    let news = await queryEndpoint(getFrontPageNewsQuery(limit));
    return news.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllNews = async () => {
  try {
    let news = await queryEndpoint(getAllNewsQuery());
    return news.data.data.posts;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getFeaturedPublications = async () => {
  try {
    let featured = await queryEndpoint(getFeaturedPublicationsQuery());
    return featured.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllPublications = async () => {
  try {
    let publications = await queryEndpoint(getAllPublicationsQuery());
    return publications.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getContentByTag = async ({ slug }) => {
  try {
    slug = xss(slug);
    let content = await queryEndpoint(getContentByTagQuery(slug));

    return content.data.data.tags;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSinglePublication = async ({ slug }) => {
  try {
    slug = xss(slug);
    let publication = await queryEndpoint(getSinglePublicationQuery(slug));

    return publication.data.data.publications;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllSections = async () => {
  try {
    let sections = await queryEndpoint(getAllSectionsQuery());
    return sections.data.data.sections;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getPageBySection = async ({ section, slug }) => {
  try {
    slug = xss(slug);
    section = xss(section);
    let sections = await queryEndpoint(getPageBySectionQuery(section, slug));
    return sections.data.data.sections;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSiteDescription = async ({ slug }) => {
  try {
    slug = xss(slug);
    let sites = await queryEndpoint(getSiteDescriptionQuery(slug));
    return sites.data.data.sites;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllSiteDescriptions = async () => {
  try {
    let sites = await queryEndpoint(getAllSiteDescriptionsQuery());
    return sites.data.data.sites;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllBiographies = async () => {
  try {
    let biographies = await queryEndpoint(getAllBiographiesQuery());
    return biographies.data.data.biographies;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSingleBiography = async ({ slug }) => {
  try {
    slug = xss(slug);
    let biography = await queryEndpoint(getSingleBiographiesQuery(slug));
    return biography.data.data.biographies;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllMeetings = async () => {
  try {
    let meetings = await queryEndpoint(getAllMeetingsQuery());
    return meetings.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSingleMeeting = async ({ slug }) => {
  try {
    slug = xss(slug);
    let meeting = await queryEndpoint(getSingleMeetingQuery(slug));
    return meeting.data.data.meetings;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getAllResources = async () => {
  try {
    let resources = await queryEndpoint(getAllResourcesQuery());
    return resources.data.data.resources;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getResourceByCategory = async ({ category }) => {
  try {
    category = xss(category);
    let resource = await queryEndpoint(getResourceByCategoryQuery(category));
    return resource.data.data.resources;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

const getSingleResource = async ({ slug }) => {
  try {
    slug = xss(slug);
    let resource = await queryEndpoint(getSingleResourceQuery(slug));
    return resource.data.data.resources;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    console.log("contentServiceError", e.toString());
    return [];
  }
};

export {
  getPage,
  getPost,
  getFrontPageNews,
  getAllNews,
  getFeaturedPublications,
  getAllPublications,
  getContentByTag,
  getSinglePublication,
  getAllSections,
  getPageBySection,
  getSiteDescription,
  getAllSiteDescriptions,
  getAllBiographies,
  getSingleBiography,
  getAllMeetings,
  getSingleMeeting,
  getAllResources,
  getSingleResource,
  getResourceByCategory
};
