import axios from 'axios';
import React, {useState} from 'react';
import {LinearProgress, linearProgressClasses} from '@mui/material';
import {showToast} from '../components/ShowToast';
import {useMetaMask} from 'metamask-react';
import {Form} from '../components/Form';

const TYPE_NETWORK = ['GOERLI', 'POLYGON', 'ETHEREUM'];

const Index = () => {
  const {connect, ethereum, status, account} = useMetaMask();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState(TYPE_NETWORK[0]);

  const fetch = async () => {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/ethereum`, {
      walletAddress: account,
      network
    });
  };

  const onChangeHandler = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value);
  };

  return (
    <div style={{
      width: '100wv',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <div style={{
        height: '20%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '5px',
        flexDirection: 'column'
      }}>
        <div className="button-container" style={{width: '100%'}}>
          {status === 'connected' ? (
            <button
              style={{width: '100%'}}
              className="cta-button connect-wallet-button"
              onClick={async () => {
                ethereum._events.accountsChanged([]);
                setData(null);
                showToast('Disconnected wallet', 'success');
              }}
            >
              Disconnect!
            </button>
          ) : (
            <button
              style={{width: '100%'}}
              className="cta-button connect-wallet-button"
              onClick={async () => {
                await connect();
                showToast('Connected wallet', 'success');
              }}
            >
              Connect!
            </button>
          )}
        </div>
        <div style={{display: 'flex', gap: '5px',}}>
          <button
            className="cta-button connect-wallet-button"
            onClick={async () => {
              setIsLoading(true);
              const walletInfoBalance = await fetch();
              setIsLoading(false);
              setData(walletInfoBalance.data);
              console.log(walletInfoBalance.data);
            }}
            disabled={!account}
          >
            Get wallet info!
          </button>
          <select
            style={{cursor: 'pointer'}}
            className="input"
            name="token"
            id="tokens"
            onChange={onChangeHandler}
            value={network}
            disabled={!account}
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
      {!!account ? (<Form data={data}/>) : (<h1>Connect your wallet</h1>)}

    </div>
  );
};
export default Index;


