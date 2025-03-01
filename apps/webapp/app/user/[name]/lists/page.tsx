import { getUserListsSimple } from '@/lib/db/list';
import { getUserByName } from '@/lib/db/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions';
import Lists from './lists';

export default async function Page({ params }: { params: { name: string } }) {
  const session = await getServerSession(authOptions);

  const user = await getUserByName(params.name);

  const lists = await getUserListsSimple(user.id);

  return <Lists showCreate={params.name === session?.user.name} initialLists={lists} username={user.name} />;
}
