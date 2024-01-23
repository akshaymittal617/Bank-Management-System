const readline = require("readline");
const prompt = require("prompt-sync")();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isLoanGiven = false;
let loanAmount = 0;
let interestRate = 0;
let tenure = 0;
let user = {
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
  balance: 0,
  loanType: "",
};
const nameRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const addressRegex = /^.{5,}$/;

function deposit(balance, amount) {
  return balance + amount;
}

function withdraw(balance, amount) {
  if (balance >= amount) {
    return balance - amount;
  } else {
    return "Insufficient funds. Cannot withdraw.";
  }
}

let totalPayments;
let emi;
let loanType;

function calculateEMI(loanAmount, interestRate, tenure) {
  const monthlyInterestRate = interestRate / 100 / 12;
  totalPayments = tenure * 12;
  emi =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    

  return emi.toFixed(2);

}

function payEMI() 
{
    if (isLoanGiven) {
      console.log(`Total EMIs: ${totalPayments}`);
      console.log(`Type of Loan: ${loanType}`);
      console.log(`EMI amount: $${emi}`);
      
       let paidEMI= emi;
  
      if (!isNaN(paidEMI) && paidEMI > 0 && paidEMI <= emi) {
        user.balance -= paidEMI;
        console.log(`EMI Paid: $${paidEMI.toFixed(2)}`);
        totalPayments--;
        console.log(`Remaining EMIs: ${totalPayments}`);
      } else {
        console.log("Invalid EMI amount. Please enter a valid amount.");
      }
    } else {
      console.log("You need to take a loan first before paying EMIs.");
    }
    console.log("Updated Balance: ", user.balance );
  }
  

function displayMenu() {
  console.log("\n1. Enter user details");
  console.log("2. Deposit");
  console.log("3. Withdraw");
  console.log("4. Loan");
  console.log("5. PayEMI");
  console.log("6. Show balance");
  console.log("7. Exit");
}

function getUserInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function startBankingSystem() {
  while (true) {
    displayMenu();
    const option = await getUserInput("Enter the service you want to get: ");

    switch (parseInt(option)) {
      case 1:
        let fullName;
        let phoneNumber;
        let email;
        let address;
        while (true) {
          fullName = await getUserInput("Enter full name: ");
          if (!nameRegex.test(fullName)) {
            prompt("Invalid name! \n Please enter a valid full name.");
            continue;
          }
          break;
        }
        while (true) {
          phoneNumber = await getUserInput("Enter phone number: ");
          if (!phoneRegex.test(phoneNumber)) {
            prompt("Invalid Phone Number! \n Enter the phone number again: ");
            continue;
          }
          break;
        }
        while (true) {
          email = await getUserInput("Enter email: ");
          if (!emailRegex.test(email)) {
            prompt("Invalid mail id! \n Enter the Mail id again: ");
            continue;
          }
          break;
        }
        while (true) {
          address = await getUserInput("Enter address: ");
          if (!addressRegex.test(address)) {
            continue;
          }
          break;
        }

        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.email = email;
        user.address = address;
        console.log("User details entered successfully!");

      case 2:
        const depositAmount = parseFloat(
          await getUserInput("Enter deposit amount: ")
        );
        user.balance = deposit(user.balance, depositAmount);
        console.log(
          `Deposit successful. Updated balance: $${user.balance.toFixed(2)}`
        );
        break;

      case 3:
        const withdrawAmount = parseFloat(
          await getUserInput("Enter withdrawal amount: ")
        );
        const withdrawalResult = withdraw(user.balance, withdrawAmount);

        if (typeof withdrawalResult === "number") {
          user.balance = withdrawalResult;
          console.log(
            `Withdrawal successful. Updated balance: $${user.balance.toFixed()}`
          );
        } else {
          console.log(withdrawalResult);
        }
        break;

      case 4:
        console.log(`
        1. Education Loan
        2. Home Loan
        3. Car Loan
        `);
        loanType = await getUserInput(" Enter the type of loan: ");
        switch (loanType) {
          case "1":
            console.log(" You have chosen Education Loan");
            break;
          case "2":
            console.log(" You have chosen Home Loan");
            break;
          case "3":
            console.log(" You have chosen Car Loan");
            break;

          default:
            console.log(" Invalid Loan Type chosen! Choose again");
            continue;
        }
        if (isLoanGiven) {
          console.log("You have already given loan! ");
        }
        loanAmount = parseFloat(await getUserInput("Enter loan amount: "));
        interestRate = parseFloat(
          await getUserInput("Enter annual interest rate (%): ")
        );
        tenure = parseInt(await getUserInput("Enter loan tenure (in years): "));
        const emiResult = calculateEMI(loanAmount, interestRate, tenure);
        console.log(`Monthly EMI: $${emiResult}`);
        isLoanGiven = true;
        console.log("Type of Loan: ", loanType);
        user.balance += loanAmount;
        console.log(`Current Balance: $${user.balance.toFixed(2)}`);

        break;

      case 5:
        payEMI();
        continue;
        

      case 6:
        console.log(`Current balance: $${user.balance.toFixed(2)}`);
        break;

      case 7:
        console.log("Exiting Banking System. Thank you!");
        rl.close();
        process.exit(0);
        break;

      default:
        console.log("Invalid option. Please choose a valid option.");
    }
  }
}

startBankingSystem();
