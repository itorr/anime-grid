class JapaneseAnimeGrid extends AnimeGrid {
    generatorHTML({title}){
        return `<canvas></canvas>
<div class="ctrl-box">
    <a class="generator-btn ui-btn" action="downloadImage">${title}を生成</a>
</div>
<div class="search-bangumis-box ui-shadow" data-show="false">
    <div class="content-box">
        <form>
            <input type="text" placeholder="キーワードを入力してEnterで検索">
        </form>
        <div class="anime-list"></div>
        <div class="foot">
            <a class="close ui-btn" action="searchFromBangumi">Bangumiで検索</a>
            <a class="close ui-btn" action="setInputText">見つからない場合は入力した文字を使う</a>
            <a class="close ui-btn" action="setNull">空欄に戻す</a>
            <a class="close ui-btn current" action="closeSearchBox">選択画面を閉じる</a>
        </div>
    </div>
</div>
<div class="output-box ui-shadow" data-show="false">
    <div class="content-box">
        <h3>完成しました！</h3>
        <img>
        <div class="body">
            <p>画像を長押し、または右クリックして保存してください</p>
        </div>
        <div class="foot">
            <a class="close ui-btn current" action="closeOutput">閉じる</a>
        </div>
    </div>
</div>`;
    }
}
