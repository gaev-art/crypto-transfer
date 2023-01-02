import axios from 'axios';
import React, {useMemo, useState} from 'react';
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import {LinearProgress, linearProgressClasses} from '@mui/material';
import {showToast} from '../components/ShowToast';
import {PhantomWalletName} from '@solana/wallet-adapter-phantom';
import {Form} from '../components/Form';
import {Keypair, Transaction} from '@solana/web3.js';
import Link from 'next/link';
import {useRouter} from 'next/router';

export type TokenType = {
  amount: string,
  amountRaw: string,
  associatedTokenAddress: string,
  decimals: string,
  mint: string,
  name: string,
  symbol: string,
}
export type ResponseType = { tokens: TokenType[], walletAddress: string }
const TYPE_NETWORK = ['MAINNET', 'DEVNET'];

const Index = () => {
  const router = useRouter();
  const {connection} = useConnection();
  const {publicKey, connect, connected, select, disconnect, sendTransaction} = useWallet();
  const [data, setData] = useState<ResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrx, setIsLoadingTrx] = useState(false);
  const [network, setNetwork] = useState(TYPE_NETWORK[0]);
  const orderID = useMemo(() => Keypair.generate().publicKey, []);

  const fetch = async () => {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/solana`, {
      walletAddress: publicKey?.toString(),
      network
    });
  };

  const getLink = (signature: string) => (
    <a style={{color: 'black'}} href={`https://solscan.io/tx/${signature}?cluster=devnet`} target="_blank"
       rel="noreferrer">
      Transaction completed! click --{'> '}
      {signature.slice(0, 4)}...{signature.slice(signature.length - 4, signature.length)}
    </a>
  );

  const onChangeHandler = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value);
  };
  const startPayment = async (sol: string, addr: string, token: TokenType) => {
    setIsLoadingTrx(true);
    const txData = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/createTransaction`, {
      senderAddress: publicKey?.toString(),
      orderID,
      amount: sol,
      sellerAddress: addr,
      tokenAddress: token.mint
    });

    const tx = Transaction.from(Buffer.from(txData.data.transaction, 'base64'));

    try {
      showToast('Starting transaction.', 'default');
      const txHash = await sendTransaction(tx, connection);
      showToast(getLink(txHash), 'success');
    } catch (error) {
      console.error(error);
      showToast(error as string, 'error');
    } finally {
      setIsLoadingTrx(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-[20px] self-center relative">
      <Link href={'/'} className={router.pathname == '/' ? 'link active' : 'link'}>+</Link>
      <div className="flex items-start flex-col self-center gap-[5px]">
        <div className="w-full button-container">
          {connected ? (
            <button
              className="w-full cta-button connect-wallet-button"
              onClick={async () => {
                await disconnect();
                setData(null);
                showToast('Disconnected wallet', 'success');
              }}
            >
              Disconnect!
            </button>
          ) : (
            <button
              className="w-full cta-button connect-wallet-button"
              onClick={async () => {
                await select(PhantomWalletName);
                await connect();
                showToast('Connected wallet', 'success');
              }}
            >
              Connect!
            </button>
          )}
        </div>
        <div className="flex self-center gap-[5px]">
          <button
            className="cta-button connect-wallet-button"
            onClick={async () => {
              setIsLoading(true);
              const walletInfoBalance = await fetch();
              setIsLoading(false);
              setData(walletInfoBalance.data);
            }}
            disabled={!publicKey?.toString()}
          >
            Get wallet info!
          </button>
          <select
            className="cursor-pointer input"
            name="token"
            id="tokens"
            onChange={onChangeHandler}
            value={network}
            disabled={!publicKey?.toString()}
          >
            {TYPE_NETWORK.map((token) => (
              <option key={token} value={token}>{token}</option>
            ))}
          </select>
        </div>
        {isLoading && <LinearProgress
          sx={{
            borderRadius: '4px',
            height: '2px',
            width: '100%',
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: '#ff8867',
            },
            [`& .${linearProgressClasses.bar}`]: {
              backgroundColor: '#fad2fa',
            },
          }}
        />}
      </div>
      {data && data.tokens.length !== 0 && (
        <div className="flex flex-col items-start self-center gap-[5px]">
          <h3>Balance the wallet</h3>
          {data?.tokens.map((token, i) => (
            <div key={token.amount}>{token.symbol === '' ? `Unknown token-${++i}` : token.symbol} = {token.amount}</div>
          ))}
        </div>
      )}
      {!!publicKey?.toString() ? (<Form data={data?.tokens} startPayment={startPayment}/>) : (<h1>Connect your wallet</h1>)}
      {isLoadingTrx && <LinearProgress
        sx={{
          borderRadius: '4px',
          height: '2px',
          width: '200px',
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#ff8867',
          },
          [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: '#fad2fa',
          },
        }}
      />}
    </div>
  );
};
export default Index;


