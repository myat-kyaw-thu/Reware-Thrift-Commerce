'use client'

import { useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'

export default function PostBtn() {
    const { pending } = useFormStatus()
    const [buttonText, setButtonText] = useState('Create Post')
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (pending) {
            setButtonText('Posting...')
        } else if (isSuccess) {
            setButtonText('Posted!')
            const timer = setTimeout(() => {
                setButtonText('Create Post')
                setIsSuccess(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [pending, isSuccess])

    useEffect(() => {
        if (!pending && buttonText === 'Posting...') {
            setIsSuccess(true)
        }
    }, [pending, buttonText])

    return (
        <button
            type="submit"
            disabled={pending || isSuccess}
            className={`mt-4 ${
                pending || isSuccess 
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
        >
            {buttonText}
        </button>
    )
}