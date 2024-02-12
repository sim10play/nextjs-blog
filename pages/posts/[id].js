/*
  ファイル名: pages/posts/[id].js
  説明: idを指定して、その投稿の詳細を表示するコンポーネント
*/

import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <h1 className={utilStyles.headingXl}>{postData.title}</h1>
      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

// build時に呼び出される
export async function getStaticPaths() {
  // すべての記事のIDを取得して、getStaticPropsの呼び出し元で使用する
  const paths = getAllPostIds();
  return {
    paths, // getStaticPropsの引数になる
    fallback: false,
  };
}

// build時に呼び出される
export async function getStaticProps({ params }) {
  // 特定の記事のデータを取得して、Postコンポーネントに渡す
  const postData = await getPostData(params.id);
  return {
    props: {
      postData, // Postの引数になる
    },
  };
}
