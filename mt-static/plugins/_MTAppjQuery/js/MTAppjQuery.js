/*
 * MTAppjQuery.js for MTAppjQuery (Movable Type Plugin)
 *
 * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
 *
 * Since:   2010-06-22
 * Update:  2011-01-21
 * for version: 0.2
 * Comment:
 *
 */
(function($){

    // -------------------------------------------------
    //  $.MTAppNoScrollRightSidebar();
    //
    //  Description:
    //    右サイドバーのウィジェットをスクロールに追随するようにする。
    //
    //  Usage:
    //    $.MTAppNoScrollRightSidebar(open_type);
    //
    //  Param:
    //    open_type: {Boolean} true=ウィジェットを閉じた状態にする。
    // -------------------------------------------------
    $.MTAppNoScrollRightSidebar = function(open_type){
        var type = (open_type) ? 'no-scroll-right-sidebar' : '';
        $('#content-body').noScroll('#related-content', 'right');
        var span = $('#related-content')
                .addClass(type)
                .children()
                    .addClass('widget-wrapper')
                    .find('div.widget-header')
                        .find('span')
                            .css({cursor:'pointer'});
        if (open_type) {
            span.click(function(){
                $(this)
                    .closest('div.widget-wrapper')
                        .siblings()
                            .find('div.widget-content').slideUp()
                            .end()
                        .end()
                    .find('div.widget-content').slideToggle();
            });
        } else {
            span.click(function(){
                $(this).parents('div.widget-header').next().slideToggle();
            });
        }
    }
    // end - $.MTAppNoScrollRightSidebar()


    /*
     * jqueryMultiCheckbox.js
     *
     * Copyright (c) 2010 Tomohiro Okuwaki (http://www.tinybeans.net/blog/)
     * Licensed under MIT Lisence:
     * http://www.opensource.org/licenses/mit-license.php
     * http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license
     *
     * Since:   2010-06-22
     * Update:  2011-04-13
     * version: 0.12 for MTAppjQuery.js
     *
     * jQuery 1.3 later (maybe...)
     *
     */
    $.fn.multicheckbox = function(options){
        var op = $.extend({}, $.fn.multicheckbox.defaults, options);

        return this.each(function(idx){

            var $self = $(this),
                self = $self.get(0);

            var container_class = op.skin ? 'mcb-container mcb-skin-tags' : 'mcb-container';
            $self[op.insert]('<span class="' + container_class+ '">test</span>');
            var $container = (op.insert == 'before') ? $self.prev(): $self.next();

            // label, input:checkbox の挿入
            var mcb_label = function(value, label, bool_checked){
                var checked_class = bool_checked ? ' mcb-label-checked': '';
                var checked_attr = bool_checked ? ' checked="checked"': '';
                return [
                    '<label class="mcb-label' + checked_class + '">',
                        '<input class="mcb-checkbox" type="checkbox" value="' + value + '"' + checked_attr + ' />',
                        label,
                    '</label>'
                ].join('');
            }

            var label_html = [],
                checkboxs = [];
            if (typeof(op.label) == 'object') {
                if (op.sort != '') {
                    checkboxs = sortHashKey(op.label, op.sort);
                    for (var i = 0, n = checkboxs.length; i < n; i++) {
                        var key = checkboxs[i];
                        label_html.push(mcb_label(key, op.label[key]));
                    }
                } else {
                    for (var key in op.label) {
                        label_html.push(mcb_label(key, op.label[key]));
                    }
                }
            } else {
                checkboxs = (op.label == '') ? $self.attr('title').split(',') : op.label.split(',');
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    checkboxs[i] = $.trim(checkboxs[i]);
                }
                if (op.sort == 'ascend') {
                    checkboxs.sort();
                } else if (op.sort == 'descend') {
                    checkboxs.sort();
                    checkboxs.reverse();
                }
                for (var i = 0, n = checkboxs.length; i < n; i++) {
                    label_html.push(mcb_label(checkboxs[i], checkboxs[i]));
                }
            }
            if (op.add) {
                label_html.push('<input class="mcb-add-item" type="text" value="" />');
            }
            $container.html(label_html.join(''));

            // チェック済みのチェックボックスにチェックを入れる
            var checked = $self.val() ? $self.val().split(',') : [],
                checked_count = checked.length;

            for (var i = 0; i < checked_count; i++) {
                checked[i] = $.trim(checked[i]);
            }

            $container
                .find('input:checkbox').val(checked).click(checkboxClick)
                .end()
                .find('input:checked')
                    .each(function(){
                        $(this).parent().addClass('mcb-label-checked');
                    });

            $self[op.show]();

            $.data(self, 'mcb-lists', checked);

            // ユーザーが項目を追加できるようにする
            if (op.add) {
                $container.find('input.mcb-add-item')
                    .keydown(function(e){
                        var keycode = e.which || e.keyCode;
                        if (keycode == 13) {
                            var value = $(this).val(),
                                label;
                            if (!value) return;
                            if (value.indexOf(':') > 0) {
                                var obj = value.split(':');
                                value = $.trim(obj[0]);
                                label = $.trim(obj[1]);
                            } else {
                                label = value;
                            }
                            $(this).val('')
                                .before(mcb_label(value, label, true))
                                .prev()
                                    .children('input:checkbox').click(checkboxClick);
                            checked.push(value);
                            $.data(self, 'mcb-lists', checked);
                            $self.val(checked.join(','));
                            return false;
                        }
                    });
            }

            // チェックボックスをクリックしたとき
            function checkboxClick(){
                var checked = $.data(self, 'mcb-lists'),
                    $cb = $(this),
                    value = $cb.val();
                if ($cb.is(':checked')) {
                    checked.push(value);
                    $.data(self, 'mcb-lists', checked);
                    $self.val(checked.join(','));
                    $cb.closest('label').addClass('mcb-label-checked');
                } else {
                    checked = $.grep(checked, function(v, i){
                        return value == v;
                    }, true);
                    $.data(self, 'mcb-lists', checked);
                    $self.val(checked.join(','));
                    $cb.closest('label').removeClass('mcb-label-checked');
                }
            }

            // 連想配列のキーを並べ替える
            function sortHashKey(obj,rule){ // rule = 'ascend','descend'
                var keys = [], values = [];
                for (var key in obj) {
                    keys.push(key);
                }
                switch (rule) {
                    case 'ascend':
                        keys.sort();
                        break;
                    case 'descend':
                        keys.sort();
                        keys.reverse();
                        break;
                    default:
                        keys.sort();
                        break;
                }
                return keys;
            }
        });
    };
    $.fn.multicheckbox.defaults = {
        show: 'hide', // 'hide' or 'show' 元のテキストフィールドを非表示にするか否か
        label: '', // カンマ区切りの文字列か{'key1':'value1','key2':'value2'}のハッシュ
        insert: 'before', // 'before' or 'after'
        add: false, // ユーザーがチェックボックスを追加できるようにする場合はtrue
        skin: false, // タグデザインを適用する場合は'tags'
        sort: '' // 'ascend'（昇順）,'descend'（降順）
    };
    // end - jqueryMultiCheckbox.js


    // -------------------------------------------------
    //  $.MTAppMultiCheckbox();
    //
    //  Description:
    //    テキストフィールドをマルチチェックボックスにする。
    //    http://www.tinybeans.net/blog/2010/07/06-115554.html
    //
    //  Usage:
    //    $.MTAppMultiCheckbox(options);
    //
    //  Options:
    //    basename: {String} 各フォーム要素のベースネーム
    //    label: {String, Object} カンマ区切りの文字列か{'key1':'value1','key2':'value2'}のハッシュ
    //    insert: {String} 元のテキストエリアの前に挿入するか('before')、後ろに挿入するか('after')
    //    custom: {boolean} カスタムフィールドの場合(true)
    //    add: {boolean} ユーザーが項目を追加できるようにする(true)
    //    skin: {String} タグデザインを適用する('tags')
    //    sort: {String} 昇順('ascend')、降順('descend')
    //    debug: {boolean} 元のテキストフィールドを表示にする(true)か表示しないか(false)
    // -------------------------------------------------
    $.MTAppMultiCheckbox = function(options){
        var op = $.extend({}, $.MTAppMultiCheckbox.defaults, options);

        var fieldID = (op.custom) ? '#customfield_' + op.basename: '#' + op.basename;
        var optionShow = (op.debug) ? 'show' : 'hide';
        $(fieldID).multicheckbox({show:optionShow,insert:op.insert,add:op.add,skin:op.skin,label:op.label,sort:op.sort});
    };
    $.MTAppMultiCheckbox.defaults = {
        basename: '',
        label: '',
        insert: 'before',
        custom: false,
        add: false,
        skin: '',
        sort: '',
        debug: false
    };
    // end - $.MTAppMultiCheckbox()


    // -------------------------------------------------
    //  $(foo).MTAppshowHint();
    //
    //  Description:
    //    要素にマウスオーバーしたときに、要素上部に吹き出しスタイルでテキストを表示する。
    //    吹き出しは$(foo)内にprependされる。
    //
    //  Usage:
    //    $(foo).MTAppshowHint(options);
    //
    //  Options:
    //    text: {String} ヒントの吹き出しに表示させるテキスト
    // -------------------------------------------------
    $.fn.MTAppshowHint = function(options){
        var op = $.extend({}, $.fn.MTAppshowHint.defaults, options);
        return this.each(function(idx){
            var balloon = [
                    '<div class="balloon" style="visibility: hidden;">',
                        '<div class="balloon-content">',
                        '</div>',
                        '<div class="balloon-arrow">',
                            '<div class="line10"/>',
                            '<div class="line9"/>',
                            '<div class="line8"/>',
                            '<div class="line7"/>',
                            '<div class="line6"/>',
                            '<div class="line5"/>',
                            '<div class="line4"/>',
                            '<div class="line3"/>',
                            '<div class="line2"/>',
                            '<div class="line1"/>',
                        '</div>',
                    '</div>'
                ],
                $balloon = $(this).prepend(balloon.join(''))
                                  .find('div.balloon')
                                      .find('div.balloon-content').text(op.text)
                                      .end(),
                height = '-' + ($balloon.outerHeight() + 10) + 'px';

            $balloon.css('margin-top', height);

            $(this).hover(
                function(){
                    $balloon.css('visibility','visible');
                },
                function(){
                    $balloon.css('visibility','hidden');
                }
            );
        });
    };
    $.fn.MTAppshowHint.defaults = {
        text: ''
    };
    // end - $(foo).MTAppshowHint();


    // -------------------------------------------------
    //  $(foo).MTAppTooltip();
    //
    //  Description:
    //    指定した要素にマウスオーバーするとカーソルに追随するツールチップを表示する。
    //
    //  Usage:
    //  　$(foo).MTAppTooltip(options);
    //    ツールチップを表示させたい要素にMTAppTooltip()を実行する。
    //    textオプション、title属性、alt属性の値の優先順位でツールチップで表示する。
    //
    //  Options:
    //    text: {String} ツールチップに表示させるテキスト
    // -------------------------------------------------
    $.fn.MTAppTooltip = function(options){
        var op = $.extend({}, $.fn.MTAppTooltip.defaults, options);

        return this.each(function(){

            var self = $(this),
                tooltip = $('#mtapp-tooltip'),
                target, tipText;

            if (op.text != '') {
                tipText = op.text;
            } else {
                target = this.title ? 'title' : 'alt',
                tipText = self.attr(target);
            }

            self.hover(function(e){
                if (op.text == '') {
                    self.attr(target,'');
                }
                tooltip
                    .stop(true,true)
                    .fadeIn('fast')
                    .text(tipText)
                    .css({
                        position: 'absolute',
                        top: e.pageY - 20,
                        left: e.pageX + 20
                    });
            },function(){
                if (op.text == '') {
                    self.attr(target,tipText);
                }
                tooltip.fadeOut('fast');
            }).mousemove(function(e){
                tooltip.css({
                    top: e.pageY - 20,
                    left: e.pageX + 20
                });
            });
        });
    };
    $.fn.MTAppTooltip.defaults = {
        text: ''
    };
    // end - $(foo).MTAppTooltip();


    // -------------------------------------------------
    //  $.MTAppSetting();
    // -------------------------------------------------
/*
    $.fn.MTAppSetting = function(options){
        var op = $.extend({}, $.fn.MTAppSetting.defaults, options);
    };
    $.fn.MTAppSetting.defaults = {
        foo: null,
        bar: null
    };
*/

    // -------------------------------------------------
    //  $.MTAppSettingGroup();
    // -------------------------------------------------
/*
    $.fn.MTAppSettingGroup = function(options){
        var op = $.extend({}, $.fn.MTAppSettingGroup.defaults, options);
    };
    $.fn.MTAppSettingGroup.defaults = {
        fields: null
    };
*/

    // -------------------------------------------------
    //  $.MTAppCustomize();
    //
    //  Description:
    //    主にブログ記事・ウェブページの編集画面の各フィールドをカスタマイズする。
    //
    //  Usage:
    //    $.MTAppCustomize(options);
    //
    //  Options:
    //    basename: {String} 各フォーム要素のベースネーム
    //    label: {String} 変更後のラベル名
    //    add_class: {String} 追加するクラス名
    //    hint: {String} ヒントに表示させたいメッセージ
    //    show_field: {String}  強制表示('show')、強制表示('hide')(注:basename が body か more の場合はタブの表示制御）
    //    show_parent: {String}  強制表示('show')、強制非表示('hide') (注:show_parent は、basename が body か more のみ）
    //    custom: {Boolean} カスタムフィールドの場合 true
    //    widget: {Boolean} ウィジェットの場合 true
    //    edit: {Boolean} 非編集モードにする場合 true
    // ---------------------------------------------------------------------
    $.MTAppCustomize = function(options){
        var op = $.extend({}, $.MTAppCustomize.defaults, options);
        var opL = op.label,
            opH = op.hint,
            opS = op.show_field,
            opC = op.custom,
            opW = op.widget,
            opE = op.edit,
            opB = opC ? 'customfield_' + op.basename : op.basename,
            $field,
            $label,
            $tab,
            $hover,
            $editImg = $('<img/>')
                .addClass('mtapp-inline-edit')
                .attr({
                    'src': StaticURI + 'images/status_icons/draft.gif',
                    'alt': '編集'
                })
                .click(function(){
                    $(this).parents('div.field-header').next('div.field-content').toggle();
                });

        // basenameが空だったら何もしないよ
        if (opB == '') {
            alert('basenameが設定されていません');
            return false;
        }

        // $field,$labelを取得
        switch (opB) {
            case 'body':
                $field = $('#text-field');
                $tab   = $field.find('#editor-header div.tab:eq(0)');
                $label = $field.find('#editor-header label:eq(0) a');
                $hover = $label;
                break;
            case 'more':
                $field = $('#text-field');
                $tab   = $field.find('#editor-header div.tab:eq(1)');
                $label = $field.find('#editor-header label:eq(1) a');
                $hover = $label;
                break;
            case 'assets':
                $field = $('#assets-field');
                $label = $field.find('h3.widget-label span');
                $hover = $field;
                break;
            default:
                if (opW) {
                    $field = $('#entry-' + opB + '-widget');
                    $label = $field.find('h2 span');
                } else {
                    $field = $('#' + opB + '-field');
                    $label = $('#' + opB + '-label');
                }
                $hover = $field;
                break;
        }

        // フィールドにクラス名を追加しよう
        if (op.add_class != '') {
            $field.addClass(op.add_class);
        }

        // ラベルの変更
        if (opL != '') {
            $label.text(opL);
            if (opB == 'title') {
                $field.find('div.field-header').show().end()
                      .find('#title').attr('placeholder', opL);
            }
        }

        // フィールドの表示・非表示
        if (opS == 'show') {
            $field.removeClass('hidden');
        } else if (opS == 'hide' && opB != 'body' && opB != 'more') {
            $field.addClass('hidden');
        } else if (opS == 'hide' && (opB == 'body' || opB == 'more')) {
            $label.closest('div.tab').addClass('hidden');
        }

        // テキストフィールドの表示・非表示
        if ((opB == 'body' || opB == 'more') && op.show_parent == 'hide') {
            $field.css({
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px'
            });
        } else if ((opB == 'body' || opB == 'more') && op.show_parent == 'show') {
            $field.removeAttr('style');
        }

        // ヒントの表示
        if (opH) $field.MTAppshowHint({ text: opH });

        // 非編集モード
        if (opE && $field.find('div.field-content').length) {
            $label.after($editImg);
            $field.find('div.field-content').hide();
        }
        return $field;
    };
    $.MTAppCustomize.defaults = {
        basename: '',
        label: '',
        addclass: '',
        hint: '',
        show_field: '',
        show_parent: '',
        custom: false,
        widget: false,
        edit: false
    };
    // end - $.MTAppCustomize()


    // -------------------------------------------------
    //  $.MTAppFieldSort();
    //
    //  Description:
    //    フィールドを並べ替える。カスタムフィールドは対応、ウィジェットは未対応。
    //
    //  Usage:
    //    $.MTAppFieldSort(options);
    //
    //  Options:
    //    sort: {String} 上からの並び順通りにbasenameをカンマ区切りで並べる。カスタムフィールドはbasenameの先頭にはc:を付与。
    //    insert_id: {String} フィールドを包含する要素のid属性の値
    // -------------------------------------------------
    $.MTAppFieldSort = function(options){
        var op = $.extend({}, $.MTAppFieldSort.defaults, options);

        var field = op.sort.split(','),
            firld_length = field.length;
        if (firld_length == 0) return;
        for (var i = 0; i < firld_length; i++) {
            field[i] = $.trim(field[i]);
        }
        field.reverse();

        var ID = op.insert_id ? '#' + op.insert_id: '#' + op.insertID;
        for (var i = 0; i < firld_length; i++) {
            if (field[i].match(/^c:/)) {
                var fieldID = '#customfield_' + field[i].replace(/^c:/,'') + '-field';
            } else {
                var fieldID = '#' + field[i] + '-field';
            }
            $(fieldID).prependTo(ID).removeClass('hidden');
        }
    };
    $.MTAppFieldSort.defaults = {
        sort: 'title,text,tags,excerpt,keywords',
        insert_id: 'sortable',
        insertID: 'sortable' // 後方互換（非推奨）
    };
    // end - $.MTAppFieldSort


    // -------------------------------------------------
    //  $.MTAppMsg();
    //
    //  Description:
    //    画面上部にMTデフォルトの形式のメッセージを表示する。
    //
    //  Usage:
    //    $.MTAppMsg(options);
    //
    //  Options:
    //    msg: {String} 表示するメッセージ
    //    type: {String} 'info' or 'success' or 'error'
    //    parent: {Boolean} p.msg-text で包含しない場合(true)
    //    timeout: {Number} 一定時間経過後に非表示にする場合にミリ秒を指定。0は非表示にしない。
    // ---------------------------------------------------------------------
    $.MTAppMsg = function(options){
        var op = $.extend({}, $.MTAppMsg.defaults, options);

        var myMsg = [
            '<div class="msg msg-' + op.type + '">',
                '<p class="msg-text">',
                    op.msg,
                '</p>',
                '<span class="mt-close-msg close-link clickable icon-remove icon16 action-icon">閉じる</span>',
            '</div>'
        ];

        if (op.parent) {
            myMsg[1] = '';
            myMsg[3] = '';
        }

        if (op.type == 'error') {
            myMsg[4] = '';
        }

        var msgBlock = $('#msg-block');

        if (msgBlock.length == 0) {
            $('#content-header').append('<div id="msg-block"></div>');
        }

        var $myMsg = $(myMsg.join(''));

        $('#msg-block').append($myMsg);

        if (op.timeout > 0) {
            setTimeout(function(){
                $myMsg.fadeOut();
            }, op.timeout);
        }
    };
    $.MTAppMsg.defaults = {
        msg: '',
        type: '',
        parent: false,
        timeout: 0
    };
    // end - $.MTAppMsg();


    // ---------------------------------------------------------------------
    //  $.MTAppDialogMsg();
    //
    //  Description:
    //    ダイアログメッセージを表示する。（jquery.ui）
    //
    //  Usage:
    //    $.MTAppDialogMsg(options);
    //
    //  Options:
    //    title: {String} ダイアログのタイトル
    //    content: {String} ダイアログのコンテンツ
    //    hide_effect: {String} 閉じる時のエフェクト 'explode', 'slide', 'drop'など
    // ---------------------------------------------------------------------

    $.MTAppDialogMsg = function(options){
        var op = $.extend({}, $.MTAppDialogMsg.defaults, options);

        $('#mtapp-dialog-msg')
            .html(op.content)
            .dialog({
                autoOpen: false,
                modal: true,
                title: op.title,
                hide: op.hide_effect
            });
        $('#mtapp-dialog-msg').dialog('open');
    };
    $.MTAppDialogMsg.defaults = {
        title: 'メッセージ',
        content: 'Movable Typeへようこそ！',
        hide_effect: ''
    };
    // end - $.MTAppDialogMsg();


    // -------------------------------------------------
    //  $.MTAppSlideMenu
    // -------------------------------------------------
    $.MTAppSlideMenu = function(options){
        var op = $.extend({}, $.MTAppSlideMenu.defaults, options);

        $('ul.mtapp-slidemenu').each(function(){
            var self = $(this);
            var parentLi = self.parent('li');
            self.find('li').each(function(i){
                $(this).addClass('slidemenu_' + i);
            });
            var parentHref = parentLi.find('a').attr('href');
            var parentId = parentHref.replace(/(.*?\?)(blog_id=\d+)(.*)/,'$2');
            parentId = parentId.replace(/=/,'_');
            self.addClass(parentId);
            parentLi.hover(
                function(){
                    var w = $(this).width();
                    $(this).find('ul:eq(0)').css('left',w + 'px').show();
//                    $('#field-convert_breaks').hide();
                },
                function(){
                    $(this).find('ul:eq(0)').hide();
//                    $('#field-convert_breaks').show();
                }
            );
            self.find('li').hover(
                function(){
                    var w = $(this).width();
                    $(this).find('ul:eq(0)').css('left',w + 'px').show();
//                    $('#convert_breaks').hide();
                },
                function(){
                    $(this).find('ul:eq(0)').hide();
//                    $('#convert_breaks').show();
                }
            );
        });
    };
    $.MTAppSlideMenu.defaults = {
        hide: ''
    };
    // end - $.MTAppSlideMenu


    // -------------------------------------------------
    //  $.MTAppInCats();
    //
    //  Description:
    //    カテゴリごとに条件分岐させる。
    //
    //  Usage:
    //    $.MTAppInCats(options);
    //
    //  Options:
    //    categories: {String} カテゴリIDを指定。複数の場合はカンマ区切り
    //    code: {Function} 実行したいスクリプトを無名関数内に記述
    // -------------------------------------------------
    $.MTAppInCats = function(options){
        var op = $.extend({}, $.MTAppInCats.defaults, options);

        // オプションで指定したカテゴリIDを取得
        var cats = [];
        cats = op.categories.split(',');
        for (var i = 0, n = cats.length; i < n; i++) {
            cats[i] = Number($.trim(cats[i]));
        }

        var selected_category_length = mtappVars.selected_category.length;

        if (selected_category_length > 0) {
            // 選択されているカテゴリとオプションで指定したカテゴリが一致したらメソッドを実行
            for (var i = 0; i < selected_category_length; i++) {
                if ($.inArray(mtappVars.selected_category[i], cats) >= 0) {
                    op.code();
                    return mtappVars.selected_category[i];
                }
            }
        }

        $('#category-selector-list').find('input:checkbox').live('click', function(){
            var cat_id = Number($(this).attr('name').replace(/add_category_id_/,''));
            if ($(this).is(':checked') && $.inArray(cat_id, cats) >= 0) {
                op.code();
                return cat_id;
            } else {
                // window.location.reload();
            }
        });
    };
    $.MTAppInCats.defaults = {
        categories: '',
        code: function(){ return; }
    };
    // end - $.MTAppInCats();


    // -------------------------------------------------
    //  $.MTAppFullscreen()
    // -------------------------------------------------
    $.MTAppFullscreen = function(){
        // Get the action bar buttons
        var actionBtns = [];
        $('#entry-publishing-widget .widget-content .actions-bar button').each(function(i){
            actionBtns[i] = $(this).clone(true).addClass('cloneBtns');
        });
        // init
        $('body').prepend('<div id="overlay"></div>');
        var fullBtn = $('<div/>')
            .attr('id','fullBtn')
            .addClass('tab')
            .html('<label><a href="javascript:void(0);">Full</a></label>')
            .toggle(
                function(){
                    var textfieldHeight = $('#text-field').height();
                    var textareaHeight = $('#editor-content-enclosure').height();
                    $('body').css({
                        'overflow':'hidden',
                        'padding-right':'17px'
                    });
                    $('#overlay').fadeIn(function(){
                        $('#text-field').css({
                            'position':'absolute',
                            'z-index':'2000',
                            'top':(getPageScroll()[1] + 8) + 'px',
                            'left':'5%',
                            'width':'90%',
                            'height':(getPageHeight() - 26) + 'px',
                            'margin-left':'0'
                        });
                        $('#editor-content-enclosure, #editor-content-enclosure textarea, #editor-content-enclosure iframe').css({
                            'height':(getPageHeight() - 115) + 'px',
                            'background-color':'#ffffff'
                        });
                        $('button.cloneBtns').show();
                    });
                },
                function(){
                    $('body, #text-field, #editor-content-enclosure, #editor-content-enclosure textarea, #editor-content-enclosure iframe').removeAttr('style');
                    $('#overlay, button.cloneBtns').hide();
                });
        // Add a new tab
        $('#editor-header div:eq(1)').after(actionBtns[0],actionBtns[1],actionBtns[2]).after(fullBtn);
    };
    // end - $.MTAppFullscreen()


    // -------------------------------------------------
    //  $.MTApp1clickRebuild();
    //
    //  Description:
    //    テンプレートの管理画面でワンクリックで再構築できるようになる。
    //
    //  Usage:
    //    $.MTApp1clickRebuild();
    // -------------------------------------------------
    $.MTApp1clickRebuild = function(options){

        // ウェブサイトテンプレートの管理以外なら何もしない
        if (mtappVars.screen_id != 'list-template') return;

        // 「すべて再構築」ボタンとテーブルに再構築アイコンを設置
        $("#index-listing, #archive-listing").each(function(){
            var self = $(this),
                type = {
                    "name": self.find('div.listing-header h2').text(),
                    "id"  : self.attr('id')
                },
                // 公開ボタンを変数に入れておく
                publish = self.find('div.button-actions:eq(0) button:eq(0)');

            // インデックス、アーカイブテンプレートのすべて再構築ボタンを設置
            self
                .find('div.button-actions')
                    .prepend('<button class="button mtapp-1click-rebuild" title="' + type.name + 'をすべて再構築">すべて再構築</button>')
                    .find('button.mtapp-1click-rebuild')
                        .click(function(){
                            $(this)
                                .closest('div.actions-bar')
                                .siblings('table')
                                    .find('input:checkbox').attr('checked','checked');
                            publish.click();
                            return false;
                        });
            // 再構築アイコンをテーブルに挿入
            self
                .find('#' + type.id + '-table')
                    .find('th.cb')
                        .insertListingColum('after', 'th', '再構築', 'rebuild')
                    .end()
                    .find('tbody')
                        .find('td.cb')
                            .insertListingColum('after', 'td', '<img class="mtapp-rebuild-icon" src="' + mtappVars.static_plugin_path + 'images/rebuild-mini.png" width="13" height="13" />', 'rebuild')
                        .end()
                        .find('img.mtapp-rebuild-icon')
                            .each(function(){
                                var tmplName = $(this).closest('td').next().find('a').text();
                                $(this).attr('title',tmplName + ' を再構築する');
                            })
                            //.MTAppTooltip()
                            .click(function(){
                                $(this)
                                    .closest('td.rebuild')
                                        .prev('td.cb')
                                            .find('input:checkbox')
                                                .attr('checked','checked');
                                publish.click();
                                return false;
                            });
        });
    };
    // end - $.MTApp1clickRebuild()


    // -------------------------------------------------
    //  $.MTAppDebug()
    //
    //  Description:
    //    ページの情報や各種一覧でIDを表示する。
    //
    //  Usage:
    //    $.MTAppDebug();
    //
    //  Options:
    //    id: {Boolean} IDをテーブルに表示する場合はtrue
    // -------------------------------------------------
    $.MTAppDebug = function(options){
        var op = $.extend({}, $.MTAppDebug.defaults, options);

        // Show the page information
        var body = $('body'),
            bodyID = body.attr('id'),
            bodyID = (bodyID != '') ? '#' + bodyID: '',
            bodyClass = body.attr('class').replace(/ +/g,'.');

        var mtappVarsStr = [];
        for (var key in mtappVars) {
            var value = '';
            if (typeof mtappVars[key] == 'string') {
                value = '"' + mtappVars[key] + '"';
            } else if ($.isArray(mtappVars[key])) {
                value = (typeof mtappVars[key][0] == 'string') ?
                        '["'+ mtappVars[key].join('", "') +'"]':
                        '['+ mtappVars[key].join(', ') +']';
            } else {
                value = mtappVars[key];
            }
            mtappVarsStr.push('&nbsp;&nbsp;&nbsp;&nbsp;' + key + ': ' + value);
        }

        var pageInfo = [
            '<p id="mtapp-debug-pageinfo-title" class="msg-text"><a href="javascript: void(0);">このページの情報</a></p>',
            '<p id="mtapp-debug-pageinfo-content" class="msg-text">',
                'body'+ bodyID + '.' + bodyClass + '<br />',
                'var mtappVars = { <br />' + mtappVarsStr.join(',<br />') + '<br />};',
            '</p>'
        ];
        $.MTAppMsg({
            msg: pageInfo.join(''),
            type: 'info',
            parent: true
        });
        $('#mtapp-debug-pageinfo-title').click(function(){
            $('#mtapp-debug-pageinfo-content').slideToggle();
        });

        // [ブログ記事の管理]
        if (mtappVars.screen_id == 'list-entry') {
            //  下書きの背景を変更
            $(window).bind('listReady', function(){
                $('#entry-table').find('span.draft').closest('tr').css({'background':'#FFCBD0'});
            });
        }

        // [カテゴリの管理] [フォルダの管理]
        if (mtappVars.template_filename == 'list_category') {
            // IDを表示
            $(window).bind('listReady', function(){
                $('#root').find('div').each(function(){
                    var id = $(this).attr('id');
                    $(this).MTAppshowHint({text: 'ID: ' + id});
                });
            });
        }

        // [テンプレートの管理] [ウィジェットの管理]
        if (op.id && mtappVars.template_filename == 'list_template' || mtappVars.template_filename == 'list_widget') {
            $('table.listing-table')
                .find('th.cb').each(function(){
                    $(this).insertListingColum('after', 'th', 'ID', 'id num');
                }).end()
                .find('td.cb').each(function(){
                    var id = $(this).find('input:checkbox').val();
                    $(this).insertListingColum('after', 'td', id, 'id num');
                });
        }

        // list_common.tmplのリスト画面で表示オプションにIDがないページ
        if (op.id && mtappVars.template_filename == 'list_common' && !$('#disp_cols label:contains("ID")').length) {
            // IDを表示
            $(window).bind('listReady', function(){
                $('table.listing-table').find('tr').each(function(){
                    var id = $(this).attr('id');
                    $(this)
                        .find('th.cb').insertListingColum('after', 'th', 'ID', 'id num').end()
                        .find('td.cb').insertListingColum('after', 'td', id, 'id num');
                });
            });
        }

    };
    $.MTAppDebug.defaults = {
        id: false
    };
    // end - $.MTAppDebug()

    // -------------------------------------------------
    //  $.MTAppCreateLink()
    // -------------------------------------------------
    $.MTAppCreateLink = function(options){
        var op = $.extend({}, $.MTAppCreateLink.defaults, options);
        var cgi = CMSScriptURI;
        switch (op.title) {
            case 'ユーザーダッシュボード':
                return cgi + '?__mode=dashboard';
            case 'ダッシュボード':
                return cgi + '?__mode=dashboard&blog_id=' + op.blog_id;
            default:
                return '';
        }
    };

    $.MTAppCreateLink.defaults = {
        title: '',
        blog_id: 0,
        id: 0
    };

    // ---------------------------------------------------------------------
    //  $.fn.MTAppCheckCategoryCount();
    //
    //  Description:
    //
    //    必要な数のカテゴリが選択されているかチェックする。
    //    チェックされていなければ false を返す。
    //
    //  Usage:
    //    $(selector).MTAppCheckCategoryCount(options);
    //
    //  Options:
    //    required_count: {Number} 必須選択の数(required_idsが優先される)
    //    required_ids: {String} 必須カテゴリIDをカンマ区切り
    //    title: {String} ダイアログボックスのタイトル
    //    content: {String} ダイアログボックスの本文
    // ---------------------------------------------------------------------

    $.fn.MTAppCheckCategoryCount = function(options){
        var op = $.extend({}, $.fn.MTAppCheckCategoryCount.defaults, options);
        return this.click(function(){

            var cat_selector = $('#category-selector'),
                cat_selector_list = $('#category-selector-list'),
                match_count = 0;
            if (op.required_ids != '') {
                var ids = ',' + op.required_ids + ',',
                    ids_array = op.required_ids.split(','),
                    ids_count = ids_array.length;
                if (cat_selector.is(':visible')) {
                    cat_selector_list.find('input:checkbox:checked').each(function(){
                        var name = $(this).attr('name').replace(/add_category_id_/,''),
                            reg = new RegExp(name, 'g');
                        if (reg.exec(ids)) {
                            match_count++;
                        }
                    });
                } else {
                    for (var i = 0, n = mtappVars.selected_category.length; i < n; i++) {
                        var reg = new RegExp(mtappVars.selected_category[i], 'g');
                        if (reg.exec(ids)) {
                            match_count++;
                        }
                    }
                }
                if (ids_count == match_count) {
                    return true;
                } else {
                    $.MTAppDialogMsg({
                        title: op.title,
                        content: op.content
                    });
                    return false;
                }
            } else {
                var checked_count = (cat_selector.is(':visible')) ?
                                    cat_selector_list.find('input:checkbox:checked').length:
                                    mtappVars.selected_category.length;
                if (op.required_count <= checked_count) {
                    return true;
                } else {
                    $.MTAppDialogMsg({
                        title: op.title,
                        content: op.content
                    });
                    return false;
                }
            }
        });
    };
    $.fn.MTAppCheckCategoryCount.defaults = {
        required_count: 0,
        required_ids: '',
        title: 'エラー',
        content: '必要な数のカテゴリが選択されていません。'
    };
    // end - $.fn.MTAppCheckCategoryCount()


    // -------------------------------------------------
    //  $(foo).MTAppInlineEdit();
    //
    //  Description:
    //    input:text, textareaをインラインエディットモードにする。
    //
    //  Usage:
    //    $(foo).MTAppInlineEdit(options);
    //
    //  Options:
    //    edit: {String} インラインエディットモードを切り替えるボタンのテキスト
    //    always: {Boolean} 常にインラインエディットモードにする場合(true)
    // -------------------------------------------------
    $.fn.MTAppInlineEdit = function(options) {
        var op = $.extend({}, $.fn.MTAppInlineEdit.defaults, options);
        return this.each(function(){
            var self = $(this),
                val = self.val(),
                $btn = $('<button class="mt-edit-field-button button">' + op.edit + '</button>').click(function(){
                    $(this).hide()
                        .prev().show()
                            .prev().hide();
                    return false;
                });
            if (op.always) {
                val = (val != '') ? val: '...';
                self.before('<span>' + val + '</span>')
                    .after($btn)
                    .hide();
            } else if (val != '') {
                self.before('<span>' + val + '</span>')
                    .after($btn)
                    .hide();
            }
        });
    };
    $.fn.MTAppInlineEdit.defaults = {
        edit: '編集',
        always: false
    };
    // end - $(foo).MTAppInlineEdit();


    // -------------------------------------------------
    //  $.MTAppEnableUploadify();
    //
    //  Description:
    //    ブログ記事編集画面の複数ファイルアップロード機能（ベータ版）を有効にする。
    //
    //  Usage:
    //    $.MTAppEnableUploadify(options);
    //
    //  Options:
    //    enable: {Boolean} 有効にする（true）、無効にする（false）
    // -------------------------------------------------
    $.MTAppEnableUploadify = function(options){
        var op = $.extend({}, $.MTAppEnableUploadify.defaults, options);

        if (mtappVars.screen_id != 'list-plugins') return;
        $('#uploadify-container').show()
    };
    $.MTAppEnableUploadify.defaults = {
        enable: false
    };
    // end - $.MTAppEnableUploadify();


    // -------------------------------------------------
    //  $(foo).MTAppTabSpace();
    //
    //  Description:
    //    textareaでタブキーが押されたときに、スペースなどの文字列を挿入する
    //
    //  Usage:
    //    $(foo).MTAppTabSpace(options);
    //
    //  Options:
    //    text: {String} タブキーが押されたときに入力される文字列。初期値は半角スペース4つ。
    // -------------------------------------------------
    $.fn.MTAppTabSpace = function(options) {
        var op = $.extend({}, $.fn.MTAppTabSpace.defaults, options);
        return this.each(function(){
            $(this).keydown(function(e){
                var keycode = e.which || e.keyCode;
                if (keycode == 9) {
                    $(this).insertAtCaret(op.text);
                    return false;
                }
            });
        });
    };
    $.fn.MTAppTabSpace.defaults = {
        text: '    '
    };
    // end - $(foo).MTAppTabSpace();


    // -------------------------------------------------
    //  $.MTAppRemoveVal();
    //
    //  Description:
    //    ブログ記事・ウェブページ編集画面のメインカラムのinput:text, textareaにクリアボタンを付ける。
    //
    //  Usage:
    //    $.MTAppRemoveVal();
    // -------------------------------------------------
    $.MTAppRemoveVal = function(options) {
        if (mtappVars.screen_id == 'edit-entry' || mtappVars.screen_id == 'edit-page') {
            $('#sortable div.field-content').find('input:text,textarea').filter(':visible').each(function(){
                var self = $(this),
                    self_width = self.outerWidth(),
                    self_height = self.outerHeight(),
                    pos_left = self_width - 18,
                    pos_top = (self_height - 16) / 2 + 16;
                self.after('<span class="remove-val" style="left:' + pos_left + 'px; top: -' + pos_top + 'px;">クリア</span>')
                    .next('span.remove-val')
                        .click(function(){
                            self.val('');
                        });
            });
        }
    };
    // end - $.MTAppRemoveVal();

    // -------------------------------------------------
    //  $(foo).MTAppRemoveVal();
    //
    //  Description:
    //    指定したinput:textにクリアボタンを付ける。
    //
    //  Usage:
    //    $(foo).MTAppRemoveVal();
    // -------------------------------------------------
    $.fn.MTAppRemoveVal = function(options) {
        return this.each(function(){
            var self = $(this),
                self_width = self.outerWidth(),
                self_height = self.outerHeight(),
                pos_left = self_width - 18,
                pos_top = (self_height - 16) / 2 + 16;
            self.after('<span class="remove-val" style="left:' + pos_left + 'px; top: -' + pos_top + 'px;">クリア</span>')
                .next('span.remove-val')
                    .click(function(){
                        self.val('');
                    });
        });
    };
    // end - $(foo).MTAppRemoveVal();


    // -------------------------------------------------
    //  $(foo).MTAppNumChecker();
    //
    //  Description:
    //    全角数字を半角に変換、半角数字以外の文字を削除、最小値・最大値の設定など
    //
    //  Usage:
    //    $(foo).MTAppNumChecker(options);
    //
    //  Options:
    //    min: {Number} 最小値
    //    max: {Number} 最大値
    //    min_msg: {String} 最小値よりも小さかったときのアラートメッセージ
    //    max_msg: {String} 最大値よりも大きかったときのアラートメッセージ
    // -------------------------------------------------
    $.fn.MTAppNumChecker = function(options) {
        var op = $.extend({}, $.fn.MTAppNumChecker.defaults, options);
        return this.each(function(){
            $(this)
                .after('<span class="mun_msg" style="display:none;color:red;font-weight:bold;"></span>')
                .keyup(function(){
                    var self = $(this);
                    var text = self.val();
                    text = $.trim(text);
                    text = text
                        .replace(/０/g, '0')
                        .replace(/１/g, '1')
                        .replace(/２/g, '2')
                        .replace(/３/g, '3')
                        .replace(/４/g, '4')
                        .replace(/５/g, '5')
                        .replace(/６/g, '6')
                        .replace(/７/g, '7')
                        .replace(/８/g, '8')
                        .replace(/９/g, '9');
                    self.val(text.replace(/^0|[^0-9]/g, ''));
                    var span = $(this).nextAll('span.mun_msg');
                    var num = Number(text.replace(/^0|[^0-9]/g, ''));
                    if (num < op.min) {
                        span.text(op.min_msg).show();
                    } else if (num > op.max) {
                        span.text(op.max_msg).show();
                    } else {
                        span.text('').hide();
                    }
                })
        });
    };
    $.fn.MTAppNumChecker.defaults = {
        min: 0,
        max: 10000000000000000000,
        min_msg: '値が小さすぎます。',
        max_msg: '値が大きすぎます。'
    };
    // end - $(foo).MTAppNumChecker();


    // -------------------------------------------------
    //  $(foo).MTAppTaxAssist();
    //
    //  Description:
    //    入力された数値から税込み価格、税抜き価格を算出する
    //
    //  Usage:
    //    $(foo).MTAppTaxAssist(options);
    //
    //  Options:
    //    rate: {Number} 消費税率
    //    fraction: {String} 端数処理 => floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
    // -------------------------------------------------
    $.fn.MTAppTaxAssist = function(options) {
        var op = $.extend({}, $.fn.MTAppTaxAssist.defaults, options);
        var tax_button = [
            '<span class="taxes_included button" title="金額から税込み価格を計算する">税込み</span>',
            '<span class="after_taxes button" title="金額から税抜き価格を計算する">税抜き</span>'
        ];
        return this.each(function(){
            var self = $(this);
            $(this)
                .after(tax_button.join(''))
                .next()
                    .click(function(){
                        var val = Number(self.val()) * 1.05;
                        self.val(fraction(val));
                    })
                .next()
                    .click(function(){
                        var val = Number(self.val()) / 1.05;
                        self.val(fraction(val));
                    });
        });
        function fraction(num){
            if (op.fraction == 'floor') {
                return Math.floor(num);
            } else if (op.fraction == 'ceil') {
                return Math.ceil(num);
            } else if (op.fraction == 'round') {
                return Math.round(num);
            } else {
                return num;
            }
        }
    };
    $.fn.MTAppTaxAssist.defaults = {
        rate: 0.05,
        fraction: 'floor' // floor（切り捨て）、ceil（切り上げ）、round（四捨五入）
    };
    // end - $(foo).MTAppTaxAssist();


    // -------------------------------------------------
    //  $(foo).MTAppDateAssist();
    //
    //  Description:
    //    今日、明日、明後日をワンクリックで入力する
    //
    //  Usage:
    //    $(foo).MTAppDateAssist();
    // -------------------------------------------------
    $.fn.MTAppDateAssist = function(options) {
        var op = $.extend({}, $.fn.MTAppDateAssist.defaults, options);
        var d = new Date(),
            ms = d.getTime();

        var buttons = [
            '<span class="day_0 button">今日</span>',
            '<span class="day_1 button">明日</span>',
            '<span class="dai_2 button">明後日</span>'
        ];

        return this.each(function(){
            var self = $(this);
            self.closest('.field-content')
                .append(buttons.join(''))
                .find('.day_0')
                    .click(function(){
                        self.val(getDateItem(ms));
                    })
                    .next()
                        .click(function(){
                            self.val(getDateItem(ms + 86400000));
                        })
                    .next()
                        .click(function(){
                            self.val(getDateItem(ms + 172800000));
                        });
        });
        function getDateItem(ms){
            var d = new Date();
            d.setTime(ms);
            return d.getFullYear() + '-' + $.digit(d.getMonth() + 1) + '-' + $.digit(d.getDate());
        }
    };
    $.fn.MTAppDateAssist.defaults = {};
    // end - $(foo).MTAppDateAssist();


    // -------------------------------------------------
    //  $.MTAppSortableBatchEdit();
    //
    //  Description:
    //    ブログ記事・ウェブページ一括編集画面をソート可能にして、日付を自動変更する
    //
    //  Usage:
    //    $.MTAppSortableBatchEdit(options);
    //
    //  Options:
    //    target: 自動変更する日付の種類を指定。公開日'created_on'または更新日'modified_on'
    //    date_change: 日付の自動変更を無効にする（並び替えのみ有効にする）
    // -------------------------------------------------
    $.MTAppSortableBatchEdit = function(options){
        var op = $.extend({}, $.MTAppSortableBatchEdit.defaults, options);

        if (mtappVars.screen_id.indexOf('batch-edit-') < 0) return;
        $('#' + mtappVars.screen_id.replace(/batch-edit-/,'') + '-listing-table')
            .find('tr')
                .css({'cursor':'move'})
            .end()
            .find('tbody')
                .sortable({
                    items: 'tr',
                    cursor: 'move',
                    placeholder: 'mtapp-state-highlight',
                    start: function(ev, ui){
                        $(ui.placeholder).height($(ui.item).height());
                    },
                    sort: function(ev, ui){
                        ui.item.css({
                            'background-color': '#F6F1E1',
                            'border': '1px solid #CACACA'
                        });
                    },
                    stop: function(ev, ui){
                        ui.item.css({
                            'background-color': 'inherit',
                            'border': 'none'
                        });
                    },
                    update: function(ev, ui){
                        if (! op.date_change) return;
                        if (op.target == 'created_on' || op.target == 'modified_on') {
                            // 公開日か更新日か
                            var n = op.target == 'created_on' ? 0 : 1;
                            var input = ui.item.find('td.datetime:eq(' + n + ') input:text');
                            var curr_dateitem = input.val(),
                                next_dateitem = ui.item.next().find('td.datetime:eq(' + n + ') input:text').val(),
                                prev_dateitem = ui.item.prev().find('td.datetime:eq(' + n + ') input:text').val();
                            var curr_date = getDateObj(curr_dateitem),
                                next_date = getDateObj(next_dateitem),
                                prev_date = getDateObj(prev_dateitem);
                            var curr_getTime = curr_date ? curr_date.getTime() : 0,
                                next_getTime = next_date ? next_date.getTime() : 0,
                                prev_getTime = prev_date ? prev_date.getTime() : 0;

                            var new_getTime = 0;
                            if (next_getTime && prev_getTime) {
                                new_getTime = Math.floor( (prev_getTime + next_getTime) / 2 );
                            } else if (next_getTime == 0 || prev_getTime == 0) {
                                new_getTime = (next_getTime + prev_getTime) * 2 - curr_getTime;
                            }

                            curr_date.setTime(new_getTime);
                            var ymd = [
                                    curr_date.getFullYear(),
                                    $.digit(curr_date.getMonth() + 1),
                                    $.digit(curr_date.getDate())
                                ],
                                hms = [
                                    $.digit(curr_date.getHours()),
                                    $.digit(curr_date.getMinutes()),
                                    $.digit(curr_date.getSeconds())
                                ];
                            input.val(ymd.join('-') + ' ' + hms.join(':'));
                        }
                    }
                });

        function getDateObj(dateitem){
            if (! dateitem) return null;
            var _d = dateitem.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
            var d = new Date();
            d.setFullYear(_d[1]);
            d.setMonth(_d[2] - 1);
            d.setDate(_d[3]);
            d.setHours(_d[4]);
            d.setMinutes(_d[5]);
            d.setSeconds(_d[6]);
            return d;
        }
    };
    $.MTAppSortableBatchEdit.defaults = {
        target: 'created_on', // created_on, modified_on
        date_change: true
    };
    // end - $.MTAppSortableBatchEdit();


    // -------------------------------------------------
    //  $(foo).MTAppNbspGUI();
    //
    //  Description:
    //    「1項目ごとに改行してください」をGUIで実現する
    //
    //  Usage:
    //    $(foo).MTAppNbspGUI(options);
    //
    //  Options:
    //    wrapper_class: {Array} ['main-class', 'sub-class']
    //    input_class: {Array} ['main-class', 'sub-class']
    //    add_class: {Array} ['main-class', 'sub-class']
    //
    // -------------------------------------------------
    $.fn.MTAppNbspGUI = function(options) {
        var op = $.extend({}, $.fn.MTAppNbspGUI.defaults, options);
        return this.each(function(){
            var self = $(this).hide();
            var self_id = self.attr('id')
            var self_value = self.val().split('\n');

            var input = [];
            for (var i = 0, n = self_value.length; i < n; i++) {
                input.push(item(self_value[i]));
            }
            self.after(input.join(''));

            $('span.' + op.add_class[0]).live('click', function(){
                $(this).parent().after(item(''));
            });

            $('input.' + op.input_class[0]).live('blur', function(){
                var text = [];
                var inputs = $('input.' + op.input_class[0]);
                var inputs_count = inputs.length;
                inputs.each(function(){
                    if ($(this).val() != '') {
                        text.push($(this).val());
                    } else if (inputs_count > 1) {
                        $(this).parent().remove();
                    }
                });
                self.val(text.join("\n"));
            });

            function item (val) {
                return [
                    '<span class="' + op.wrapper_class.join(' ') + '">',
                        '<input type="text" class="' + op.input_class.join(' ') + '" value="' + val + '" />',
                        '<span class="' + op.add_class.join(' ') + '">追加</span>',
                    '</span>'
                ].join('');
            }

        });
    };
    $.fn.MTAppNbspGUI.defaults = {
        wrapper_class: ['mtapp-nbsp-gui-item'],
        input_class: ['mtapp-nbsp-gui-input','text','full'],
        add_class: ['mtapp-nbsp-gui-add']
    };
    // end - $(foo).MTAppNbspGUI();


    // -------------------------------------------------
    //  Utilities
    //
    //  $(foo).hasClasses(classes);
    //
    //    Description:
    //      classesで指定したクラス名が設定されている場合はtrueを返す。
    //    Param:
    //      classes: {String} カンマ区切りの文字列
    //
    //  $(foo).notClasses(classes);
    //
    //    Description:
    //      classesで指定したクラス名が設定されていない場合はtrueを返す。
    //    Param:
    //      classes: {String} カンマ区切りの文字列
    //
    //  $(foo).noScroll(selector, horizontal);
    //
    //    Description:
    //      $(foo)の子要素である$(selector)をスクロールに追随させる。
    //    Param:
    //      selector: {String} jQueryセレクタ
    //      horizontal: {String} $(selector)のpositionプロパティに{horizontal: 0}を付与
    //
    //
    //  $.digit(num, space);
    //
    //    Description:
    //      numが一桁の場合は、頭に0または半角スペースを付与
    //    Param:
    //      num: {Number} 数字
    //      space: {Boolean} 半角スペースを付与する場合(true)
    // -------------------------------------------------
    $.fn.extend({
        hasClasses: function (classes) {
            if (typeof classes == 'string') {
                classes = /^\./.test(classes)
                    ? classes.replace(/^\./,'').split('.')
                    : classes.replace(/^ | $/g,'').split(' ');
            }
            for (var i = -1,j = 0, n = classes.length; ++i < n;) {
                if (this.hasClass(classes[i])) j++;
            }
            return n === j;
        },
        notClasses: function(selector) {
            if (this.hasClasses(selector)) {
                return false;
            } else {
                return true;
            }
        },
        noScroll: function (selector, horizontal){
            var self = $(this).css('position', 'relative'),
                target = self.find(selector).css({'position': 'absolute', 'z-index':99});
                if (horizontal) {
                    target.css(horizontal, 0);
                }
            $(window).scroll(function(){
                var thisTop = $(document).scrollTop() - self.offset().top + 10;
                if (thisTop < 0) {
                    thisTop = 0;
                }
                target.stop().animate(
                    {top: thisTop + 'px'},
                    'fast',
                    'swing'
                );
            });
            return self;
        },
        insertListingColum: function(position, element, html, classname){
            return this.each(function(){
                var elem = '';
                classname = classname ? ' ' + classname : '';
                if (element == 'th') {
                    elem = '<th class="col head' + classname + '"><span class="col-label">' + html + '</span></th>';
                } else if (element == 'td') {
                    elem = '<td class="col' + classname + '">' + html + '</td>';
                }
                $(this)[position](elem);
            });
        },
        insertAtCaret: function(text) {
            return this.each(function(){
                var self = $(this)[0];
                self.focus();
                if ($.browser.msie) {
                    var range = document.selection.createRange();
                    range.text = text;
                    range.select();
                } else {
                    var val = self.value,
                        beforeCaret = self.selectionStart,
                        afterCaret = beforeCaret + text.length;
                    self.value = val.substr(0, beforeCaret) + text + val.substr(beforeCaret);
                    self.setSelectionRange(afterCaret, afterCaret);
                }
            });
        }
    });

    $.extend({
        digit: function (num, space) {
            var prefix = (space) ? ' ' : '0';
            return (num < 10) ? prefix + num: num;
    }

    });
    // end - Utility

})(jQuery);

