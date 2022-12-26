import React, {ReactNode} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';

type Props = {
  children: ReactNode
};
export const Layout = ({children}: Props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Crypto Transfer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <div className="navbar">
        <Link href={'/'} className={router.pathname == '/' ? 'active' : ''}>home</Link>
        <Link href={'/solana'} className={router.pathname == '/solana' ? 'active' : ''}>Solana</Link>
        <Link href={'/ethereum'} className={router.pathname == '/ethereum' ? 'active' : ''}>Ethereum</Link>
      </div>
      <div className="content">
        {children}
      </div>
    </>
  );
};