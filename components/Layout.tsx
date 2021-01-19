import { css, Global } from '@emotion/core'
import Head from 'next/head'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import { theme } from 'styles/theme'

const GLOBAL_STYLES = css``

const rootCss = css`
  align-items: center;
  display: flex;
  font-family: sans-serif;
  font-size: 3.8vmin;
  flex-direction: column;
  justify-content: center;
  @media screen and (min-width: ${theme.width.mobile}) {
    font-size: 3.5vmin;
  }
  @media screen and (min-width: ${theme.width.tablet}) {
    font-size: 2.3vmin;
  }
  @media screen and (min-width: ${theme.width.desktopSmall}) {
    font-size: 2vmin;
  }
`
const navCss = css`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
  width: 100%;
  & > a {
    color: ${theme.palette.black};
    margin: 0 0.7em;
    & > svg {
      height: 1.5em;
      width: 1.5em;
    }
  }
`
const titleCss = css`
  & > a {
    text-decoration: none;
  }
`

const Layout: FunctionComponent = ({ children }) => (
  <>
    <Head>
      <title>push-demo</title>
      <meta name="theme-color" content={theme.palette.black} />
      <meta
        name="description"
        content="Some tools for browsing /r/GunAccessoriesForSale"
      />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content="👋" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="/favicon.png" />
      <meta property="og:image:height" content="2048" />
      <meta property="og:image:width" content="1597" />

      <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
      <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
    </Head>
    <Global styles={GLOBAL_STYLES} />
    <div css={rootCss}>
      <h1 css={titleCss}>
        <Link href="/">
          <a>👋</a>
        </Link>
      </h1>
      <nav css={navCss}>{/* links could go here */}</nav>
      {children}
    </div>
  </>
)

export default Layout
