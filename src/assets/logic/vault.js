"use strict"
import Web3 from './contract/web3.js';
import * as selfweb3 from './index.js';

export const Flow_VaultBalance = "VaultBalance";
export const Flow_VaultDeposit = "VaultDeposit";
export const Flow_VaultWithdraw = "VaultWithdraw";

/*
vue demo:
    let self = this;
    let selfAddress = self.$parent.getSelf().selfAddress;
    let walletAddress = self.$parent.getSelf().getWalletAddress();
    selfweb3.GetVault().Balance(walletAddress, selfAddress, function(balance){
        self.modelBalance = balance;
    })
*/
export function Balance(walletAddress, selfAddress, callback) {
    var web3Params = [];
    web3Params.push(selfAddress);
    selfweb3.GetWeb3().Execute("call", "Balance", walletAddress, 0, web3Params, function (balance) {
        if (callback !== undefined && callback !== null) callback(Web3.utils.fromWei(balance + '', 'ether'));
    }, function (err) {
        selfweb3.ShowMsg('error', Flow_VaultBalance, 'sign message failed', err);
    });
}

/*
vue demo: 
    self.$parent.getSelf().RunTOTP("SelfVault", function(code) {
        let selfAddress = self.$parent.getSelf().selfAddress;;
        let walletAddress = self.$parent.getSelf().getWalletAddress();
        selfweb3.GetVault().Deposit(walletAddress, selfAddress, inputAmount, code, function() {
            self.balance();
        })
    })
*/
export function Deposit(walletAddress, selfAddress, amount, code, callback) {
    let web3Map = {"method": "TOTPVerify", "action": "query", "relateTimes": "1"};
    selfweb3.GetVerify().TOTPVerify(Flow_VaultDeposit, walletAddress, code, JSON.stringify(web3Map), function(wasmResponse) {
        selfweb3.GetUser().selfAuthVerify2(Flow_VaultDeposit, walletAddress, web3Map['action'], wasmResponse, function(){
            let web3Map = {"method": "WebAuthnKey", "selfKey": selfweb3.GetProps('selfKey')};
            WasmHandle(walletAddress, JSON.stringify(web3Map), function(wasmWebAuthnResponse) {
                console.log('WebAuthnKey: ', wasmWebAuthnResponse);
                selfweb3.GetVerify().WebAuthnLogin(Flow_VaultDeposit, walletAddress, JSON.parse(wasmWebAuthnResponse)['Data'], function() {
                    var web3Params = [];
                    web3Params.push(selfAddress);
                    selfweb3.GetWeb3().Execute("send", "Deposit", walletAddress, amount, web3Params, function (result) {
                        if (callback !== undefined && callback !== null) callback();
                    }, function (err) {
                        selfweb3.ShowMsg('error', Flow_VaultDeposit, 'selfVault deposit failed', err);
                    })
                }, function(err) {
                    selfweb3.ShowMsg('error', Flow_VaultDeposit, 'webAuthn verify failed', err);
                })
            })
        });
    })
}

/*
vue demo:
    self.$parent.getSelf().RunTOTP("SelfVault", function(code) {
        let selfAddress = self.$parent.getSelf().selfAddress;;
        let walletAddress = self.$parent.getSelf().getWalletAddress();
        selfweb3.GetVault().Withdraw(walletAddress, selfAddress, inputAmount, code, function() {
            self.balance();
        })
    })
*/
export function Withdraw(walletAddress, selfAddress, amount, code, callback) {
    let web3Map = {"method": "TOTPVerify", "action": "query", "relateTimes": "1"};
    selfweb3.GetVerify().TOTPVerify(Flow_VaultWithdraw, walletAddress, code, JSON.stringify(web3Map), function(wasmResponse) {
        selfweb3.GetUser().selfAuthVerify2(Flow_VaultWithdraw, walletAddress, web3Map['action'], wasmResponse, function(){
            let web3Map = {"method": "WebAuthnKey", "selfKey": selfweb3.GetProps('selfKey')};
            WasmHandle(walletAddress, JSON.stringify(web3Map), function(wasmWebAuthnResponse) {
                console.log('WebAuthnKey: ', wasmWebAuthnResponse);
                selfweb3.GetVerify().WebAuthnLogin(Flow_VaultWithdraw, walletAddress, JSON.parse(wasmWebAuthnResponse)['Data'], function() {
                    var web3Params = [];
                    web3Params.push(selfAddress);
                    web3Params.push(Web3.utils.toBN(Web3.utils.toWei(amount + '', 'ether')));
                    selfweb3.GetWeb3().Execute("send", "Withdraw", walletAddress, 0, web3Params, function (result) {
                        if (callback !== undefined && callback !== null) callback();
                    }, function (err) {
                        selfweb3.ShowMsg('error', Flow_VaultWithdraw, 'selfVault deposit failed', err);
                    })
                }, function(err) {
                    selfweb3.ShowMsg('error', Flow_VaultWithdraw, 'webAuthn verify failed', err);
                })
            })
        });
    })
}