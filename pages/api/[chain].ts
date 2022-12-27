import type {NextApiRequest, NextApiResponse} from 'next';
import connectMoralis from '../../utils/connectMoralis';
import Moralis from 'moralis';
import {SolNetwork} from '@moralisweb3/common-sol-utils';
import {EvmChain} from '@moralisweb3/common-evm-utils';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const {chain} = request.query;
    const {walletAddress, network} = request.body;
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

            response.status(200).json({
              walletAddress: walletAddress,
              tokensBalances: tokensBalances[0],
            });
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
            response.status(200).json({
              walletAddress: walletAddress,
              nativeBalance: nativeBalance.result.balance.ether,
              tokenBalances: tokenBalances.result.map((token) => token),
            });
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


