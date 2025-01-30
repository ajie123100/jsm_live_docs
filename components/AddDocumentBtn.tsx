"use client";
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.action'
import { useRouter } from 'next/navigation'

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
    const router = useRouter(); // ✅ useRouter 必须在组件顶层调用

    const addDocumentHandler = async () => {
        try {
            const room = await createDocument({ userId, email })
            if (room) router.push(`/documents/${room.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button type="button" onClick={addDocumentHandler} className='bg-blue-500 hover:bg-blue-600'>
            <Image
                src="/assets/icons/add.svg" alt="add" width={24} height={24}
            />
            <p className="hidden sm:block">Start a blank document</p>
        </Button>
    );
};

export default AddDocumentBtn;
