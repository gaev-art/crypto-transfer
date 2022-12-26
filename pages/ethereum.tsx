import axios from 'axios';
import {useEffect, useState} from 'react';
import {useMetaMask} from 'metamask-react';

const Index = () => {
  const {connect, account} = useMetaMask();
  const [data, setData] = useState(null);
  const fetch = async () => {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/ethereum`, {walletAddress: account});
  };

  useEffect(() => {
      connect().then(() => {
        fetch().then(res => setData(res.data));
      });
    },
    []);

  if (!data) return <h1>Loading...</h1>;

  return (
    <div style={{
      width: '100wv',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1>ETHEREUM!!!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default Index;

