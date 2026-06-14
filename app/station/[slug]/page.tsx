import StationPage from "@/components/StationPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <StationPage stationSlug={slug} />;
}