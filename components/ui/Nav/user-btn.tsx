"use client"

import { signOut } from "@/server/auth"
import { Session } from "next-auth"
export default function UserBtn(props: {user: Session}) {
    const {user} = props
    const username = user?.name
    return (
        <>
        <h1>{username}</h1>
        <button onClick={() => signOut()}>Sign Out</button>
        </>
    )
}