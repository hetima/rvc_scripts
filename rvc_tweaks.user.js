// ==UserScript==
// @name         rvc_tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  rvc_tweaks
// @author       hetima
// @match        http://127.0.0.1:7865/
// @match        https://*.gradio.live/
// @run-at       document-end
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

// 0.1.3 save_every_epoch、total_epoch、batch_sizeの保存対応停止
// 0.1.2 save_every_epoch、total_epoch、batch_sizeの保存値をスライダーにも反映

(function () {
    'use strict';
    var inited = false;

    function getNumInputForSpan(elm, name){
        if (elm.innerHTML.indexOf(name) != -1) {
            var nm = elm.parentNode.nextElementSibling;
            if (nm != null && nm.type == "number"){
                return nm;
            }
        }
        return null;
    }
    function getRangeInputForNumInput(elm) {
        var nm = elm.parentNode.parentNode.nextElementSibling;
        if (nm != null && nm.type == "range") {
            return nm;
        }

        return null;
    }
    function setup() {
        if (inited){
            return;
        }
        var elementList = document.querySelector('gradio-app').shadowRoot.querySelectorAll("textarea");
        if (elementList.length > 0) {
            console.log("rvc_tweaks inited");
            inited = true;
            // テキストが""で囲まれてたら"を削除する
            elementList.forEach(function (itm) {
                //itm.onkeyup = handleChangeText;
                itm.addEventListener('keyup', function (evt) {
                    var tgt = evt.target;
                    var txt = tgt.value;
                    var char = txt.slice(0, 1);
                    if (char == '"' && char == txt.slice(-1)) {
                        tgt.value = txt.slice(1, -1);
                    }
                });
            });

            // トレーニング設定保存
            // elementList = document.querySelector('gradio-app').shadowRoot.querySelectorAll("span");
            // elementList.forEach(function (itm) {
            //     var numInput = getNumInputForSpan(itm, 'save_every_epoch');
            //     var rangeInput;
            //     if (numInput != null){
            //         var save_every_epoch=GM_getValue("save_every_epoch");
            //         if (!Number.isNaN(parseInt(save_every_epoch))){
            //             numInput.value = save_every_epoch;
            //         }
            //         numInput.addEventListener('change', function (evt) {
            //             GM_setValue("save_every_epoch", evt.target.value);
            //         });
            //         rangeInput = getRangeInputForNumInput(numInput);
            //         if (rangeInput != null) {
            //             rangeInput.value = save_every_epoch;
            //         }
            //     }

            //     numInput = getNumInputForSpan(itm, 'total_epoch');
            //     if (numInput != null) {
            //         var total_epoch = GM_getValue("total_epoch");
            //         if (!Number.isNaN(parseInt(total_epoch))) {
            //             numInput.value = total_epoch;
            //         }
            //         numInput.addEventListener('change', function (evt) {
            //             GM_setValue("total_epoch", evt.target.value);
            //         });
            //         rangeInput = getRangeInputForNumInput(numInput);
            //         if (rangeInput != null) {
            //             rangeInput.value = total_epoch;
            //         }
            //     }

            //     numInput = getNumInputForSpan(itm, 'batch_size');
            //     if (numInput != null) {
            //         var batch_size = GM_getValue("batch_size");
            //         if (!Number.isNaN(parseInt(batch_size))) {
            //             numInput.value = batch_size;
            //         }
            //         numInput.addEventListener('change', function (evt) {
            //             GM_setValue("batch_size", evt.target.value);
            //         });
            //         rangeInput = getRangeInputForNumInput(numInput);
            //         if (rangeInput != null) {
            //             rangeInput.value = batch_size;
            //         }
            //     }

            // });
        }

    }

    const observer = new MutationObserver(records => {
        setup();
    });
    const options = {
        childList: true,
        subtree: true
    };
    observer.observe(document.querySelector('gradio-app').shadowRoot, options);
    setTimeout(function () {
        //時間がたったら監視停止
        observer.disconnect();
    }, 8000);

})();

