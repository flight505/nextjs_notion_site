import * as React from 'react'
import Head from 'next/head'

import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  return (
    <>
      <Head>
        {/* ... other meta tags */}

        {/* Remove or comment out this line */}
        {/* <meta name="apple-mobile-web-app-capable" content="yes" /> */}

        {/* Add this line instead */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* If you still want to support older iOS devices, you can keep both */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ... other head content */}
      </Head>

      <NotionPage {...props} />
    </>
  )
}
