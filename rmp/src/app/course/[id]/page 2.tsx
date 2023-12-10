import Course from '~/lib/pages/course';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <Course id={id} />;
}
