import { getBlogDateString, getPostsMetaData, PostMetaData } from '@/app/blog/blog-util';
import BreadcrumbsComponent from '@/components/breadcrumbs-component';
import { BreadcrumbLink } from '@/components/shadcn/breadcrumbs';
import { Card, CardContent } from '@/components/shadcn/card';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `The Residual Stream - MemicOS's Official Blog`,
    description: 'The Residual Stream is MemicOS&apos;s official blog.',
    openGraph: {
      title: `The Residual Stream - MemicOS's Official Blog`,
      description: 'The Residual Stream is MemicOS&apos;s official blog.',
      url: `/blog`,
      images: [
        {
          url: '/images/blog/the-residual-stream-logo.jpg',
        },
      ],
    },
  };
}

export default async function Page() {
  const posts = (await getPostsMetaData()) as PostMetaData[];

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-start pb-5">
      <BreadcrumbsComponent
        crumbsArray={[
          <BreadcrumbLink href="/blog" key={1}>
            The Residual Stream - MemicOS&apos;s Official Blog
          </BreadcrumbLink>,
        ]}
      />
      <div className="flex h-full w-full max-w-screen-lg flex-col items-start justify-start px-2 pt-4 text-slate-800 sm:flex-row sm:items-center sm:justify-center sm:gap-x-10">
        <div className="flex w-full flex-row items-center justify-center gap-x-5 sm:h-full sm:w-auto sm:flex-col sm:items-center sm:justify-start sm:gap-y-5 sm:pt-6">
          <a href="/blog">
            <Image
              src="/images/blog/the-residual-stream-logo.jpg"
              alt="The Residual Stream"
              className="h-32 w-32 rounded-full shadow transition-all hover:scale-105 sm:h-64 sm:min-h-64 sm:w-64 sm:min-w-64"
              width={420}
              height={420}
            />
          </a>
          <div className="flex flex-col items-center justify-center">
            <a href="/blog">
              <h1 className="whitespace-pre text-2xl font-bold">The Residual Stream</h1>
            </a>
            <h2 className="mt-1 text-[14px] font-medium text-slate-600">MemicOS&apos;s Official Blog</h2>
            <a href="/feed.xml">
              <img
                src="https://img.shields.io/badge/rss-F88900?style=for-the-badge&logo=rss&logoColor=white"
                alt="RSS"
                className="mt-2 rounded"
                width={60}
                height={30}
              />
            </a>
          </div>
        </div>
        <Card className="mt-4 h-full w-full bg-white">
          <CardContent className="w-full px-4">
            <div className="my-4 flex w-full gap-4 divide-y">
              {posts &&
                posts.map((post, index) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={index}
                    className="flex w-full flex-row items-start justify-center gap-x-4 gap-y-1 border-b px-4 py-4 transition-all hover:bg-slate-50"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={800}
                      height={400}
                      className="w-[50%] max-w-[50%] flex-1 rounded-md"
                    />
                    <div className="flex flex-1 flex-col">
                      <p className="mb-0.5 text-[17px] font-bold text-sky-900">{post.title}</p>
                      <p className="mb-1.5 text-[13px] font-medium text-slate-600">{post.description}</p>
                      <p className="text-[11px] font-medium text-slate-500">
                        {post.author} · {getBlogDateString(post.date)}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
