import ClientList from '../components/ClientList';

<<<<<<< HEAD
<<<<<<< HEAD
export const dynamic = 'force-dynamic';

=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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
