// 导入所需的工具函数和组件
import { cn } from '@/lib/utils' // 用于动态生成类名的工具函数
import { useIsThreadActive } from '@liveblocks/react-lexical' // 检查线程是否处于活动状态的钩子
import { Composer, Thread } from '@liveblocks/react-ui' // Liveblocks 提供的 UI 组件
import { useThreads } from '@liveblocks/react/suspense' // 获取线程列表的钩子
import React from 'react' // React 核心库

// ThreadWrapper 组件：用于渲染单个线程
const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  // 使用 useIsThreadActive 钩子检查当前线程是否处于活动状态
  const isActive = useIsThreadActive(thread.id)

  return (
    // Thread 组件：渲染线程内容
    <Thread
      thread={thread} // 传递线程数据
      data-state={isActive ? 'active' : null} // 根据活动状态设置 data-state 属性
      className={cn(
        'comment-thread border p-4 rounded-lg mb-4', // 基础样式
        isActive && '!border-blue-500 shadow-md', // 活动状态下添加蓝色边框和阴影
        thread.resolved && 'opacity-40', // 如果线程已解决，降低透明度
      )}
    >
      {/* 如果线程已解决，显示一个“Resolved”标记 */}
      {thread.resolved && (
        <span className='ml-2 text-sm text-green-500'>Resolved</span>
      )}
    </Thread>
  )
}

// Comments 组件：用于渲染评论区域
const Comments = () => {
  // 使用 useThreads 钩子获取所有线程
  const { threads } = useThreads()

  return (
    <div className='comments-container'>
      {/* Composer 组件：用于创建新评论 */}
      <Composer className='comment-composer' />

      {/* 如果没有线程，显示提示信息 */}
      {threads.length === 0 && (
        <div className='text-gray-500'>
          No comments yet. Start a conversation!
        </div>
      )}

      {/* 遍历线程列表，渲染每个线程 */}
      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  )
}

// 导出 Comments 组件
export default Comments
