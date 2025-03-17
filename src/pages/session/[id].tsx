import { useRouter } from 'next/router';

export default function Session() {
  const router = useRouter();
  return <div>Session: {router.query.id}</div>;
}
