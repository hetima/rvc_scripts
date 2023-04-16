// ==UserScript==
// @name         rvc_tweaks
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  rvc_tweaks
// @author       hetima
// @match        http://127.0.0.1/
// @match        http://localhost/
// @match        https://*.gradio.live/
// @run-at       document-end
// ==/UserScript==

// 0.3.3 RVC20230416対応
// 0.3.2 最新のddPn08/rvc-webui対応
// 0.3.1 "取る処理の修正
// 0.3.0 最近使った音源
// 0.2.4 ddPn08/rvc-webui でのバグ修正
// 0.2.3 ddPn08/rvc-webui にちょっと対応
// 0.2.1 特徴量ファイルパスの共用名を「モデル名_数字」に変更
// 0.2.0 特徴量ファイルパスの自動設定を追加
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
        if (gAppRoot == null) {
            gAppRoot = document.querySelector('gradio-app').shadowRoot;
            if (gAppRoot == null) {
                gAppRoot = document.querySelector('gradio-app');
            }
        }

        var elementList = gAppRoot.querySelectorAll("textarea");
        if (elementList.length > 0) {
            console.log("rvc_tweaks inited");
            inited = true;

            // テキストが""で囲まれてたら"を削除する
            elementList.forEach(function (itm) {
                //itm.onkeyup = handleChangeText;
                itm.addEventListener('keyup', function (evt) {
                    var tgt = evt.target;
                    var txt = tgt.value;
                    if (txt.length > 8 ) {
                        var char = txt.slice(0, 1);
                        if (char == '"' && char == txt.slice(-1)) {
                            tgt.value = txt.slice(1, -1);
                            //Gradioに変更したことを認識させる
                            tgt.dispatchEvent(new Event("input"));
                        }
                    }
                });
            });


            setupTPath();
            //動くようになったけどローカライズの種類に依存するので
            // setupTrainCount();
            setupRecentsSelect();
        }

    }

    function setupTrainCount() {

        //トレーニング設定保存
        const elementList = gAppRoot.querySelectorAll("span");
        elementList.forEach(function (itm) {
            var numInput = getNumInputForSpan(itm, 'save_every_epoch');
            var rangeInput;
            if (numInput != null){
                var save_every_epoch = localStorage.getItem("rvc_tweaks_save_every_epoch");
                if (!Number.isNaN(parseInt(save_every_epoch))){
                    numInput.value = save_every_epoch;
                    numInput.dispatchEvent(new Event("input"))
                }
                numInput.addEventListener('change', function (evt) {
                    localStorage.setItem("rvc_tweaks_save_every_epoch", evt.target.value);
                });
                rangeInput = getRangeInputForNumInput(numInput);
                // if (rangeInput != null) {
                //     rangeInput.value = save_every_epoch;
                // }
            }

            numInput = getNumInputForSpan(itm, 'total_epoch');
            if (numInput != null) {
                var total_epoch = localStorage.getItem("rvc_tweaks_total_epoch");
                if (!Number.isNaN(parseInt(total_epoch))) {
                    numInput.value = total_epoch;
                    numInput.dispatchEvent(new Event("input"))
                }
                numInput.addEventListener('change', function (evt) {
                    localStorage.setItem("rvc_tweaks_total_epoch", evt.target.value);
                });
                // rangeInput = getRangeInputForNumInput(numInput);
                // if (rangeInput != null) {
                //     rangeInput.value = total_epoch;
                // }
            }

            numInput = getNumInputForSpan(itm, 'batch_size');
            if (numInput != null) {
                var batch_size = localStorage.getItem("rvc_tweaks_batch_size");
                if (!Number.isNaN(parseInt(batch_size))) {
                    numInput.value = batch_size;
                    numInput.dispatchEvent(new Event("input"))
                }
                numInput.addEventListener('change', function (evt) {
                    localStorage.setItem("rvc_tweaks_batch_size", evt.target.value);
                });
                // rangeInput = getRangeInputForNumInput(numInput);
                // if (rangeInput != null) {
                //     rangeInput.value = batch_size;
                // }
            }

        });
    }

    //特徴量ファイルパス
    const addedIndexTextareas = new Array();
    const totalFeaTextareas = new Array();
    function setupTPath(){

        //textareaを探す
        var elementList = gAppRoot.querySelectorAll("textarea");
        var textareaCount = 0;
        if (elementList.length > 0) {
            elementList.forEach(function (itm) {
                if (itm.value.indexOf(".index") != -1) {
                    addedIndexTextareas.push(itm);
                    textareaCount++;
                } else if (itm.value.indexOf("total_fea.npy") != -1) {
                    totalFeaTextareas.push(itm);
                    textareaCount++;
                }
            });
        }

        if (textareaCount < 4){
            elementList = gAppRoot.querySelectorAll("span");
            textareaCount = 0;
            if (elementList.length > 0) {
                elementList.forEach(function (itm) {
                    var t;
                    if (itm.innerHTML == "Feature Retrieval Library" || itm.innerHTML == "Faiss Index File Path") {
                        t = itm.nextElementSibling;
                        if(t.type=="textarea"){
                            addedIndexTextareas.push(t);
                            textareaCount++;
                        }
                    } else if (itm.innerHTML == "Feature File Path" || itm.innerHTML == "Big NPY File Path") {
                        t = itm.nextElementSibling;
                        if (t.type == "textarea") {
                            totalFeaTextareas.push(t);
                            textareaCount++;
                        }
                    }
                });
            }
        }

        if (textareaCount < 2) {
            return;
        }
        // console.log("textareaCount=" + textareaCount);
        // 設定UIを追加
        const view = addViewToTab(0, "rvc_tweaks 設定");
        const tPathTextarea = addTextareaToView(view, "特徴量検索用ファイルパス（added_XXXX.index）と特徴量ファイルパス（total_fea.npy）を自動設定するためのフォルダパス（例：D:\\RVC-beta\\weights\\subdata）<br>このフォルダの中に「モデル名.index」「モデル名.npy」とリネームして配置してください。ただし、モデル名が_+数字で終わる場合は_+数字を除いた名前にしてください(xxx_100→xxx)<br>ファイルが存在するかどうかはチェックせず強制的に設定変更するのでご注意ください。");
        tPathTextarea.value = localStorage.getItem("rvc_tweaks_t_path");
        tPathTextarea.addEventListener('change', function (evt) {
            localStorage.setItem("rvc_tweaks_t_path", evt.target.value);
        });
        tPathTextarea.addEventListener('keyup', function (evt) {
            var tgt = evt.target;
            var txt = tgt.value;
            var char = txt.slice(0, 1);
            if (char == '"' && char == txt.slice(-1)) {
                tgt.value = txt.slice(1, -1);
                localStorage.setItem("rvc_tweaks_t_path", evt.target.value);
            }
        });

        //モデル選択したらパスを更新
        let slct = gAppRoot.querySelector(".tabitem>div>div>div>div>label>select");
        if(slct==null){
            slct = gAppRoot.querySelector(".single-select"); //span
        }
        if (slct && slct.type =="select-one"){
            slct.addEventListener('change', function (evt) {
                updateTPath(evt.target.value);
            });
        } else if (slct && slct.tagName == "SPAN") {
            if (slct.textContent != ""){
                updateTPath(slct.textContent);
            }
            const observer2 = new MutationObserver(records => {
                const newName = records[0].target.textContent;
                console.log(newName + " was selected");
                updateTPath(newName);
            });
            const options = {
                childList: true,
                subtree: true,
                characterData: true
            };
            observer2.observe(slct, options);

        }
    }
    function updateTPath(modelName) {
        // console.log("model selection changed");
        let tPath = localStorage.getItem("rvc_tweaks_t_path");
        if (!tPath || tPath.length <= 0) {
            return;
        }
        if (tPath.slice(-1) == "\\") {
            tPath = tPath.slice(0, -1);
        }
        if (modelName.lastIndexOf(".") > 0) {
            //拡張子と末尾の数字を除去
            let result = modelName.substring(0, modelName.lastIndexOf(".")).replace(/_\d+$/, "");
            let addIndexPath = tPath + "\\" + result + ".index";
            let totalFeaPath = tPath + "\\" + result + ".npy";
            addedIndexTextareas.forEach((element) => {
                element.value = addIndexPath;
                //Gradioに変更したことを認識させる
                element.dispatchEvent(new Event("input"));
            });
            totalFeaTextareas.forEach((element) => {
                element.value = totalFeaPath;
                //Gradioに変更したことを認識させる
                element.dispatchEvent(new Event("input"));
            });
        }
    }

    //最近使った音源
    const gRecentSelect = document.createElement('select');
    let gWavTextarea;
    let gRecentSelectsArray = new Array();
    gRecentSelect.style = "width:20px;border-width:0px;padding:2px 22px;";
    function setupRecentsSelect(){
        const tab = gAppRoot.querySelector(".tabitem"); //最初のタブだけ
        if (tab == null) {
            return;
        }
        var elementList = tab.querySelectorAll("span");
        gWavTextarea = null;
        if (elementList.length > 0) {
            elementList.forEach(function (itm) {
                if (itm.innerText == "Source Audio" || itm.innerText == "変換元のファイルパス" || itm.innerText == "输入待处理音频文件路径(默认是正确格式示例)" || itm.innerText == "処理対象音声ファイルのパスを入力してください(デフォルトは正しいフォーマットの例です)" || itm.innerText == "Enter the file path of the audio to be processed (default is the correct format example)") {
                    if (itm.nextElementSibling.type =="textarea"){
                        gWavTextarea = itm.nextElementSibling;
                    }
                    return;
                }
            });
        }
        if (gWavTextarea == null) {
            return;
        }
        elementList = tab.querySelectorAll("button");
        var InferBtn = null;
        if (elementList.length > 0) {
            elementList.forEach(function (itm) {
                if (itm.innerText == "Infer") {
                    InferBtn = itm;
                    return;
                }
            });
        }
        if (InferBtn == null) {
            InferBtn = gWavTextarea.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("button");
            if (InferBtn == null) {
                return;
            }
        }

        InferBtn.addEventListener('click', function (evt) {
            inferBtnClicked();
        });

        let recents = localStorage.getItem("rvc_tweaks_recents");
        if (recents && recents.length > 0){
            gRecentSelectsArray = JSON.parse(recents);
        }

        const view = document.createElement('span');
        view.style = "width:20px;";
        // gRecentSelect.innerHTML ='<option value = "">No History</option>';
        updateRecentSelect();
        gWavTextarea.parentNode.insertBefore(gRecentSelect, gWavTextarea);

        gRecentSelect.addEventListener('change', function (evt) {
            let val = evt.target.value;
            if(val == "x"){
                gRecentSelectsArray = new Array();
                let json = JSON.stringify(gRecentSelectsArray, undefined, 1);
                localStorage.setItem("rvc_tweaks_recents", json);
                updateRecentSelect();
            }else if(val && val.length>0){
                gWavTextarea.value = val;
                //Gradioに変更したことを認識させる
                gWavTextarea.dispatchEvent(new Event("input"));
            }
            gRecentSelect.selectedIndex = -1;
        });
    }
    function inferBtnClicked(){
        let wavPath = gWavTextarea.value;
        addRecentSelect(wavPath);
    }
    function addRecentSelect(newPath){
        if (!newPath || newPath.length <= 0){
            return;
        }
        if (gRecentSelectsArray.includes(newPath)) {
            gRecentSelectsArray.splice(gRecentSelectsArray.indexOf(newPath), 1);
        }
        gRecentSelectsArray.unshift(newPath);
        if (gRecentSelectsArray.length > 8){
            gRecentSelectsArray.pop();
        }
        let json = JSON.stringify(gRecentSelectsArray, undefined, 1);
        localStorage.setItem("rvc_tweaks_recents", json);
        updateRecentSelect();
       
    }
    function updateRecentSelect() {
        gRecentSelect.replaceChildren();
        gRecentSelectsArray.forEach(function (itm) {
            var option = document.createElement("option");
            option.text = itm;
            option.value = itm;
            gRecentSelect.appendChild(option);
        });
        var option = document.createElement("option");
        option.text = gRecentSelectsArray.length > 0 ? "Clear History" : "No History";
        option.value = "x";
        gRecentSelect.appendChild(option);
        gRecentSelect.selectedIndex = -1;
    }




    const observer = new MutationObserver(records => {
        setup();
    });
    const options = {
        childList: true,
        subtree: true
    };

    let gAppRoot = document.querySelector('gradio-app').shadowRoot;
    if (gAppRoot == undefined){
        console.log("shadowRoot is undefined");
        setTimeout(function () {
            setup();
        }, 1200);
    }else{
        observer.observe(gAppRoot, options);
        setTimeout(function () {
            //時間がたったら監視停止
            observer.disconnect();
        }, 8000);
    }

    function addViewToTab(index, title){
        const elementList = gAppRoot.querySelectorAll(".tabitem");
        if (elementList.length > index) {
            const tab = elementList[index].childNodes[0];
            const view = document.createElement('div');
            view.classList.add("svelte-10ogue4");
            const label = document.createElement('div');
            label.innerHTML = "<p>" + title + "</p>";
            view.insertBefore(label, null);
            tab.insertBefore(view, null);
            return view;
        }
    }
    function addTextareaToView(view, title){
        const pane = document.createElement('div');
        //pane.classList.add("flex","row", "w-full", "flex-wrap", "gap-4");
        //pane.classList.add("gr-form", "overflow-hidden", "flex", "border-solid", "border", "bg-gray-200", "dark:bg-gray-700", "gap-px", "rounded-lg", "flex-wrap");
        const textarea = document.createElement('textarea');
        textarea.classList.add("scroll-hide", "block", "gr-box", "gr-input", "w-full", "gr-text-input", "svelte-4xt1ch")
        textarea.style = "overflow-y: scroll; height: 42px; width:100%";

        const label = document.createElement('div');
        label.innerHTML = "<span class=\"text-gray-500 text-[0.855rem]\">" + title + "</span>";
        label.classList.add("block", "w-full");
        
        label.insertBefore(textarea, null);
        pane.insertBefore(label, null);
        view.insertBefore(pane, null);
        return textarea;
    }


})();

