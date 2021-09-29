// global variable to store list of email domains
var emailDomains; 

window.onload = function() {

    // make call to domains url
    callDomains();

    // event listener for submit button
    document.getElementById('form-content').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if(!validate()){
            emailjs.sendForm('service_ujmgezw', 'template_fr77iso', this)
                .then(function() {
                    console.log('SUCCESS!');
                    alert("Message Sent");
                    clearForm();
                }, function(error) {
                    console.log('FAILED...', error);
                });
        }
        
    });
}

/**
 * method to validate form input
 * @returns bool
 */
function validate(){
    var invalid = true;

    // if all are valid inputs
    if((validatePhone() 
        & validateNames() 
        & validateEmail() 
        & validateMessage())){
            invalid = true;
        }
    return invalid;
}

/**
 * method to validate phone input
 * @returns bool
 */
function validatePhone(){
    var invalid = false;
    document.getElementById("user_phone").style.border = "0px";

    var numberEntry = document.getElementById("user_phone").value;
    if(numberEntry == "" || !numberEntry.includes("-")){
        invalid = true;
    }

    else{
        numberEntry = numberEntry.split("-");
        if(numberEntry.length != 3
            || numberEntry[0].length !=3 
            || numberEntry[1].length !=3
            || numberEntry[2].length !=4){
                invalid = true;
                document.getElementById("phone-error").value = "Invalid Format";
            }
        
    }

    if(invalid){
        document.getElementById("user_phone").style.border = "1px solid red";
        document.getElementById("user_phone").placeholder = "Required";
    }

    return invalid;

}

/**
 * method to validate first name and last name
 * @returns bool
 */
function validateNames(){
    var invalid = false;
    document.getElementById("user_fname").style.border = "0px";
    document.getElementById("user_lname").style.border = "0px";

    if(document.getElementById("user_fname").value == ""){
        invalid = true;
        document.getElementById("user_fname").style.border = "1px solid red";
        document.getElementById("user_fname").placeholder = "Required";
    }
    if(document.getElementById("user_lname").value == ""){
        invalid = true;
        document.getElementById("user_lname").style.border = "1px solid red";
        document.getElementById("user_lname").placeholder = "Required";
    }
    
    return invalid;
}

/**
 * method to validate email
 * @returns bool
 */
function validateEmail(){
    // get domains from url
    callDomains();

    var invalid = false;
    // automatically remove border if exists
    document.getElementById("user_email").style.border = "0px";

    var email = document.getElementById("user_email").value;

    if(email == ""){
        invalid = true;  
    }

    // make 'xx@yy.zz to [xx, yy.zz]
    try{
        email = email.split("@");
        domains = email[1];
        //  make yy.zz to [yy, zz]
        domains = domains.split(".");

        domain = domains[0].toUpperCase();
        tpDomain = domains[1].toUpperCase();

        foundDomain = compareDomain(domain);
        foundTPDomain = compareDomain(tpDomain);

        console.log(domain, tpDomain);

        if(!(foundDomain || foundTPDomain)){
            invalid = true;
        }
    }
    catch{
        invalid = true;
    }

    if(invalid){
        document.getElementById("user_email").style.border = "1px solid red";
        document.getElementById("user_email").placeholder = "Required";
    }

    return invalid;
}

/**
 * method to validate message
 * @returns bool
 */
function validateMessage(){
    var invalid = false;
    document.getElementById("user_message").style.border = "0px";

    if(document.getElementById("user_message").value == ""){
        invalid = true;
        document.getElementById("user_message").style.border = "1px solid red";
        document.getElementById("user_message").placeholder = "Required";
    }
    return invalid;
}

/**
 * method that makes call to url that contains email domains
 * uses event listener to make call to reqListener
 */
function callDomains(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://data.iana.org/TLD/tlds-alpha-by-domain.txt");
    oReq.send();
}

/**
 * method that sets emailDomains list equal to domains from url called in callDomains
 */
function reqListener(){
    emailDomains = this.responseText.split("\n");
}

/**
 * method that compares current domain to list of domains
 * @param {*} domain 
 * @returns 
 */
function compareDomain(domain){
    var found = false;
    if(emailDomains.includes(domain)){
        found = true;
        console.log("Found!");
    }

    return found;
}

function clearForm(){
    document.getElementById("user_fname").value == "";
    document.getElementById("user_lname").value == "";
    document.getElementById("user_email").value == "";
    document.getElementById("user_phone").value == "";
    document.getElementById("user_message").value == "";
}