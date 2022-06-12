// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address public currentWinner;
    address[] public tickets;
    address[] public allTimeWinners;
    mapping(address => uint) public user_ticket_pair;
    uint ticket_price = 0.002 ether;
    uint player_count = 0;

    constructor() {
        manager = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
        }

    function buyTicket() public payable {
        require(msg.value == ticket_price);

        if(user_ticket_pair[msg.sender] != 0)
        {
            tickets.push(msg.sender);
            user_ticket_pair[msg.sender]++;
        }
        else
        {
            tickets.push(msg.sender);
            user_ticket_pair[msg.sender] = 1;
            player_count++;
        }
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, tickets)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 index = random() % tickets.length;
        currentWinner = tickets[index];
        allTimeWinners.push(currentWinner);

        for(uint i = 0; i < tickets.length; i++)
        {
            user_ticket_pair[tickets[i]] = 0;
        }

        tickets = new address [](0);
        player_count = 0;
    }

    function isWinner(address user) public view returns (uint){

        if(currentWinner != address(0x0))
        {
            if(user == currentWinner)
            {
                return 2;
            }
            else{
                return 1;
            }
        }
        else
        {
            return 0;
        }
    }

    function claimPrize(address user) public {
        if(currentWinner == user)
        { 
            payable(currentWinner).transfer(address(this).balance);
            currentWinner = address(0x0);
        }
    }

    function getWinCount(address user) public view returns (uint) {
        uint count = 0;

        for(uint i = 0; i < allTimeWinners.length; i++)
        {
            if(allTimeWinners[i] == user)
            {
                count++;
            }
        }

        return count;
    }

    function getTicketCount() public view returns (uint) {
        return tickets.length;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayerCount() public view returns (uint) {
        return player_count;
    }

    function getTicketPrice() public view returns (uint) {
        return ticket_price;
    }

    function setTicketPrice(uint new_price) public {
        ticket_price = new_price;
    }
}
