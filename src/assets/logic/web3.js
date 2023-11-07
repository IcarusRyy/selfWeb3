"use strict";
import Web3 from './contract/web3.js';

export let web3 = null;
export let networkId ='';
export let ContractABI = '';
export let ContractAddress = '';

export const ContractSelfWeb3 = "SelfWeb3";
const contracts = {
    "SelfWeb3": {
        '5': '0xcE25460c82A2dE7D4bBEd1fA98C4a3f27f6362df',
        '1': '0x6AB8c33715F6F4f18bF605F63F0e7b235eeC1027',
        '421613': '0x7B6E05a55B1756f827F205BF454BF75288904ecF'
    }
}
export function SetContract(name) {
    // console.log(selfWeb3ABI)
    ContractAddress = contracts[name][networkId];
    if (name === ContractSelfWeb3) {
        fetch('/ABI/SelfWeb3.json').then(response => {
            return response.json();
        }).then(data => {
            ContractABI = data;
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });
    }
}

/*
example:
    Web3Init(this.ShowMsg, web3Provider);
*/
export async function Init(contractName, provider) {
    const vweb3 = new Web3(provider);
    const vnetworkId = await vweb3.eth.net.getId();
    console.log('wallet connect callback: ', vnetworkId, vweb3, provider);
    if (contracts[contractName][vnetworkId] === undefined) {
        // if (failed !== null && failed !== undefined) failed('Unsupport network, currently supported chainId list: ' + Object.keys(contracts[contractName]));
        return 'Unsupport network, currently supported chainId list: ' + Object.keys(contracts[contractName]);
    }
    web3 = vweb3;
    networkId = vnetworkId;
    SetContract(contractName);
    return '';
}

export function UnInit() {
    web3 = null;
    networkId = '';
}

/*
example:
    var loadParams = [];
    loadParams.push(Web3.utils.asciiToHex(selfID));
    loadParams.push(sig);
    loadParams.push(Web3.utils.asciiToHex(message));
    Execute("call", "Load", self.walletAddress, 0, loadParams, function (loadResult) {
        console.log('web3 contract Load callback: ', loadResult);
    }, function (err) {
        console.log('web3 contract Load failed: ', err);
    });
*/
export async function Execute(executeFunc, methodName, walletAddress, msgValue, params, callback, failed) {
    console.log(ContractAddress, ContractABI, executeFunc, methodName, walletAddress, msgValue, params);
    const myContract = new web3.eth.Contract(ContractABI, ContractAddress);
    let web3Func = myContract.methods[methodName];

    let sendObject = {};
    if (params.length === 0) {
        sendObject = web3Func();
    } else {
        sendObject = web3Func(...params);
    }
    if (msgValue !== undefined && msgValue > 0) msgValue = Web3.utils.toNumber(Web3.utils.toWei(msgValue + '', 'ether'));

    if (executeFunc === 'call') {
        await sendObject.call({ from: walletAddress }, function (error, result) {
            if (error) {
                console.log("Execute failed: ", error['message']);
                if (failed !== undefined && failed !== null) failed(error['message']);
            } else {
                console.log("Execute callback: ", result);
                if (callback !== undefined && callback !== null) callback(result);
            }
        })
    } else if (executeFunc === 'send') {
        const gasAmount = await sendObject.estimateGas({ from: walletAddress, value: msgValue });
        console.log('gasLimit', gasAmount);
        await sendObject.send({ from: walletAddress, value: msgValue, gasLimit: gasAmount })
            .on('transactionHash', function (hash) {
                console.log('transactionHash:', hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
            })
            .on('receipt', function (receipt) {
                console.log("Execute callback: ", receipt);
                if (callback !== undefined && callback !== null) callback(receipt);
            })
            .on('error', function(error){
                console.log("Execute failed: ", error);
                if (failed !== undefined && failed !== null) failed(error['message']);
            });
    }
}

// callback: function(signature)
export function Sign(walletAddress, msg, callback, failed) {
    var msgParams = [
        {
            type: 'string',
            name: 'Action',
            value: msg
        }
    ]

    let from = walletAddress;
    var params = [msgParams, from];
    var method = 'eth_signTypedData';
    web3.currentProvider.sendAsync({
        method,
        params,
        from,
    }, function (error, result) {
        if (error || result.error) {
            console.log("sign message failed: ", error, result.error);
            if (failed !== null && failed !== undefined) failed('sign message failed');
            return
        }
        if (callback !== null && callback !== undefined) callback(result.result);
    })
}