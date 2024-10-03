import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'cb3540c7da0f4f409415756840da0573',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Vangs Vital Insights',
  domain: 'jespervang.dk',
  author: 'Jesper Vang',

  // open graph metadata (optional)
  description: 'Vangs Vital Insights, by Jesper Vang',

  // social usernames (optional)
  twitter: '',
  twitterX: '#',
  github: 'flight505',
  gitlab: '',
  linkedin: '#',
  mastodon: '', // optional mastodon profile URL, provides link verification
  newsletter: '', // optional newsletter URL
  youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`
  zhihu: '', // optional zhihu username
  bugtracker: '', // optional bugtracker URL

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // whether or not search is enabled (optional)
  // this requires support from Notion.
  isSearchEnabled: true,

  // whether or not to show the GitHub share button on the top-right.
  isGithubShareButtonEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    // {
    //   title: 'Home',
    //   pageId: '/'
    // },
    {
      title: 'About',
      pageId: '/About-fb8f3ab93fd34f189a0dcb55dbf1c552'
    },
    {
      title: 'Contact',
      pageId: '/Contact-0020eda50345447f94bd71f9ee10d0e3'
    }
  ]
})
