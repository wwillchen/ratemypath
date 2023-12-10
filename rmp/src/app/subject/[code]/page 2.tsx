import Subject from '~/lib/pages/subject';

export default function Page({ params }: { params: { code: string } }) {
  const { code } = params;

  return <Subject code={code} />;
}
