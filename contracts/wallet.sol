// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

//Contract Initiation
contract Wallet {
    //Struct containing transfer details.
    address[] public approvers;
    uint public quorum;
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    //Creating a transfer variable using the struct
    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) approvals;
    
    // Constructor with the list of approver addresses and required number of approvals
    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }
    
    // Modifier for permission, attached to functions that require permission.
    modifier onlyApprover() {
        bool allowed = false;
        for (uint i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, "Only Approvers allowed!");
        _;
    }
    
    // Getter function for list of approvers. 
    function getApprovers () external view returns(address[] memory) {
        return approvers;
    }
    
    // Getter function for transfers.
    function getTransfers () external view returns(Transfer[] memory) {
        return transfers;
    }
    
    // Set function to create a transfer
    function createTransfer (uint _amount, address payable _to) external onlyApprover(){
        transfers.push(Transfer(
                transfers.length,
                _amount,
                _to,
                0,
                false
            ));
    }
    
    // Set function used by approver to change the state of a pending transfer.
    function approveTransfer (uint  _id) external onlyApprover(){
        require(transfers[_id].sent == false, "Transfer already sent!");
        require(approvals[msg.sender][_id] == false, "Cannot approve transfer twice!");
        
        approvals[msg.sender][_id] = true;
        transfers[_id].approvals++;
        
        if (transfers[_id].approvals >= quorum) {
            transfers[_id].sent = true;
            address payable to = transfers[_id].to;
            uint amount = transfers[_id].amount;
            to.transfer(amount);
        }
    }
    
    // Receiver function to receive transfer into the smart contract.
    receive() payable external {}
}