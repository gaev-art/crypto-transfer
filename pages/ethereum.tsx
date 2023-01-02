import axios from 'axios';
import React, {useState} from 'react';
import {LinearProgress, linearProgressClasses} from '@mui/material';
import {showToast} from '../components/ShowToast';
import {useMetaMask} from 'metamask-react';
import {Form} from '../components/Form';
import {ResponseType, TokenType} from './solana';
import {ContractInterface, ethers} from 'ethers';
import {web3ApiVersionOperation} from '@moralisweb3/common-evm-utils';
import Link from 'next/link';
import {useRouter} from 'next/router';

export const ERC20_CONTRACT_INTERFACE: ContractInterface = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address _owner) public view returns (uint256 balance)',
  'function transfer(address _to, uint256 _value) public returns (bool success)',
  'function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)',
  'function approve(address _spender, uint256 _value) public returns (bool success)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
];

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

const TYPE_NETWORK = ['ETHEREUM', 'GOERLI', 'POLYGON'];

const Index = () => {
  const router = useRouter();
  const {connect, ethereum, status, account} = useMetaMask();
  const [data, setData] = useState<ResponseType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrx, setIsLoadingTrx] = useState(false);
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

  const startPayment = async (ether: string, addr: string, token: TokenType) => {
    try {
      setIsLoadingTrx(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const erc20 = new ethers.Contract(token.associatedTokenAddress, ERC20_CONTRACT_INTERFACE, signer);
      const tx = await erc20.transfer(addr, ethers.utils.parseUnits(ether, token.decimals));
      await tx.wait();
      showToast('Transaction completed', 'success');
    } catch (err: any) {
      showToast(err.reason as string, 'error');
      console.error({error: err});
    } finally {
      setIsLoadingTrx(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-[20px] self-center relative">
      <Link href={'/'} className={router.pathname == '/' ? 'link active' : 'link'}>+</Link>
      <div className="flex items-start flex-col self-center gap-[5px]">
        <div className="w-full button-container">
          {status === 'connected' ? (
            <button
              className="w-full cta-button connect-wallet-button"
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
              className="w-full cta-button connect-wallet-button"
              onClick={async () => {
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
              console.log(walletInfoBalance.data);
            }}
            disabled={!account}
          >
            Get wallet info!
          </button>
          <select
            className="cursor-pointer input"
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
      {data && data.tokens.length !== 0 && (
        <div className="flex flex-col items-start self-center gap-[5px]">
          <h3>Balance the wallet</h3>
          {data?.tokens.map((token, i) => (
            <div key={token.amount}>{token.symbol === '' ? `Unknown token-${++i}` : token.symbol} = {token.amount}</div>
          ))}
        </div>
      )}
      {!!account ? (<Form data={data?.tokens} startPayment={startPayment}/>) : (<h1>Connect your wallet</h1>)}
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


