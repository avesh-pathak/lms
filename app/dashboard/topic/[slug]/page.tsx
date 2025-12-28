import { TopicDetail } from "@/components/topic-detail"

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug) {
    return <div className="p-6 text-muted-foreground">Invalid topic</div>
  }

  return <TopicDetail topicSlug={slug} />
}
