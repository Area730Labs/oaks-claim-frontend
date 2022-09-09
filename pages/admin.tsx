import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SolflareWalletAdapter,PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          new SolflareWalletAdapter(),
          new PhantomWalletAdapter(),
      ],
      []
  );
  
    const [loggedIn, setLoggedIn] = useState(false);
    const [data, setData] = useState(null);

  return (
    <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    
                  {!loggedIn && <Login onLoggedIn={(serverData: any) => {setLoggedIn(true); setData(serverData);}}/>}
                  
                  {loggedIn && <Dashboard data={data}/>}

                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  )
}

export default Home
