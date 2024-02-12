/*
  ファイル名: lib/posts.js
  説明: 投稿データの一覧や各投稿の詳細を取得するライブラリ
*/

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from 'remark'; // markdownをレンダリングする
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => !fileName.startsWith(".")) // 隠しファイルを除去
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Returns an array of page ids
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => !fileName.startsWith(".")) // 隠しファイルを除去
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""), // Remove ".md" from file name
        },
      };
    });
}

// Get post data by id
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // fileContentsのheader部分をオブジェクトとしてdataプロパティに取得
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
