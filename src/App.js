import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = '0x6e6Ae3Bac2428f93Dd9A792bf4EAc2843B32812C';
const ABI = [
  'function message() public view returns (string)',
  'function setMessage(string memory _newMessage) public',
];

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const currentMessage = await contract.message();

      setAccount(address);
      setContract(contract);
      setMessage(currentMessage);
      setWalletConnected(true);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setContract(null);
    setMessage('');
    setNewMessage('');
    setAccount('');
  };

  const updateMessage = async () => {
    if (!contract || !newMessage) return;
    const tx = await contract.setMessage(newMessage);
    await tx.wait();
    const updatedMessage = await contract.message();
    setMessage(updatedMessage);
    setNewMessage('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Onchain MessageBoard</h1>
      {!walletConnected ? (
        <button onClick={connectWallet} className="connect-wallet-btn">
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            <strong>Connected:</strong> {account}
          </p>
          <p>
            <strong>Current Message:</strong> {message}
          </p>

          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Write a new message..."
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button onClick={updateMessage}>Update Message</button>
          <br />
          <br />
          <button onClick={disconnectWallet} className="disconnect-wallet-btn">
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
}

export default App;
