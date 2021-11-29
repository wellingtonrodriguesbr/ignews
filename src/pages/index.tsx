import Head from 'next/head';
import styles from '../style/home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Início | Ig.news</title>
      </Head>
      <h1 className={styles.title}>
        Hello World!
      </h1>  
    </>
  )
}