// getPageScroll() by quirksmode.com
function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
        yScroll = self.pageYOffset;
        xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {   // Explorer 6 Strict
        yScroll = document.documentElement.scrollTop;
        xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
        yScroll = document.body.scrollTop;
        xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll,yScroll);
}

// Adapted from getPageSize() by quirksmode.com
function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {   // all except Explorer
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}
function setCookie(key, val, days){
    var cookie = escape(key) + "=" + escape(val);
    if(days != null){
        var expires = new Date();
        expires.setDate(expires.getDate() + days);
        cookie += ";expires=" + expires.toGMTString();
    }
    document.cookie = cookie;
}
function getCookie(key) {
    if(document.cookie){
        var cookies = document.cookie.split(";");
        for(var i=0; i<cookies.length; i++){
            var cookie = cookies[i].replace(/\s/g,"").split("=");
            if(cookie[0] == escape(key)){
                return unescape(cookie[1]);
            }
        }
    }
    return "";
}

jQuery(function($){

    // -------------------------------------------------
    //  <body>にブログIDとユーザーIDのクラス名を付与
    // -------------------------------------------------
    $('body').addClass('blog-id-' + mtappVars.blog_id + ' author-id-' + mtappVars.author_id);

    // -------------------------------------------------
    //  Favorite Structure ダッシュボード
    // -------------------------------------------------
/*
    if ($("body#dashboard").length > 0 && $("#favorite_blogs").length > 0) {
        $("div.blog-content").each(function(){
            $(this).clone().appendTo("#favorite-structure-container");
        });
    }
*/
    $('#favorite-structure').find('div.favorite-structure-container').hover(
    	function(){
    		$(this).css('backgroundColor','#C2EEB5');
    	},
    	function(){
    		$(this).css('backgroundColor','#F3F3F3');
    	}
    );
});
