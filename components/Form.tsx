import React from 'react';
import {TokenType} from '../pages/solana';

type Props = {
  data: TokenType[] | undefined
  startPayment?: (ether: string, addr: string, token: TokenType) => void
};

export const Form = ({data, startPayment}: Props) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataForm = new FormData(e.currentTarget);
    const address = dataForm.get('addr');
    const value = dataForm.get('ether');
    const tokenTitle = dataForm.get('token');
    const token = data?.filter(token => token.associatedTokenAddress === tokenTitle);
    if (token && address && token)
      startPayment && startPayment(String(value), String(address), token[0]);
  };
  return (
    <form className="flex flex-col self-center" onSubmit={handleSubmit}>
      {data ? <div className="flex flex-col gap-[10px]">
          {data.length !== 0 ? (
            <div className="flex flex-col gap-[10px]">
              <div className="w-full flex justify-between items-center">
                <h2 className="cursor-default">Choose a token: </h2>
                <select name="token" id="tokens" className="cursor-default input">
                  {data.map((token, i) => (
                    <option key={token.amount} value={token.associatedTokenAddress}>
                      {token.symbol === '' ? `Unknown token-${++i}` : token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <input className="w-full input" name="addr" type="text" placeholder="Recipient Address"/>
              </div>
              <div>
                <input name="ether" className="w-full input" type="text" placeholder="Recipient Amount"/>
              </div>
              <button className="self-center cta-button connect-wallet-button" type="submit">Pay now</button>
            </div>
          ) : (
            <h1 style={{color: '#E87B71', display: 'flex', alignSelf: 'center'}}>No tokens in the wallet</h1>
          )}
        </div>
        :
        <h1 style={{display: 'flex', alignSelf: 'center'}}> Request wallet info!</h1>
      }
    </form>
  );
};