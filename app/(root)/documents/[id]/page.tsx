import CollaborateRoom from "@/components/CollaborateRoom";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  // ToDo:Assess the permissions of the user to access the document
  const userIds = Object.keys(room.usersAccesses);

  const users = await getClerkUsers({ userIds });

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="w-full flex flex-col items-center">
      <CollaborateRoom
        roomId={id}
        roomMetadata={room.metadata}
        currentUserType={currentUserType}
        users={usersData}
      />
    </main>
  );
};

export default Document;
