import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import '@fontsource/open-sans/700.css'


const theme = extendTheme({
  styles: {
    global: () => ({
      // body: {
      //   bg: "#69A7B7",
      // },
      fonts: {
        body: `'Open Sans', sans-serif`,
        // body: `'Raleway', sans-serif`,
      },
    }),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
