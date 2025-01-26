import { auth } from "@/server/auth"
import Logo from "./Logo";
import UserBtn from "./user-btn";


export default async function Nav() {
    const user = await auth()
    console.log(user);
    return (
        <header className="w-full h-auto bg-slate-600 py-4">
            <nav>
                <ul className="flex justify-between items-center w-full h-full px-4">
                    <li>
                        <a href="#">Contact</a>
                    </li>
                    <li>
                        <UserBtn user={user?.user} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}