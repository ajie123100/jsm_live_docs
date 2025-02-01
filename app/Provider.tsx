'use client'
import Loader from '@/components/Loader'
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from '@liveblocks/react/suspense'

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser } = useUser()
  return (
    // LiveblocksProvider
    // 解释: 用于提供 Liveblocks 的上下文
    // 用法: 用于提供 Liveblocks 的上下文
    // 详细: https://docs.liveblocks.io/reference/liveblocks-provider
    <LiveblocksProvider
      // authEndpoint
      // 解释: 用于验证用户的 API 端点
      // 用法: 当 Liveblocks 需要验证用户时，将调用此端点
      // 例如: 当用户加入房间时，Liveblocks 将调用此端点以验证用户的身份
      // 详细: https://docs.liveblocks.io/reference/liveblocks-provider#authendpoint
      authEndpoint='/api/liveblocks-auth'
      // resolveUsers
      // 解释: 用于解析用户信息的函数
      // 用法: 当 Liveblocks 需要获取用户信息时，将调用此函数
      // 例如: 当用户加入房间时，Liveblocks 将调用此函数以获取用户信息
      // 详细: https://docs.liveblocks.io/reference/liveblocks-provider#resolveusers
      resolveUsers={async ({ userIds }) => {
        try {
          const users = await getClerkUsers({ userIds })

          // 确保返回符合 Liveblocks 需求的用户信息
          return users
        } catch (error) {
          console.error('Error resolving users:', error)
          return []
        }
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        })
        return roomUsers
      }}
    >
      {/* ClientSideSuspense
      解释: 用于在客户端加载时显示加载器
      用法: 用于在客户端加载时显示加载器
      详细: https://docs.liveblocks.io/reference/client-side-suspense
      */}
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  )
}

export default Provider
