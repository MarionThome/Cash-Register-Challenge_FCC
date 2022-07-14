function checkCashRegister(price, cash, cid) {
    const moneyValue = [
        ['PENNY', 0.01], 
        ['NIKEL', 0.05],
        ['DIME', 0.1],
        ['QUARTER',0.25],
        ['ONE', 1],
        ['FIVE',5],
        ['TEN',10],
        ['TWENTY',20],
        ['ONE HUNDRED',100],
    ]

    // Create deepCopy of cid
    const deepCopy = (arr) => {
        let copy = [];
        arr.forEach(elem => {
            if(Array.isArray(elem)){
                copy.push(deepCopy(elem))
            }
            else{
                copy.push(elem)
            }
        })
        return copy;
    }
    const originalCid = deepCopy(cid);

    let cidWithValue = [...cid].reverse();
    let registerStatus = {
        status : "",
        change : []
    };
    let changeDue = cash - price; // what you have to give back
    let cashInRegister = 0; 

    moneyValue.reverse()

    // add money value to the cidValue array
    for(let i = 0; i < cidWithValue.length ; i++){    
        cidWithValue[i].push(moneyValue[i][1]);
        cashInRegister += cidWithValue[i][1];
    }

    let operationResult = registerOperation(changeDue, cidWithValue, cashInRegister, originalCid.reverse()); 

    // Conditions that will compare change due and cash available after the register operation
    if(operationResult.changeDueAfterUpdate === 0 && operationResult.cashInRegisterAfterUpdate === 0){
        registerStatus.status = "CLOSED";
        registerStatus.change = originalCid.reverse();
    }
    else if (operationResult.changeDueAfterUpdate > 0){
        registerStatus.status = "INSUFFICIENT_FUNDS";
    }
    else {
        registerStatus.status = "OPEN";
        registerStatus.change = operationResult.coinsAndBillsAfterUpdate; 
    } 

return registerStatus;
}


function registerOperation(changeDue, cidWithValue, cashInRegister, originalCid){
    let cashBills =[]; // will store the coins and bill that were given as change

    for(let i = 0; i < cidWithValue.length ; i++){
        if(changeDue >= cidWithValue[i][2] && cidWithValue[i][1] > 0) {
            do {
                changeDue = (Math.round(changeDue * 1e2) / 1e2) - (Math.round(cidWithValue[i][2] * 1e2) / 1e2) // substract the change given to the change that is still due
                cidWithValue[i][1] = (Math.round(cidWithValue[i][1] * 1e2) / 1e2) - (Math.round(cidWithValue[i][2] * 1e2) / 1e2) // update the available change 
                cashInRegister = (Math.round(cashInRegister * 1e2) / 1e2) - (Math.round(cidWithValue[i][2] * 1e2) / 1e2) // update the cash in register available 
            } while (cidWithValue[i][1] > 0 && changeDue > 0 && changeDue >= cidWithValue[i][2])

            cashBills.push([cidWithValue[i][0], parseFloat((originalCid[i][1] - cidWithValue[i][1]).toFixed(2))]) // push money name and amount given for each one
        }
    }  
    return {
        changeDueAfterUpdate :  Math.round(changeDue * 1e2) / 1e2, 
        cashInRegisterAfterUpdate: cashInRegister,
        coinsAndBillsAfterUpdate : cashBills,
    }
}

checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])