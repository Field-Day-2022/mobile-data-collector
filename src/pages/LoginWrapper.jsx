import { auth } from "../index";
import {
    getRedirectResult,
    GoogleAuthProvider,
    signInWithRedirect,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const LoginWrapper = ({ children }) => {
    const [ user, loading, error ] = useAuthState(auth);

    if (user && (user.email.slice(-7) === 'asu.edu')) {
        return children;
    } else if (loading) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">Loading user info...</motion.p>
            </motion.div>
        )
    } else if (error) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">Error signing in: {error}</motion.p>
            </motion.div>
        )
    } else {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.h1 className="text-black text-4xl">Welcome to Field Day</motion.h1>
                <motion.p className="text-black text-lg text-center">Login with your ASU Google account to continue</motion.p>
                <motion.button className="text-black border-asu-maroon text-2xl px-4 py-2 border-2 rounded-2xl"
                    onClick={() => signInWithRedirect(auth, new GoogleAuthProvider())}
                >Login</motion.button>
            </motion.div>
        )
    }
}