import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { SessionProvider as NextAUthProvider } from "next-auth/react";
import "../style/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAUthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAUthProvider>
  );
}

export default MyApp;
