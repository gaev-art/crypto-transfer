import React from 'react';
import {TokenType} from '../pages/solana';

type Props = {
  data: TokenType[] | undefined
};

export const Form = ({data}: Props) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Submit');
  };
  return (
    <form style={{display: 'flex', flexDirection: 'column', width: '100%'}} onSubmit={handleSubmit}>
      {data ? <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {data.length !== 0 ?
            (<div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 style={{cursor: 'default'}}>Choose a token: </h2>
                <select className="input" name="token" id="tokens" style={{cursor: 'pointer'}}>
                  {data.map((token, i) => (
                    <option key={token.amount}
                            value={token.symbol}>{token.symbol === '' ? `Unknown token-${++i}` : token.symbol}</option>
                  ))}
                </select>
              </div>
              <div style={{width: '100%'}}>
                <input
                  style={{width: '100%'}}
                  name="addr"
                  className="input"
                  type="text"
                  placeholder="Recipient Address"
                />
              </div>
              <div>
                <input
                  style={{width: '100%'}}
                  name="ether"
                  className="input"
                  type="text"
                  placeholder="Recipient Amount"
                />
              </div>
              <button className="cta-button connect-wallet-button" style={{width: '100%'}} type="submit">Pay now</button>
            </div>)
            : (
              <h1 style={{color: '#E87B71'}}>No tokens in the wallet</h1>
            )}
        </div>
        :
        <h1> Request wallet info!</h1>
      }
    </form>
  );
};