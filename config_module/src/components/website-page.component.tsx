import { useParams } from 'react-router-dom';

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <div>{id}</div>
    </>
  );
}
