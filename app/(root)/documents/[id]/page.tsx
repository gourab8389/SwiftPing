import CollaborativeRoom from "@/components/shared/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.error("No clerk user found, redirecting to sign-in.");
    redirect('/sign-in');
  }

  const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!userEmail) {
    console.error("No email found for the current user, redirecting to sign-in.");
    redirect('/sign-in');
  }

  const room = await getDocument({
    roomId: id,
    userId: userEmail,
  });

  if (!room) {
    console.error(`No room found for roomId: ${id}, redirecting to home.`);
    redirect('/');
  }

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  if (!Array.isArray(users) || users.length === 0) {
    console.error("No users found or users array is empty.");
  }

  const usersData = users.map((user: User) => {
    const email = user?.email;
    if (!email) {
      console.error(`User without email found: ${JSON.stringify(user)}`);
      return {
        ...user,
        userType: 'viewer',
      };
    }

    return {
      ...user,
      userType: room.usersAccesses[email]?.includes('room:write') ? 'editor' : 'viewer',
    };
  });

  const currentUserType = room.usersAccesses[userEmail]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
}

export default Document;
