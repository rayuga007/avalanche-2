import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function HomePage() {
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);

  const checkWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };

  const getBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, provider);
    const currentBalance = await contract.balance();
    setBalance(currentBalance.toNumber());
  };

  const deposit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, signer);
    try {
      const transaction = await contract.deposit(inputA, { value: inputA });
      await transaction.wait();
      setTransactionStatus("Deposit successful");
      getBalance();
      updateTransactionHistory("Deposit", inputA);
    } catch (error) {
      setTransactionStatus("Deposit failed");
    }
  };

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, signer);
    try {
      const transaction = await contract.withdraw(inputB);
      await transaction.wait();
      setTransactionStatus("Withdrawal successful");
      getBalance();
      updateTransactionHistory("Withdrawal", inputB);
    } catch (error) {
      setTransactionStatus("Withdrawal failed");
    }
  };

  const updateTransactionHistory = (type, amount) => {
    const newTransaction = {
      type,
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setTransactionHistory([newTransaction, ...transactionHistory]);
  };

  useEffect(() => {
    checkWallet();
    getBalance();

    // Update date and time every second
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentDate(date.toLocaleDateString());
      setCurrentTime(date.toLocaleTimeString());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Your Ethereum Wallet</h1>
        <h2>Account Owner: Faizan Khan</h2>
      </header>
      {account ? (
        <div>
          <p>Your Balance: {balance} ETH </p>
          <p>Wallet Address: {account}</p>

          <div className="button-container">
            <input
              type="number"
              placeholder="Enter ETH to deposit"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
            />
            <button onClick={deposit}>Deposit ETH</button>
          </div>

          <div className="button-container">
            <input
              type="number"
              placeholder="Enter ETH to withdraw"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
            />
            <button onClick={withdraw}>Withdraw ETH</button>
          </div>
        </div>
      ) : (
        <p>Please install Metamask to use this ATM.</p>
      )}

      <div>
        <p>Transaction Status: {transactionStatus}</p>
      </div>

      <div>
        <h3>Current Date: {currentDate}</h3>
        <h3>Current Time: {currentTime}</h3>
      </div>

      <div>
        <h3>Transaction History</h3>
        <ul>
          {transactionHistory.map((transaction, index) => (
            <li key={index}>
              {transaction.type} {transaction.amount} ETH - {transaction.date} {transaction.time}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          background-color: #ff0000; /* Red background */
          color: #ffffff; /* White text */
          padding: 20px;
        }

        .button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px;
        }

        input {
          margin-right: 10px;
        }

        button {
          padding: 10px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
