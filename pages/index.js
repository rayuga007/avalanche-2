import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const formatDateTime = (date) => {
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
};

const HomePage = () => {
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [dateTime, setDateTime] = useState(formatDateTime(new Date()));
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

  const executeTransaction = async (transactionFunction, amount, type) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atm_abi.abi, signer);
    
    try {
      const transaction = await transactionFunction(contract, amount);
      await transaction.wait();
      setTransactionStatus(`${type} successful`);
      getBalance();
      updateTransactionHistory(type, amount);
    } catch (error) {
      setTransactionStatus(`${type} failed`);
    }
  };

  const deposit = async () => {
    await executeTransaction((contract, amount) => contract.deposit(amount, { value: amount }), inputA, "Deposit");
  };

  const withdraw = async () => {
    await executeTransaction((contract, amount) => contract.withdraw(amount), inputB, "Withdrawal");
  };

  const updateTransactionHistory = (type, amount) => {
    const newTransaction = {
      type,
      amount,
      ...formatDateTime(new Date()),
    };
    setTransactionHistory([newTransaction, ...transactionHistory]);
  };

  useEffect(() => {
    checkWallet();
    getBalance();

    // Update date and time every second
    const interval = setInterval(() => {
      setDateTime(formatDateTime(new Date()));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome Faiz</h1>
        <h2>Account Holder: Faizan Khan</h2>
      </header>
      {account ? (
        <div>
          <p>Account Balance: {balance} ETH </p>
          <p>Wallet Address: {account}</p>

          <div className="button-container">
            <input
              type="number"
              placeholder="Enter ETH to deposit"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
            />
            <button className="green-button" onClick={deposit}>
              Deposit ETH
            </button>
          </div>

          <div className="button-container">
            <input
              type="number"
              placeholder="Enter ETH to withdraw"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
            />
            <button className="blue-button" onClick={withdraw}>
              Withdraw ETH
            </button>
          </div>
        </div>
      ) : (
        <p>Please install Metamask to use this ATM.</p>
      )}

      <div>
        <p>Transaction Status: {transactionStatus}</p>
      </div>

      <div className="date-time-container">
        <h3>Date: {dateTime.date}</h3>
        <h3>Time: {dateTime.time}</h3>
      </div>

      <div>
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.amount} ETH</td>
                <td>{transaction.date}</td>
                <td>{transaction.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

        .green-button {
          background-color: #4CAF50; /* Green background */
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
        }

        .blue-button {
          background-color: #2196F3; /* Blue background */
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #ffffff; /* White border */
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #4CAF50; /* Green background for header */
          color: white;
        }

        .date-time-container {
          text-align: left;
        }
      `}</style>
    </main>
  );
};

export default HomePage;
