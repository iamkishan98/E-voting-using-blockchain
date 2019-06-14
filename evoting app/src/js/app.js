App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    key: {},

    // randomWords: require('../node_modules/random-words'),


    init: async function() {
        // console.log("ini
        this.key = new Set();
        return await App.initWeb3();
    },

    initWeb3: async function() {

        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fallback to Ganache.
            App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
            web3 = new Web3(App.web3Provider);
        }
        console.log("web3")
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("Candidate_data.json", function(candidate_json) {
            // console.log(candidate)
            App.contracts.Candidate_data = TruffleContract(candidate_json);
            App.contracts.Candidate_data.setProvider(App.web3Provider);
            return App.render();
        });
        // return App.bindEvents();
    },


    randomString: function() {
        var result;
        var length = 50;
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];

        // while (this.key.size < 10) {
        //     this.key.add(this.randomString());
        // }
        return result;
        // return this.key;
    },

    /*onVoterLogin : function(){
      voter_emailid = $('#email_id').val();
      voter_pass = $('#pass_word').val();
      App.contracts.Candidate_data.deployed().then(function(instance)=>{
        return instance.
      });
    },*/

    addViewResult: function() {
        var candidateInstance;
        candidateSelected = $('#candidatesSelect').val();
        voterId = $('#voterId_welcome').val();
        voterKey = $('#private_key').val();
        // console.log(voterKey);
        console.log(candidateSelected);
        App.contracts.Candidate_data.deployed().then(function(instance) {
            return instance.addVote(voterKey.toString(), candidateSelected.toString(), voterId, { from: App.account, value: 4000, gas: 6721975 });
            // return 
        }).then(function(result) {
            console.log("result ", result);
            console.log("result  number ", result.toString());
            if (result == true) {
                console.log("voted");
            } else if (result == "0,") {
                console.log("0");
            } else {
                console.log("Invalid");
            }
            window.location = "index.html";
        }).catch(function(err) {
            console.log(err);
        });
    },

    showCandidate: function() {
        var candidateInstance;

        App.contracts.Candidate_data.deployed().then(function(instance) {
            candidateInstance = instance;
            return candidateInstance.Candidate_count();
        }).then(function(Candidate_count) {
            var candidateOption;
            candidatesSelect = $('#candidatesSelect');
            for (var i = 0; i < Candidate_count; i++) {
                candidateInstance.Candidates(i).then(function(candidate) {
                    name = candidate[1];
                    id = candidate[6];
                    candidateOption = "<option value='" + id + "' >" + name + " | " + id + "</option> ";
                    candidatesSelect.append(candidateOption);
                    document.getElementById("load_Button").disabled = true;
                });
            }
            console.log(candidateOption);
            return candidateInstance.Candidate_list(App.account);
        }).then(function(hasVoted) {
            // if (hasVoted) {
            //     $('form').hide();
            // }
            // loader.hide();
            // content.show();
        }).catch(function(err) {
            console.log(err);
        });
    },

    render: function() {
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });
    },

    onAdminLogin: function() {
        adminmail = $('#adminemail').val();
        adminpass = $('#adminpassword').val();

        App.contracts.Candidate_data.deployed().then((instance) => {
            return instance.adminLogin.call(adminmail.toString(), adminpass.toString(), { from: App.account, value: 2000, gas: 6721975 });
        }).then(function(result) {
            if (result == 1) {
                console.log("Admin logged in");
                window.location = "../CandidReg.html";
            } else if (result == 11) {
                window.location = "../voterlogged.html";
            } else {
                console.log("Invalid login details");
            }
        }).catch(function(err) {
            console.log(err);
        });
    },


    Displayresult: function() {
        var electionInstance;
        var loader = $("#loader");
        var content = $("#content");


        // Load the contract
        App.contracts.Candidate_data.deployed().then((instance) => {
            electionInstance = instance;
            return electionInstance.Candidate_count();

        }).then((candidatescount) => {

            var candidateresults = $("#candidatesResults");
            candidateresults.empty();

            var candidateselect = $("#candidatesSelect");
            candidateselect.empty();

            for (var i = 1; i <= candidatescount; i++) {
                electionInstance.Candidates(i).then((candidate) => {
                    var id = candidate[0];
                    var name = candidate[1];
                    var votecount = candidate[7];
                    var candidateTemplate = "<tr><th>" + Id + "</th><td>" + name + "</td><td>" + votecount + "</td></tr>"
                    candidatesResults.append(candidateTemplate);

                    // Render candidate ballot option
                    var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
                    candidateselect.append(candidateOption);
                });
            }

            return electionInstance.voters(App.account);

        }).then((hasVoted) => {

            if (hasVoted) {
                $('form').hide();
            }
            //loader.hide();
            content.show();
        }).catch((error) => {
            console.warn(error);
        });

    },

    onCandidateLogin: function() {
        // alert("hey");

        if ($('#candidateGender1')[0].checked == true)
        // console.log($('#candidateGender1')[0].value);
            candidateGender = $('#candidateGender1')[0].value;
        else if ($('#candidateGender2')[0].checked == true)
            candidateGender = $('#candidateGender2')[0].value;

        candidateEmail = $('#candidateEmail').val();
        candidateName = $('#candidateName').val();
        candidateReg_no = $('#candidateReg_no').val();
        candidateYear = $('#candidateYear')[0].value;
        candidateBranch = $('#candidateBranch')[0].value;
        candidateEvent = $('#candidateEvent')[0].value;

        console.log(candidateName + ' ' + candidateReg_no + ' ' + candidateBranch + ' ' + candidateYear + ' ' + candidateEmail + ' ' + candidateGender + ' ' + candidateEvent);
        // console.log(this.candidate_user);
        App.contracts.Candidate_data.deployed().then(function(instance) {
            return instance.addCandidate(candidateName, candidateBranch, candidateGender, candidateEmail, candidateYear, candidateReg_no, candidateEvent, { from: App.account, value: 2000, gas: 6721975 });
        }).then(function(result) {
            // Wait for votes to update

            console.log('pass');
            alert("Candidate Registered successfully");
            // window.location = "index.html";
        }).catch(function(err) {
            console.log(err);
        });
    },

    onVoterReg: function() {
        voterName = $('#voter_name').val();
        voteReg = $('#voter_reg').val();
        voter_branch = $('#voterbranch')[0].value;
        voteryear = $('#voteryear')[0].value;
        voter_email = $('#voter_email')[0].value;
        voter_pass = $('#voter_pass')[0].value;
        console.log(voterName + ' ' + voteReg + ' ' + voter_branch + ' ' + voter_email + ' ' + voteryear + ' ' + voter_pass);
        voter_key = this.randomString();
        console.log(voter_key);
        App.contracts.Candidate_data.deployed().then(function(instance) { //voter_key.toString()
            return instance.addVoter(false, voterName, voteReg, voter_branch, voteryear, voter_email, voter_key.toString(), voter_pass.toString(), { from: App.account, value: 2000, gas: 6721975 });
        }).then(function(result) {
            message = "This is your key : " + voter_key;
            data = {
                service_id: "mailjet",
                template_id: "template_uzbxjNzS",
                user_id: "user_UPFGXweoJeKEn0ReUbo4W",
                template_params: {
                    to: voter_email,
                    subject: "E-voting Key",
                    message_html: message,
                }
            };
            $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function() {
                alert('Your mail is sent!');
                // window.location = "voterlogged.html";
            }).fail(function(error) {
                console.log('Oops... ' + JSON.stringify(error));
            });
            console.log('pass');
            alert("Voter Registered successfully");
            window.location = "voterlogged.html";
        }).catch(function(err) {
            console.log(err);
        });
    },

    getResultPie: function() {
        var electionInstance;

        // var result, name, count;
        App.contracts.Candidate_data.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.Candidate_count();
        }).then(function(candidatesCount) {
            candidatesResults = $('#candidatesResults')
            for (var i = 0; i < candidatesCount; i++) {
                electionInstance.Candidates(i).then(function(candidate) {
                    var id = candidate[6];
                    var name = candidate[1];
                    var voteCount = candidate[7];

                    // Render candidate Result
                    var candidateTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                    candidatesResults.append(candidateTemplate);

                });
            }
            document.getElementById("display_result").disabled = true;

            return candidateInstance.Candidate_list(App.account);

        }).then(function(hasVoted) {
            // if (hasVoted) {
            //     $('form').hide();
            // }
            // loader.hide();
            // content.show();
        }).catch(function(err) {
            console.log(err);
        });

    },

    onCastVote: function() {
        var candidateId = $('#candidatesSelect').val();
        App.contracts.Candidate_data.deployed().then(function(instance) {
            return instance.Vote(candidateId, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            console.log("Test passed");
            $("#content").show();
            //$("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });
        window.location = "index.html";

    },

    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

};

App.init();