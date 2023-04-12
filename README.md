# rvc_jp_translate

RVC(Retrieval-based-Voice-Conversion)のWebUIを日本語ローカライズするTampermonkeyスクリプトです。RVC本体ファイルには手を加えずにローカライズします。

Tampermonkey機能拡張を使用している状態で [rvc_jp_translate.user.js](https://github.com/hetima/rvc_jp_translate/raw/main/rvc_jp_translate.user.js) を開くとインストールできます。

RVCがバージョンアップするとローカライズ漏れするところが出てくると思われますが、少なくともそのまま動作はするはずです。


# rvc_tweaks

RVCにちょっと便利な機能を追加するTampermonkeyスクリプトです。

Tampermonkey機能拡張を使用している状態で [rvc_tweaks.user.js](https://github.com/hetima/rvc_jp_translate/raw/main/rvc_tweaks.user.js) を開くとインストールできます。

- ""で囲まれたファイルパスをペーストすると自動的に"を除去します
- 特徴量検索用ファイルパス（added_XXXX.index）と特徴量ファイルパス（total_fea.npy）を自動設定

モデルを変更すると、対応する特徴量ファイルパスを自動で設定します。  
推論実行タブの最下段にフォルダパスを設定する項目が追加されます。そこで設定したフォルダの中に「モデル名.index」「モデル名.npy」とリネームして配置してください。  
例えばフォルダパスを `D:\RVC-beta\weights\subdata` と指定したら `added_XXXX.index` と `total_fea.npy` を `モデル名.index` と `モデル名.npy`にリネームして `D:\RVC-beta\weights\subdata` に入れてください。  
ただし、モデル名が数字で終わる場合は数字を除いた名前にしてください(xxx100→xxx つまり「xxx」と「xxx数字」ではファイルを共用します)。  
ファイルが存在するかどうかはチェックせず強制的に設定変更するのでご注意ください。

