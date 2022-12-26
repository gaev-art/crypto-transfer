import {useMemo} from 'react';
import type {AppProps} from 'next/app';
import {Layout} from '../components/Layout';
import {ToastContainer} from 'react-toastify';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {clusterApiUrl} from '@solana/web3.js';

import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import {MetaMaskProvider} from 'metamask-react';


export default function App({Component, pageProps}: AppProps) {

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({network}),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <MetaMaskProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </MetaMaskProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
