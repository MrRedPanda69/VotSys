// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Voting is Ownable {

    // Variables
    using Counters for Counters.Counter;
    struct Candidate {
        uint256 idCandidate;
        string firstName;
        string lastName;
        string party;
        uint256 votes;
    }
    Counters.Counter private counter;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    // Events
    event newCandidate(
        uint256 idCandidate,
        string firstName,
        string lastName,
        string party
    );

    event newVote(
        uint256 idCandidate,
        address voter
    );

    // Functions
    function addCandidate(
        string memory _firstName, 
        string memory _lastName, 
        string memory _party
    ) 
        onlyOwner
        public 
    {
        uint256 id = counter.current();
        candidates[id] = Candidate(id, _firstName, _lastName, _party, 0);
        emit newCandidate(id, _firstName, _lastName, _party);
    }

    function vote(uint256 _idCandidate) public {
        require(hasVoted[msg.sender] == false, "You can't vote more than once");
        candidates[_idCandidate].votes += 1;
        hasVoted[msg.sender] = true;
        emit newVote(_idCandidate, msg.sender);
    }

}