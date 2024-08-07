'use client';

import Image from "next/image";
import Link from "next/link";

import styles from "./navbar.module.css";
import SignIn from "./sign-in";

import { onAuthStateChangeHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
  // init user state
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const unsubscribe = onAuthStateChangeHelper((user) => {
    setUser(user);
  });

   // cleanup subscription
  return () => { unsubscribe() };
})

  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image width={90} height={20}
          src="/youtube-logo.svg" alt="YouTube Logo"/>
      </Link>
      {
        user && <Upload />
      }
      <SignIn user={user} />
    </nav>
  );
}
