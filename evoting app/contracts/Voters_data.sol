// pragma solidity >=0.4.9 <0.6.0;

// contract Voters_data {
//     struct Voter {
//         uint id;
//         string votersname;
//         uint election_id;
//         uint age;
//         string gender;
//         string password;
//         string voters_address;
//         string adhar_number;
//     }

//     mapping (uint =>Voter) public Voters;

//     uint public voter_count;

//     function addVoter(string memory _name,uint _age,string memory _gender,
//     string memory _address,string memory _password,uint _electionid,string memory _adhar) public{
//         voter_count++;
//         Voters[voter_count] = Voter(voter_count,_name, _electionid, _age, _gender, _password, _address, _adhar);
//     }

//     constructor () public {
//         addVoter("vishwa",45, "M", "address", "password", 101, "qwertyuiop");
//     }
// }

pragma solidity ^0.5.0<=0.6.99;
contract Voters_data {
    // Model a Candidate
    struct Candidate {
        uint Id;
        string candidatename;
        string branch;
        string gender;
        string year;
        string email_id;
        string reg_id;
        uint vote_count;
    }
    struct Candidate_event{
        uint Id;
        string candidate_event;
    }
    struct users{
        uint voter_ID;
        string votername;
        string Regno;
        string Branch;
        string Year;
        string Emailid;
    }
    struct users_rem{
        uint voter_ID;
        bool has_voted;
        string publickey;
        string privatekey;
    }

    mapping (uint => users) Users;
    mapping (uint =>users_rem) Users_rem;

     uint public voters_count =0;

    
      

    function addVoter(string memory _votername, string memory _regno, string memory _voterbranch,
    string memory _voteryear,string memory _emailid, bool _hasvoted,string memory _pubkey,string memory _prikey) payable public {
          voters_count ++;
          Users[voters_count] = users(voters_count,_votername,_regno,_voterbranch,_voteryear,_emailid);
          Users_rem[voters_count] = users_rem(voters_count, _hasvoted,_pubkey,_prikey);
     }
//     function addValues() public {
           
//     }


    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    mapping (uint =>Candidate_event) public candidatesevent;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event votedEvent (
      uint indexed _candidateId
    );

   /* constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }*/

    function addCandidate (string memory _candidateName, string memory _candidateBranch, string memory _Gender, 
    string memory _candidateEmail, string memory _candidateYear, string memory _candidateReg_no) public {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_candidateName, _candidateBranch, 
	   _Gender,  _candidateYear,_candidateEmail, _candidateReg_no, 0);
        //candidatesevent[candidatesCount]= Candidate_event(candidatesCount,);
        }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].vote_count ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

   
}