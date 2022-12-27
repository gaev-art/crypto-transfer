import type {NextApiRequest, NextApiResponse} from 'next';
import connectMoralis from '../../utils/connectMoralis';
import Moralis from 'moralis';
import {SolNetwork} from '@moralisweb3/common-sol-utils';
import {EvmChain} from '@moralisweb3/common-evm-utils';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const {chain} = request.query;
    const {walletAddress, network} = request.body;

    const getSymbol = (network: string) => {
      switch (network) {
        case 'GOERLI':
          return {symbol: 'GoerliETH', name: 'goerli', decimals: '18'};
        case 'ETHEREUM':
          return {symbol: 'ETH', name: 'ethereum', decimals: '16'};
        case 'POLYGON':
          return {symbol: 'MATIC', name: 'matic', decimals: '18'};
        default:
          throw 'Incorrect blockchain identifier';
      }
    };

    try {
      await connectMoralis();

      if (!chain) response.status(200).json({
        message: 'Add a network on request.'
      });
      if (walletAddress)
        switch (chain) {
          case 'solana':
            const tokensBalances = await Promise.all([
              Moralis.SolApi.account.getPortfolio({
                network: SolNetwork[network as 'DEVNET' | 'MAINNET'],
                address: walletAddress as string,
              }),
            ]);
            const solTokens: {}[] = [...tokensBalances[0].raw.tokens, {
              amount: tokensBalances[0].raw.nativeBalance.solana,
              amountRaw: tokensBalances[0].raw.nativeBalance.solana,
              associatedTokenAddress: '',
              decimals: '6',
              mint: '',
              name: 'solana',
              symbol: 'SOL',

            }];
            response.status(200).json({tokens: solTokens});
            break;
          case 'ethereum':
            const [nativeBalance, tokenBalances] = await Promise.all([
              Moralis.EvmApi.balance.getNativeBalance({
                chain: EvmChain[network as 'GOERLI' | 'POLYGON' | 'ETHEREUM'],
                address: walletAddress as string,
              }),
              Moralis.EvmApi.token.getWalletTokenBalances({
                chain: EvmChain[network as 'GOERLI' | 'POLYGON' | 'ETHEREUM'],
                address: walletAddress as string,
              }),
            ]);

            const ethTokens: {}[] = [...tokenBalances.raw.map((token) => {
              return {
                amount: String(+token.balance / 10 ** token.decimals),
                amountRaw: +token.balance,
                associatedTokenAddress: token.token_address,
                decimals: token.decimals,
                mint: token.token_address,
                name: token.name,
                symbol: token.symbol,
              };
            })];
            if (nativeBalance.raw.balance !== '0') {
              ethTokens.push({
                amount: String(+nativeBalance.raw.balance / 10 ** +getSymbol(network).decimals),
                amountRaw: nativeBalance.raw.balance,
                associatedTokenAddress: '',
                decimals: getSymbol(network).decimals,
                mint: '',
                name: getSymbol(network).name,
                symbol: getSymbol(network).symbol,

              });
            }
            response.status(200).json({tokens: ethTokens});
            break;
          default:
            response.status(200).json({
              message: 'Server started, but network is not entered correctly'
            });
        }
    } catch (error) {
      console.error(error);
      response.status(500).json(error);
    }
  }
}


