import { getBlogDateString, getPostBySlug, PostMetaData } from '@/app/blog/blog-util';
import BreadcrumbsComponent from '@/components/breadcrumbs-component';
import { BreadcrumbLink } from '@/components/shadcn/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Metadata } from 'next';
import Image from 'next/image';

type Props = {
  params: {
    slug: string;
  };
};

const getPageData = async (slug: string): Promise<{ meta: PostMetaData; content: any }> => {
  const { meta, content } = await getPostBySlug(slug);
  return { meta, content };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { meta } = await getPageData(params.slug);
  return {
    title: { absolute: `${meta.title} | The Residual Stream` },
    description: meta.description,
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | The Residual Stream`,
      description: meta.description,
      images: [
        {
          url: meta.imagePreview,
        },
      ],
    },
    openGraph: {
      title: `${meta.title} | The Residual Stream`,
      description: meta.description,
      url: `/blog/${params.slug}`,
      images: [
        {
          url: meta.imagePreview,
        },
      ],
      locale: 'en_US',
      type: 'website',
      siteName: 'MemicOS',
    },
  };
}

export default async function Page({ params }: Props) {
  const { meta, content } = await getPageData(params.slug);
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <BreadcrumbsComponent
        crumbsArray={[
          <BreadcrumbLink href="/blog" key={1}>
            The Residual Stream - MemicOS&apos;s Official Blog
          </BreadcrumbLink>,
          <BreadcrumbLink href={`/blog/${params.slug}`} key={2}>
            {/* @ts-ignore */}
            {meta.title}
          </BreadcrumbLink>,
        ]}
      />
      <div className="flex w-full max-w-screen-lg flex-col items-start justify-start px-2 pt-4 text-slate-800 sm:flex-row sm:items-center sm:justify-center sm:gap-x-7 sm:px-0">
        <div className="flex w-full flex-row items-center justify-center gap-x-5 sm:h-full sm:w-auto sm:flex-col sm:items-center sm:justify-start sm:gap-y-5 sm:pt-6">
          <a href="/blog">
            <Image
              src="/images/blog/the-residual-stream-logo.jpg"
              alt="The Residual Stream"
              className="h-32 w-32 rounded-full shadow transition-all hover:scale-105 sm:h-52 sm:min-h-52 sm:w-52 sm:min-w-52"
              width={420}
              height={420}
            />
          </a>
          <div className="flex flex-col items-center justify-center">
            <a href="/blog">
              <h1 className="whitespace-pre text-[22px] font-bold hover:underline">The Residual Stream</h1>
            </a>
            <h2 className="mt-1 text-[14px] font-medium text-slate-600">MemicOS&apos;s Official Blog</h2>{' '}
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
        <Card className="mb-12 mt-4 w-full bg-white">
          <CardHeader className="flex flex-col px-3 pb-1 sm:px-8">
            <Image src={meta.image} alt={meta.title} width={800} height={400} className="w-full rounded-md" />
            <CardTitle className="pt-5 text-2xl font-bold text-slate-800">{meta.title}</CardTitle>
            <div className="mb-2.5 text-[16px] font-medium text-slate-600">{meta.description}</div>
            <div className="text-[14px] font-medium text-slate-600">
              By {meta.author} · {getBlogDateString(meta.date)}
            </div>
          </CardHeader>
          <CardContent className="w-full px-3 pb-6 pt-0 sm:px-8">
            <div className="prose font-serif text-slate-700">{content}</div>
            <div className="flex w-full flex-row items-center justify-between gap-x-2 pt-16">
              <a href="/blog" className="text-[14px] font-medium text-sky-700 hover:underline">
                ← Back to Blog
              </a>
              <a href="/" className="text-[14px] font-medium text-sky-700 hover:underline">
                Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
