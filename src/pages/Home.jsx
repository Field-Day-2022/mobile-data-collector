import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../index';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { pastSessionData } from '../utils/jotai';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
    const [user, loading, error] = useAuthState(auth);
    const [pastSessions] = useAtom(pastSessionData);
    return (
        <motion.div>
            <motion.h1 className="text-xl">Hello, {user.displayName}!</motion.h1>
            <button
                className="text-lg px-4 py-1 border-[1px] border-asu-maroon rounded-xl my-2"
                onClick={() => signOut(auth)}
            >
                Logout
            </button>
            <p className="text-xl mt-4 font-bold underline mb-2">Daily summary:</p>
            <table className="rounded-xl table-auto border-collapse w-full">
                <thead>
                    <tr>
                        <th className="border-b border-r border-slate-500 w-1/4 p-2">Synced?</th>
                        <th className="border-b border-slate-500 p-2">Record</th>
                    </tr>
                </thead>
                <tbody>
                    {pastSessions.map((session) => {
                        const date = new Date(session.sessionData.sessionDateTime);
                        return (
                            <tr key={session.sessionData.sessionDateTime} >
                                <td className="flex justify-center">
                                    {session.uploaded ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 stroke-green-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 stroke-red-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </td>
                                <td>
                                    {session.sessionData.site} @ {date.toLocaleTimeString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </motion.div>
    );
}
