// 处理所有用户相关的业务逻辑, 包括Load, Register, Recover, Reset等

import Web3 from "web3";
import * as selfweb3 from './index.js';

export function Init(walletAddress, inputWeb2Key, callback) {
    initBackend('Init', walletAddress, inputWeb2Key, callback);
}

export function Registered(walletAddress, selfAddress, callback) {
    selfweb3.GetWeb3().Web3Execute("call", "Registered", walletAddress, 0, [selfAddress], function (loadResult) {
        selfweb3.ShowMsg('', 'Registered', 'web3 contract call successed: ', loadResult);
        if (callback !== undefined && callback !== null) callback(loadResult, true);//(loadResult['registered'], true);
    }, function (err) {
        selfweb3.ShowMsg('error', 'Registered', 'web3 contract call failed: ', err);
    });
}

export function Load(walletAddress, selfAddress, web2Address, callback) {
    initWeb3('Load', walletAddress, selfAddress, web2Address, callback);
}

function initWeb3(flow, walletAddress, selfAddress, web2Address, callback) {
    selfweb3.ShowWaitting(true);
    selfweb3.SetProps("selfAddress", selfAddress);
    selfweb3.SetProps("web2Address", web2Address);
    let message = 'SelfWeb3 Init: ' + (new Date()).getTime();
    selfweb3.GetWeb3().Sign(flow, walletAddress, message, function(sig) {
        var loadParams = [];
        loadParams.push(selfAddress);
        loadParams.push(sig);
        loadParams.push(Web3.utils.asciiToHex(message));
        selfweb3.GetWeb3().Web3Execute("call", "Load", walletAddress, 0, loadParams, function (loadResult) {
            selfweb3.ShowMsg('', flow, 'web3 contract: Web3Public successed: ', loadResult);
            let recoverID = Web3.utils.hexToAscii(loadResult['recoverID']);
            let web3Public = Web3.utils.hexToAscii(loadResult['web3Public']);
            selfweb3.ShowWaitting(false);
            selfweb3.SetProps("recoverID", recoverID);
            selfweb3.SetProps("web3Public", web3Public);
            if (callback !== undefined && callback !== null) callback();
        }, function (err) {
            selfweb3.ShowWaitting(false);
            selfweb3.ShowMsg('error', flow, 'sign failed: ', err);
        });
    })
}

function initBackend(flow, walletAddress, inputWeb2Key, callback) {
    WasmPublic(function(wasmResponse) {
        let queryMap = {};
        queryMap['kind'] = "web2Data";
        queryMap['params'] = "initWeb2";
        queryMap['userID'] = walletAddress;
        queryMap['public'] = JSON.parse(wasmResponse)['Data'];
        selfweb3.SetProps('wasmPublic', JSON.parse(wasmResponse)['Data']);
        selfweb3.httpGet("/api/datas/load", queryMap, function(response) {
            if (response['Error'] !== '' && response['Error'] !== null && response['Error'] !== undefined) {
                selfweb3.ShowMsg('error', 'init web2 service failed: ', response['Error']);
            } else {
                let web2Response = response['Data'];
                WasmInit(walletAddress, inputWeb2Key, web2Response['Web2NetPublic'], web2Response['Web2Data'], function(initResponse) {
                    let wasmResp = {};
                    wasmResp = JSON.parse(initResponse);
                    if (wasmResp['Error'] !== '' && wasmResp['Error'] !== null && wasmResp['Error'] !== undefined) {
                        selfweb3.wasmCallback("WasmInit", response['Error'], false);
                    } else {
                        if (callback !== undefined && callback !== null) callback(wasmResp['Data'], web2Response['Web2Address']);
                        // initWeb3(flow, walletAddress, wasmResp['Data'], web2Response['Web2Address'], callback);
                    }
                });
            }
        })
    });
}

export function Register(selfAddress, walletAddress, recoverID, callback) {
    // wasm
    let userID = walletAddress;
    selfweb3.ShowWaitting(true);
    WasmRegister(userID, recoverID, function(wasmResponse) {
        let response = JSON.parse(wasmResponse);
        if (response['Error'] !== '' && response['Error'] !== null && response['Error'] !== undefined) {
            selfweb3.wasmCallback("WasmRegister", response['Error'], false);
        } else {
            selfweb3.wasmCallback("Register");
            var registParams = [];
            registParams.push(selfAddress);
            registParams.push(Web3.utils.asciiToHex(response['Data']['RecoverID']));
            registParams.push(Web3.utils.asciiToHex(response['Data']['Web3Key']));
            registParams.push(Web3.utils.asciiToHex(response['Data']['Web3Public']));
            // 流程: contract.Register ===> webAuthnRegister ===> /api/datas/store ===> TOTP QRCode
            selfweb3.GetWeb3().Web3Execute("send", "Register", walletAddress, 0, registParams, function (result) {
                selfweb3.ShowWaitting(false);

                // webAuthn register
                // self.$parent.getSelf().$refs.webauthn.webRegister(userID, function(){
                //     self.$parent.getSelf().enableSpin(false);
                //     self.storeWeb2Data(userID, recoverID, response['Data']['Web2Data'], response['Data']['QRCode']);
                // }, function() {
                //     self.$parent.getSelf().enableSpin(false);
                //     self.$Message.error('webAuthn register failed');
                // });

                storeWeb2Data(userID, recoverID, response['Data']['Web2Data'], response['Data']['QRCode'], callback);
            }, function (err) {
                selfweb3.ShowWaitting(false);
                selfweb3.ShowMsg('error', 'Register', 'web3 contract: register failed: ', walletAddress);
            })
        }
    })
}

function storeWeb2Data(userID, recoverID, web2Data, qrcode, callback) {
    let formdata = new FormData();
    formdata.append("userID", userID);
    formdata.append("kind", 'web2Data');
    formdata.append("params", web2Data);
    formdata.append("recoverID", recoverID);
    selfweb3.httpPost("/api/datas/store", formdata, function(storeResponse) {
        if (storeResponse['Error'] == '') {
            if (callback !== undefined && callback !== null) callback(qrcode);
        } else {
            selfweb3.ShowMsg('error', 'Register', 'store web2Data failed: ', storeResponse['Error']);
        }
    })
}
