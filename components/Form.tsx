import React from 'react';

type Props = {
  data: any
};

const TOKENS = [
  {title: 'USDC', tokenAddr: '0xb3b7a7337B99935abfab95EfD451Ebd7610AA063'},
  {title: 'TBzC', tokenAddr: '0x67Bf183Ab6563b2a20aAcF107079a1c8879B426a'},
  // {title: 'GoerliETH', tokenAddr: '0x7af963cf6d228e564e2a0aa0ddbf06210b38615d'},
];
export const Form = ({data}: Props) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Submit');
  };
  return (
    <form style={{display: 'flex', flexDirection: 'column', width: '100%'}} onSubmit={handleSubmit}>
      {data ? <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{cursor: 'default'}}>Choose a token: </h2>
            <select className="input" name="token" id="tokens" style={{cursor: 'pointer'}}>
              {TOKENS.map((token) => (
                <option key={token.tokenAddr}
                        value={token.title}>{token.title}</option>
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
        </div>
        :
        <h1> Request wallet info!</h1>
      }
    </form>
  );
};