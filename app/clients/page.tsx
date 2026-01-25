import ClientList from '../components/ClientList';

export const dynamic = 'force-dynamic';
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div>
      <ClientList searchParams={resolvedSearchParams} />
    </div>
  );
}
