import { getMDXBySlug, getMDXData } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";

export async function generateStaticParams() {
  const allTravel = await getMDXData("travel");
  return allTravel.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getMDXBySlug("travel", params.slug);
  if (!post) return {};

  return {
    title: post.metadata.title,
  };
}

export default async function TravelDetail({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getMDXBySlug("travel", params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-0 pb-24 prose max-w-none">
      {post.metadata.banner && (
        <div className="w-full h-[60vh] relative mb-12 overflow-hidden rounded-lg">
          <Image
            src={post.metadata.banner}
            alt={post.metadata.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="container-reading">
        <header className="mb-12 not-prose">
          <span className="text-sm mono text-muted uppercase tracking-widest block mb-4">
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-ink mb-0">
            {post.metadata.title}
          </h1>
        </header>
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
