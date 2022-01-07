import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time>06/01/2022</time>
            <strong>T[itulo</strong>
            <p>Paragrafo</p>
          </a>

          <a href="">
            <time>06/01/2022</time>
            <strong>T[itulo</strong>
            <p>Paragrafo</p>
          </a>

          <a href="">
            <time>06/01/2022</time>
            <strong>T[itulo</strong>
            <p>Paragrafo</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.Title", "post.Content"],
      pageSize: 100,
    }
  );

  console.log(response);

  return {
    props: {},
  };
};
