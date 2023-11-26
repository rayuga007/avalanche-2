# Assessment Smart Contract and React App

This repository contains a simple Ethereum smart contract and a React application that interacts with the contract. The smart contract, written in Solidity, manages a basic financial assessment system, allowing deposits, withdrawals, and transactions. The React app serves as a user interface to interact with the smart contract.

## Smart Contract

### Assessment.sol

#### Contract Overview
- The smart contract is named `Assessment`.
- It includes functionalities for depositing, withdrawing, burning funds, and performing basic arithmetic operations (addition and multiplication).
- The contract has an initial balance, and the owner of the contract is the `fundsHolder`.

#### Functions
1. **`deposit(uint256 depositAmount)`**
   - Allows the `fundsHolder` to deposit funds into the contract.

2. **`withdraw(uint256 withdrawalAmount)`**
   - Allows the `fundsHolder` to withdraw funds from the contract.

3. **`burn(uint256 burnAmount)`**
   - Allows the `fundsHolder` to burn (remove) funds from the contract.

4. **`add(uint256 x, uint256 y)`**
   - Performs addition and emits an `Add` event.

5. **`multiply(uint256 x, uint256 y)`**
   - Performs multiplication and emits a `Multiply` event.

#### Events
- The contract emits the following events:
   - `Deposit`: Triggered on a successful deposit.
   - `Withdraw`: Triggered on a successful withdrawal.
   - `Burn`: Triggered when funds are burned.
   - `Add`: Triggered after the addition operation.
   - `Multiply`: Triggered after the multiplication operation.

#### Error
- An `InsufficientBalance` error is defined to handle cases where a withdrawal exceeds the available balance.

#### Constructor
- The constructor initializes the contract with an initial balance and sets the `fundsHolder` to the deployer of the contract.

## React App

### HomePage.js

#### Overview
- The React app provides a simple user interface to interact with the smart contract.
- It displays the account balance, wallet address, allows deposits and withdrawals, and shows transaction history.

#### Functions
1. **`checkWallet`**
   - Checks if MetaMask is installed and retrieves the connected account.

2. **`getBalance`**
   - Retrieves the current balance from the smart contract.

3. **`executeTransaction`**
   - Executes a transaction (deposit or withdrawal) and updates the UI and transaction history.

4. **`deposit`**
   - Calls `executeTransaction` for depositing funds.

5. **`withdraw`**
   - Calls `executeTransaction` for withdrawing funds.

6. **`updateTransactionHistory`**
   - Updates the transaction history with the latest transaction.

#### useEffect
- Initializes the app by checking the wallet and retrieving the initial balance. Updates date and time every second.

#### UI Components
- Displays account information, input fields for deposit/withdrawal, buttons for actions, transaction status, date and time, and transaction history.

### Note
- MetaMask is required to interact with the smart contract.

Feel free to explore and enhance this project!

## Author
faizan khan

rehan786khan2011@gmail.com

