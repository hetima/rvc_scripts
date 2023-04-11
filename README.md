# rvc_jp_translate

RVC(Retrieval-based-Voice-Conversion)のWebUIを日本語ローカライズするTampermonkeyスクリプトです。RVC本体ファイルには手を加えずにローカライズします。

Tampermonkey機能拡張を使用している状態で [rvc_jp_translate.user.js](https://github.com/hetima/rvc_jp_translate/raw/main/rvc_jp_translate.user.js) を開くとインストールできます。

RVCがバージョンアップするとローカライズ漏れするところが出てくると思われますが、少なくともそのまま動作はするはずです。


# rvc_tweaks

RVCにちょっと便利な機能を追加するTampermonkeyスクリプトです。

Tampermonkey機能拡張を使用している状態で [rvc_tweaks.user.js](https://github.com/hetima/rvc_jp_translate/raw/main/rvc_tweaks.user.js) を開くとインストールできます。

- ""で囲まれたファイルパスをペーストすると自動的に"を除去します
- ~~save_every_epoch、total_epoch、batch_sizeの値を保存して次回開いたときに復元します（スライダーでの変更は記録されません。保存したい値を直接数値入力してください）~~

