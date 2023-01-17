import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../index';
import { signOut } from 'firebase/auth';

import { motion } from 'framer-motion';

export default function Home() {
    const [ user, loading, error ] = useAuthState(auth);

    console.log(user);

    return (
        <motion.div>
            <motion.h1 className="text-xl">Hello, {user.displayName}!</motion.h1>
            <button className="text-lg px-4 py-1 border-[1px] border-asu-maroon rounded-xl my-2"
                onClick={() => signOut(auth)}
            >Logout</button>
        </motion.div>
    );
}
