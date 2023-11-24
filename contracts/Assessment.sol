// SPDX-License-Identifier:: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public fundsHolder;
    uint256 public remainingBalance;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdraw(address indexed withdrawer, uint256 amount);
    event Burn(address indexed burner, uint256 burnedAmount);
    event Add(uint256 x, uint256 y, uint256 result);
    event Multiply(uint256 x, uint256 y, uint256 result);

    constructor(uint256 initialBalance) payable {
        fundsHolder = payable(msg.sender);
        remainingBalance = initialBalance;
    }

    function getRemainingBalance() public view returns (uint256) {
        return remainingBalance;
    }

    function deposit(uint256 depositAmount) public payable {
        require(msg.sender == fundsHolder, "You are not the holder of this account");
        remainingBalance += depositAmount;
        emit Deposit(msg.sender, depositAmount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawalAmount);

    function withdraw(uint256 withdrawalAmount) public {
        require(msg.sender == fundsHolder, "You are not the holder of this account");
        if (remainingBalance < withdrawalAmount) {
            revert InsufficientBalance({ balance: remainingBalance, withdrawalAmount: withdrawalAmount });
        }
        remainingBalance -= withdrawalAmount;
        emit Withdraw(msg.sender, withdrawalAmount);
    }

    function burn(uint256 burnAmount) public {
        require(msg.sender == fundsHolder, "You are not the holder of this account");
        require(remainingBalance >= burnAmount, "Insufficient funds for burning");
        remainingBalance -= burnAmount;
        emit Burn(msg.sender, burnAmount);
    }

    function add(uint256 x, uint256 y) public {
        uint256 result = x + y;
        emit Add(x, y, result);
    }

    function multiply(uint256 x, uint256 y) public {
        uint256 result = x * y;
        emit Multiply(x, y, result);
    }
}
