import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';

const Index = () => {
  const {publicKey} = useWallet();
  const [data, setData] = useState(null);
  const fetch = async () => {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/solana`, {walletAddress: publicKey?.toString()});
  };

  useEffect(() => {
    // connect().then(() => {
    fetch().then((res) => setData(res.data));
    // });
    // return disconnect;

  }, []);

  // if (!data) return <h1>Loading...</h1>;
  return (
    <div style={{
      width: '100wv',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <WalletMultiButton className="cta-button connect-wallet-button" />
      <h1>SOLANA!!!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default Index;


