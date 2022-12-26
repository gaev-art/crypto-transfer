import Moralis from 'moralis';
import {MoralisError} from '@moralisweb3/common-core';

const connectMoralis = async () => {
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
  } catch (error) {
    return error as MoralisError;
  }
};

export default connectMoralis;