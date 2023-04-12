// ==UserScript==
// @name         rvc_jp_translate
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  インターフェイスを日本語化
// @author       hetima
// @match        http://127.0.0.1:7865/
// @match        https://*.gradio.live/
// @run-at       document-end
// @grant        none
// ==/UserScript==

// 0.1.3 起動処理改善

(function () {
    'use strict';
    function setup() {
    }

    function dumpText() {
        var texts = jpDict;
        var elementList = document.querySelector('gradio-app').shadowRoot.querySelectorAll("p,span,button");
        elementList.forEach(function (itm) {
            var txt = itm.innerHTML;
            if (!(txt in jpDict)) {
                texts[txt] = "";
            }
        });
        let write_json = JSON.stringify(texts);
        console.log(write_json);
    }

    function replaceText() {
        console.log("replaceText");
        var elementList = document.querySelector('gradio-app').shadowRoot.querySelectorAll("p,span,button");
        elementList.forEach(function (itm) {
            var txt = itm.innerHTML;
            if (txt in jpDict) {
                var repTxt = jpDict[txt];
                if (repTxt != ""){
                    itm.innerHTML = repTxt;
                }
            }
        });
    }

    const observer = new MutationObserver(records => {
        //dumpText();
        replaceText();
    });
    const options = {
        childList: true,
        subtree: true
    };
    const shadowRoot = document.querySelector('gradio-app').shadowRoot
    if (shadowRoot == undefined) {
        console.log("shadowRoot is undefined");
        setTimeout(function () {
            replaceText();
            observer.observe(document.querySelector('gradio-app').shadowRoot, options);
        }, 2000);
    } else {
        observer.observe(document.querySelector('gradio-app').shadowRoot, options);
        setTimeout(function () {
            //時間がたったら監視停止
            //observer.disconnect();
            //しないでずっと動かす。タブの切替でタブタイトルが変更されてしまうので
        }, 8000);
    }



    // observer.observe(document.querySelector('gradio-app').shadowRoot, options);
    // setup();
    // setTimeout(function () {
    //     //時間がたったら監視停止
    // }, 6000);

   
    // "是" "否" は動作に影響するので翻訳しない
    const jpDict = {
        "模型推理 ": "推論実行",
        "伴奏人声分离 ": "音声分離",
        "训练 ": "トレーニング",
        "ckpt处理 ": "ckpt処理",
        "招募音高曲线前端编辑器 ": "",
        "招募实时变声插件开发 ": "",
        "点击查看交流、问题反馈群号 ": "",
        "刷新音色列表": "モデル一覧を更新",
        "卸载音色省显存": "モデルをアンロード",
        "转换": "変換",
        "处理数据": "処理開始",
        "特征提取": "抽出開始",
        "训练模型": "モデルトレーニング",
        "训练特征索引": "特徴トレーニング",
        "一键训练": "一括処理",
        "融合": "マージ実行",
        "修改": "修正",
        "查看": "検査",
        "提取": "抽出",
        "输出信息": "出力情報",
        "本软件以MIT协议开源，作者不对软件具备任何控制力，使用软件者、传播软件导出的声音者自负全责。<br>\n如不认可该条款，则不能使用或引用软件包内任何代码和文件。详见根目录\"使用需遵守的协议-LICENSE.txt\"。": "本ソフトウェアはMITライセンスに基づくオープンソースであり、作者は本ソフトウェアの使用および本ソフトウェアから派生する音の配布について一切の責任を負わないものとし、本ソフトウェアの使用および本ソフトウェアから派生する音の配布について一切の責任を負わないものとします。<br>\n本契約の条項に同意されない場合、パッケージ内のコードやファイルを使用したり参照したりすることはできません。 詳しくはルートディレクトリの LICENSE.txt をご覧ください。",
        "推理音色": "モデル",
        "请选择说话人id": "話者ID",
        "男转女推荐+12key，女转男推荐-12key，如果音域爆炸导致音色失真也可以自己调整到合适音域。": "男性から女性への変換の場合は、+12キーを推奨。女性から男性への変換の場合は、-12キーを推奨",
        "变调（整数，半音数量，升八度12降八度-12）": "変調（整数、半音階量、1オクターブ=12、-1オクターブ=-12）",
        "输入待处理音频文件路径(默认是正确格式示例)": "変換元のファイルパス",
        "选择音高提取算法,输入歌声可用pm提速,harvest低音好但巨慢无比": "音高抽出アルゴリズムを選択。pmは速い。harvestは精度が高いが遅い。",
        "特征检索库文件路径": "特徴量検索用ファイルパス（added_XXXX.index）",
        "特征文件路径": "特徴量ファイルパス（total_fea.npy）",
        "检索特征占比": "特徴量の割合",
        "批量转换，输入待转换音频文件夹，或上传多个音频文件，在指定文件夹（默认opt）下输出转换的音频。": "バッチ変換用",
        "指定输出文件夹": "出力フォルダ",
        "输入待处理音频文件夹路径(去文件管理器地址栏拷就行了)": "処理するファイルが含まれるフォルダのパス",
        "人声伴奏分离批量处理，使用UVR5模型。<br>\n不带和声用HP2，带和声且提取的人声不需要和声用HP5<br>\n合格的文件夹路径格式举例：E:\\codes\\py39\\vits_vc_gpu\\白鹭霜华测试样例（去文件管理器地址栏拷就行了）": "UVR5モデルによる音声分離バッチ処理。<br>\nハーモニーのない場合は、HP2を使用。ハーモニーのある場合は、HP5を使用。",
        "输入待处理音频文件夹路径": "処理するファイルが含まれるフォルダのパス",
        "模型": "モデル",
        "指定输出人声文件夹": "Vocal出力フォルダ",
        "指定输出乐器文件夹": "Inst出力フォルダ",
        "step1：填写实验配置。实验数据放在logs下，每个实验一个文件夹，需手工输入实验名路径，内含实验配置，日志，训练得到的模型文件。": "step1: 構成。logsフォルダにモデル名のフォルダが作成されます。",
        "输入实验名": "モデル名",
        "目标采样率": "サンプリングレート",
        "32k": "",
        "40k": "",
        "48k": "",
        "模型是否带音高指导(唱歌一定要，语音可以不要)": "ピッチガイドの有無（歌は必須、話し声は省くことができる）",
        "step2a：自动遍历训练文件夹下所有可解码成音频的文件并进行切片归一化，在实验目录下生成2个wav文件夹；暂时只支持单人训练。": "step2a：トレーニングフォルダ内のすべての音声ファイルを自動的に処理し、スライスと正規化を行います。処理後のファイルは、logsフォルダ内に生成されたフォルダに保存されます。ただし、現在は、単一話者のみサポートされています。",
        "输入训练文件夹路径": "トレーニングフォルダーパスを入力",
        "请指定说话人id": "話者ID",
        "step2b：使用CPU提取音高(如果模型带音高)，使用GPU提取特征(选择卡号)": "step2b：CPUでピッチ抽出（ピッチ付きモデルの場合）、GPUで特徴抽出（カード番号を選択）",
        "以-分隔输入使用的卡号，例如   0-1-2   使用卡0和卡1和卡2": "使用するカード番号を-で区切って入力。例：0、1、2を使用する場合 0-1-2",
        "显卡信息": "グラフィックカード情報",
        "提取音高使用的CPU进程数": "ピッチ抽出に使用するCPUのプロセス数",
        "选择音高提取算法:输入歌声可用pm提速,高质量语音但CPU差可用dio提速,harvest质量更好但慢": "ピッチ抽出方法（品質はharvest が良い）",
        "step3：填写训练设置，开始训练模型和索引": "step3：トレーニング実行",
        "保存频率save_every_epoch": "save_every_epoch",
        "总训练轮数total_epoch": "total_epoch",
        "每张显卡的batch_size": "batch_size",
        "是否仅保存最新的ckpt文件以节省硬盘空间": "最新のpthのみ保存して容量節約するかどうか",
        "是否缓存所有训练集至显存。10min以下小数据可缓存以加速训练，大数据缓存会炸显存也加不了多少速": "すべてのデータをVRAMにキャッシュするかどうか",
        "加载预训练底模G路径": "プリトレインGのパス",
        "加载预训练底模D路径": "プリトレインDのパス",
        "模型融合，可用于测试音色融合": "モデルのマージ",
        "A模型路径": "Aモデルパス",
        "B模型路径": "Bモデルパス",
        "A模型权重": "Aモデルの重み",
        "模型是否带音高指导": "ピッチガイドの有無",
        "要置入的模型信息": "保存ファイルパス",
        "保存的模型名不带后缀": "あるいはweightsフォルダに書き出すファイル名（.pthは付けない）",
        "修改模型信息(仅支持weights文件夹下提取的小模型文件)": "モデル情報の修正（weightsフォルダの小さなモデルファイルのみ対応）",
        "模型路径": "モデルのパス",
        "要改的模型信息": "変更する内容",
        "保存的文件名，默认空为和源文件同名": "保存するモデル名（xxx.pth）（空白だと上書き）",
        "查看模型信息(仅支持weights文件夹下提取的小模型文件)": "モデル情報の閲覧（weightsフォルダの小さなモデルファイルのみ対応）",
        "模型提取(输入logs文件夹下大文件模型路径),适用于训一半不想训了模型没有自动提取保存小文件模型,或者想测试中间模型的情况": "モデル抽出（logsフォルダにあるG～.pthのパスを入力してweightsフォルダに抽出）、トレーニングセッションの途中で、小さなモデルファイルが自動的に抽出・保存されない場合や、中間モデルをテストしたい場合などに使用します（ここの「保存ファイルパス」設定は今のところ使えない模様）",
        "保存名": "weightsフォルダに書き出すファイル名（.pthは付けない）",
        "模型是否带音高指导,1是0否": "ピッチガイド 1:有 0:無",
        "加开发群联系我647947694": ""
    }

})();

