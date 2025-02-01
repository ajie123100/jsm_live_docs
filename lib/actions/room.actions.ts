'use server'

import { nanoid } from 'nanoid' // 用于生成唯一 ID
import { liveblocks } from '../liveblocks' // 引入 Liveblocks API
import { revalidatePath } from 'next/cache' // 用于缓存刷新
import { getAccessType, parseStringify } from '../utils' // 自定义工具方法（可能用于 JSON 处理）
import { redirect } from 'next/navigation'

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid() // 生成唯一房间 ID
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: 'Untitled',
    }

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write'], // 赋予当前用户编辑权限
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    })

    revalidatePath('/') // 重新验证缓存，更新 UI

    return parseStringify(room) // 处理房间数据并返回
  } catch (error) {
    console.log(`Error happened while create room: ${error}`) // 捕获并打印错误
  }
}

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) => {
  try {
    const room = await liveblocks.getRoom(roomId) // 获取房间数据

    const hasAccess = Object.keys(room.usersAccesses).includes(userId) // 检查用户是否有权限

    if (!hasAccess) {
      throw new Error('You do not have access to this room') // 没有权限则抛出错误
    }

    return parseStringify(room) // 处理房间数据并返回
  } catch (error) {
    console.log(`Error happened while get room: ${error}`) // 捕获并打印错误
  }
}

export const updateDocument = async ({
  roomId,
  title,
}: {
  roomId: string
  title: string
}) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    })

    revalidatePath(`/documents/${roomId}`) // 重新验证缓存，更新 UI
    return parseStringify(updatedRoom)
  } catch (error) {
    console.log(`Error happened while update room: ${error}`) // 捕获并打印错误
  }
}

export const getDocuments = async ({ email }: { email: string }) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email }) // 获取房间数据
    return parseStringify(rooms) // 处理房间数据并返回
  } catch (error) {
    console.log(`Error happened while get rooms: ${error}`) // 捕获并打印错误
  }
}

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    }

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    })

    if (room) {
      const notificationId = nanoid()

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      })
    }

    revalidatePath(`/documents/${roomId}`)
    return parseStringify(room)
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`)
  }
}

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string
  email: string
}) => {
  try {
    const room = await liveblocks.getRoom(roomId)

    if (room.metadata.email === email) {
      throw new Error('You cannot remove yourself from the document')
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    })

    revalidatePath(`/documents/${roomId}`)
    return parseStringify(updatedRoom)
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`)
  }
}

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId)
    revalidatePath('/')
    redirect('/')
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`)
  }
}
