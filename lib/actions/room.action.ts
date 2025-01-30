"use server";  // 这是 Next.js 14+ 版本的 Server Actions 语法，表示该函数在服务器端运行

import { nanoid } from 'nanoid';  // 用于生成唯一 ID
import { liveblocks } from '../liveblocks';  // 引入 Liveblocks API
import { revalidatePath } from 'next/cache';  // 用于缓存刷新
import { parseStringify } from '../utils';  // 自定义工具方法（可能用于 JSON 处理）

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();  // 生成唯一房间 ID
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled',
        };

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],  // 赋予当前用户编辑权限
        };

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: [],
        });

        revalidatePath("/");  // 重新验证缓存，更新 UI

        return parseStringify(room);  // 处理房间数据并返回
    } catch (error) {
        console.log(`Error happened while create room: ${error}`);  // 捕获并打印错误
    }
};
