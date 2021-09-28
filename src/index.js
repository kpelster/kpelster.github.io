var emailDomains; 

document.addEventListener("DOMContentLoaded", function() {
    callDomains();
  });

function validate(){
    var invalid = false;

    // if all are valid inputs
    if(!(validatePhone() 
        & validateNames() 
        & validateEmail() 
        & validateMessage())){
            // submit form
    }
}

function validatePhone(){
    var invalid = false;
    document.getElementById("user_phone").style.border = "1px solid black";

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

}

function validateNames(){
    var invalid = false;
    document.getElementById("user_fname").style.border = "1px solid black";
    document.getElementById("user_lname").style.border = "1px solid black";

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

function validateEmail(){
    callDomains();
    var invalid = false;
    document.getElementById("user_email").style.border = "1px solid black";

    var email = document.getElementById("user_email").value

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

}

function validateMessage(){
    var invalid = false;
    document.getElementById("user_message").style.border = "1px solid black";

    if(document.getElementById("user_message").value == ""){
        invalid = true;
        document.getElementById("user_message").style.border = "1px solid red";
        document.getElementById("user_message").placeholder = "Required";
    }

}

function callDomains(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://data.iana.org/TLD/tlds-alpha-by-domain.txt");
    oReq.send();
}

function reqListener(){
    emailDomains = this.responseText.split("\n");
    
}

function compareDomain(domain){
    var found = false;
    for(i=1; i<emailDomains.length; i++){
        // console.log(emailDomains[i]);
        if(domain == emailDomains[i]){
            console.log("Found!", emailDomains[i], i);
            found = true;
            break;
        }
    }
    return found;
}