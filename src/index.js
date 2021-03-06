/**
 * Kara Pelster
 * CISC474
 * Personal Webpage 3
 * index.js
 **/

// global variable to store list of email domains
var emailDomains;
var linksopen = false;

window.onload = function () {

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-8MW5T55LCS');

    emailjs.init("user_j39dx3RjcjMv4ltxbuxv2");

    // make call to domains url
    callDomains();

    // event listener for submit button
    try {
        document.getElementById('form-content').addEventListener('submit', function (event) {

            event.preventDefault();

            // if validate == true
            if (validate()) {
                // send form if valid
                emailjs.sendForm('service_ujmgezw', 'template_fr77iso', this)
                    .then(function () {

                        console.log('SUCCESS!');
                        alert("Message Sent!");

                    }, function (error) {

                        console.log('FAILED...', error);

                    });
                // reset form
                document.getElementById('form-content').reset();
                document.getElementById("email-error").style.display = "none";
                document.getElementById("phone-error").style.display = "none";
            }
        });
    }
    catch {

    }

    /**
     * method to open/close portfolio slide divs
     */
    $(".portfolio-click-bar").on("click", function () {

        // selects next child in parent div
        $($(this)[0].parentElement.children[1]).slideToggle();
    })

    /**
     * method to open/close class links
     */
    $(".class-links").on("click mouseenter mouseleave", function (e) {

        if (($(".links-div").css("display") == "none" && e.type != "mouseleave") || e.type == "mouseenter") {
            $(".links-div").show();
        }
        else {
            $(".links-div").hide();
        }
    });

    /**
     * method to validate form input
     * @returns bool
     */
    function validate() {
        invalid = validatePhone() & validateNames() & validateEmail() & validateMessage();
        return invalid;
    }

    /**
     * method to validate phone input
     * @returns bool
     */
    function validatePhone() {
        var valid = true;
        var validFormat = true;
        // removed red border and set error message display to none
        document.getElementById("user_phone").style.border = "0px";
        document.getElementById("phone-error").style.display = "none";

        var numberEntry = document.getElementById("user_phone").value;
        if (numberEntry == "") {
            valid = false;
        }

        else {
            numberEntry = numberEntry.split("-");
            console.log(numberEntry.length);
            if (numberEntry.length != 3
                || numberEntry[0].length != 3
                || numberEntry[1].length != 3
                || numberEntry[2].length != 4) {
                valid = false;
                validFormat = false;
            }

        }

        if (!valid) {
            document.getElementById("user_phone").style.border = "1px solid red";
            document.getElementById("user_phone").placeholder = "Required (XXX-XXX-XXXX)";
        }

        if (!validFormat) {
            document.getElementById("phone-error").style.display = "inline-block";
        }

        return valid;

    }

    /**
     * method to validate first name and last name
     * @returns bool
     */
    function validateNames() {
        var valid = true;
        document.getElementById("user_fname").style.border = "0px";
        document.getElementById("user_lname").style.border = "0px";

        if (document.getElementById("user_fname").value == "") {
            valid = false;
            document.getElementById("user_fname").style.border = "1px solid red";
            document.getElementById("user_fname").placeholder = "Required";
        }
        if (document.getElementById("user_lname").value == "") {
            valid = false;
            document.getElementById("user_lname").style.border = "1px solid red";
            document.getElementById("user_lname").placeholder = "Required";
        }

        console.log("names", valid);
        return valid;
    }

    /**
     * method to validate email
     * @returns bool
     */
    function validateEmail() {
        // get domains from url
        callDomains();

        var valid = true;
        var validEmail = true;

        // automatically remove border and error messgae if exists
        document.getElementById("user_email").style.border = "0px";
        document.getElementById("email-error").style.display = "none";

        var email = document.getElementById("user_email").value;

        if (email == "") {
            // if email is blank, make border red and set placeholder "Required"
            document.getElementById("user_email").style.border = "1px solid red";
            document.getElementById("user_email").placeholder = "Required";
            return false;
        }

        // make 'xx@yy.zz to [xx, yy.zz]
        try {
            email = email.split("@");

            console.log(email);

            if (email.length > 2 || checkSpecialChars(email[0]) || checkSpecialChars(email[1])) {
                valid = false;
                validEmail = false;
            }

            else {
                domains = email[1];
                //  make yy.zz to [yy, zz]
                domains = domains.split(".");

                domain = domains[0].toUpperCase();
                tpDomain = domains[1].toUpperCase();

                foundDomain = compareDomain(domain);
                foundTPDomain = compareDomain(tpDomain);

                console.log(domain, tpDomain);

                if (!(foundDomain || foundTPDomain)) {
                    valid = false;
                    validEmail = false;

                }
            }
        }

        catch {
            valid = false;
            validEmail = false;
        }

        if (!validEmail & email != "") {
            document.getElementById("email-error").style.display = "inline-block";
        }

        if (!valid) {
            document.getElementById("user_email").style.border = "1px solid red";
        }
        return valid;
    }

    /**
     * method to validate message
     * @returns bool
     */
    function validateMessage() {
        var valid = true;
        document.getElementById("user-message").style.border = "0px";

        if (document.getElementById("user-message").value == "") {
            valid = false;
            document.getElementById("user-message").style.border = "1px solid red";
            document.getElementById("user-message").placeholder = "Required";
        }
        console.log("message", valid);
        return valid;
    }

    /**
     * method that makes call to url that contains email domains
     * uses event listener to make call to reqListener
     */
    function callDomains() {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", "https://data.iana.org/TLD/tlds-alpha-by-domain.txt");
        oReq.send();
    }

    /**
     * method that sets emailDomains list equal to domains from url called in callDomains
     */
    function reqListener() {
        emailDomains = this.responseText.split("\n");
    }

    /**
     * method that compares current domain to list of domains
     * @param {*} domain 
     * @returns 
     */
    function compareDomain(domain) {
        var found = false;
        if (emailDomains.includes(domain)) {
            found = true;
            console.log("Found!");
        }

        return found;
    }

    /**
     * method to check if a string has special characters
     * @param {string} string 
     * @returns bool 
     */
    function checkSpecialChars(string) {
        if (/^[a-zA-Z0-9-. ]*$/.test(string) == false) {
            return true;
        }
        return false;
    }
}


