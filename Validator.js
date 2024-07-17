// List of suspicious phrases or things that fake people use
const suspiciousPhrases = [
    "password",
    "credit card",
    "social security number",
    "click here",
    "verify your account",
    "update your information",
    "urgent",
    "immediate action",
    "text me $",
    "transfer funds",
    "bank details"
];

// List of commonly suspiciously used companies
const spoofedCompanies = [
    "Bank of America",
    "Paypal",
    "Amazon",
    "Apple",
    "Microsoft",
    "Google",
    "Facebook"
];

// Function to check grammar errors
function checkGrammar(emailText) {
    let nonAlphanumericChars = 0;
    let repeatedWords = 0;
    let misspelledWords = 0;
    const words = emailText.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word.match(/[a-zA-Z0-9]/)) {
            nonAlphanumericChars++;
        }
        if (i > 0 && words[i] === words[i - 1]) {
            repeatedWords++;
        }
        // Basic check for misspelled words (words with random characters)
        if (word.length > 1 && !word.match(/^[a-zA-Z]+$/)) {
            misspelledWords++;
        }
    }
    return { nonAlphanumericChars, repeatedWords, misspelledWords };
}

// Function to check if any suspicious phrases appear in the email
function checkSuspiciousPhrases(emailText) {
    const lowerCaseText = emailText.toLowerCase();
    for (const phrase of suspiciousPhrases) {
        if (lowerCaseText.includes(phrase)) {
            return true;
        }
    }
    return false;
}

// Function to check if any spoofed company names appear in the email
function checkCompanyNames(emailText) {
    const lowerCaseText = emailText.toLowerCase();
    for (const company of spoofedCompanies) {
        if (lowerCaseText.includes(company.toLowerCase())) {
            return true;
        }
    }
    return false;
}

// Function to validate the email based on various criteria
function validateEmail(emailText) {
    if (emailText.trim() === "") {
        return "No Risk (Empty Email)";
    }

    // Check grammar
    const { nonAlphanumericChars, repeatedWords, misspelledWords } = checkGrammar(emailText);
    let grammarScore = "Low";
    if (nonAlphanumericChars > 5 || repeatedWords > 1 || misspelledWords > 2) {
        grammarScore = "High";
    }

    // Check for suspicious phrases
    const containsSuspiciousPhrases = checkSuspiciousPhrases(emailText);
    let suspiciousScore = "Low";
    if (containsSuspiciousPhrases) {
        suspiciousScore = "High";
    }

    // Check company name
    const validCompany = checkCompanyNames(emailText);
    let companyScore = "High";
    if (validCompany) {
        companyScore = "Low";
    }

    // Calculate overall phishing score
    let phishingScore = 0;
    if (grammarScore === "High") {
        phishingScore += 1;
    }
    if (suspiciousScore === "High") {
        phishingScore += 2; // Increased weight for suspicious phrases
    }
    if (companyScore === "High") {
        phishingScore += 1;
    }

    // Determine phishing attempt level
    if (phishingScore >= 3) {
        return "High Phishing Attempt";
    } else if (phishingScore === 2) {
        return "Potential Phishing Attempt";
    } else if (phishingScore === 1) {
        return "Low Phishing Attempt";
    } else {
        return "No Risk";
    }
}

// Function to validate and display the result
function validateAndDisplayResult() {
    const emailText = document.getElementById('emailText').value;
    const result = validateEmail(emailText);
    document.getElementById('result').innerText = result;
}