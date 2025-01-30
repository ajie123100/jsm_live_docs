"use client"
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'

const CollaborateRoom = () => {
    return (
        <RoomProvider id="my-room">
            <ClientSideSuspense fallback={<div>Loading…</div>}>
                <div className="collaborative-room">
                    <Header>
                        <div className='flex w-fit items-center justify-center gap-2'>
                            <p className='document-title'>this is a fake document title</p>
                        </div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Header>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborateRoom
