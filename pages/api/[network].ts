import type {NextApiRequest, NextApiResponse} from 'next';
import connectMoralis from '../../utils/connectMoralis';
import Moralis from 'moralis';
import {SolNetwork} from '@moralisweb3/common-sol-utils';
import {EvmChain} from '@moralisweb3/common-evm-utils';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const {network} = request.query;
    const {walletAddress} = request.body;
    try {
      await connectMoralis();

      if (!network) response.status(200).json({
        message: 'Add a network on request.'
      });
      if (walletAddress)
        switch (network) {
          case 'solana':
            const tokensBalances = await Promise.all([
              Moralis.SolApi.account.getPortfolio({
                network: SolNetwork.DEVNET,
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
                chain: EvmChain.GOERLI,
                address: walletAddress as string,
              }),
              Moralis.EvmApi.token.getWalletTokenBalances({
                chain: EvmChain.GOERLI,
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


