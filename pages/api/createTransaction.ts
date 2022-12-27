import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {NextApiRequest, NextApiResponse} from 'next';
import {createTransferCheckedInstruction, getAssociatedTokenAddress, getMint} from '@solana/spl-token';


const createTransaction = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const {senderAddress, orderID, amount, sellerAddress, tokenAddress} = request.body;
    if (!senderAddress) {
      response.status(400).json({
        message: 'Missing sender address',
      });
    }

    if (!orderID) {
      response.status(400).json({
        message: 'Missing order ID',
      });
    }

    if (!amount) {
      response.status(404).json({
        message: 'Missing amount',
      });
    }

    const bigAmount = BigNumber(amount);
    const buyerPublicKey = new PublicKey(senderAddress);

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);
    const buyerUsdcAddress = await getAssociatedTokenAddress(new PublicKey(tokenAddress), buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(new PublicKey(tokenAddress), new PublicKey(sellerAddress));
    const {blockhash} = await connection.getLatestBlockhash('finalized');
    const usdcMint = await getMint(connection, new PublicKey(tokenAddress));
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress,
      new PublicKey(tokenAddress),
      shopUsdcAddress,
      buyerPublicKey,
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals,
      usdcMint.decimals
    );

    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString('base64');

    response.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error(err);

    response.status(500).json({error: 'error creating transaction'});
  }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    await createTransaction(request, response);
  } else {
    response.status(405).end();
  }
}
