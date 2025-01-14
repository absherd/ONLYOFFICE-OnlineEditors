﻿/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 (function (document) {
    var ImageLoadStatus = {
        Loading: 0,
        Complete: 1
    };
    function CImageLoad(src) {
        this.src = src;
        this.Image = null;
        this.Status = ImageLoadStatus.Complete;
    }
    function CGlobalImageLoader() {
        this.map_image_index = {};
        this.imagesPath = "";
        this.Api = null;
        this.ThemeLoader = null;
        this.images_loading = null;
        this.bIsLoadDocumentFirst = false;
        this.bIsAsyncLoadDocumentImages = false;
        this.put_Api = function (_api) {
            this.Api = _api;
        };
        this.LoadDocumentImages = function (_images, isUrl) {
            if (this.ThemeLoader == null) {
                this.Api.asyncImagesDocumentStartLoaded();
            } else {
                this.ThemeLoader.asyncImagesStartLoaded();
            }
            this.images_loading = [];
            for (var id in _images) {
                this.images_loading[this.images_loading.length] = getFullImageSrc(_images[id]);
            }
            if (!this.bIsAsyncLoadDocumentImages) {
                this._LoadImages();
            } else {
                var _len = this.images_loading.length;
                for (var i = 0; i < _len; i++) {
                    this.LoadImageAsync(i);
                }
                this.images_loading.splice(0, _len);
                if (this.ThemeLoader == null) {
                    this.Api.asyncImagesDocumentEndLoaded();
                } else {
                    this.ThemeLoader.asyncImagesEndLoaded();
                }
            }
        };
        var oThis = this;
        this._LoadImages = function () {
            if (0 == this.images_loading.length) {
                if (this.ThemeLoader == null) {
                    this.Api.asyncImagesDocumentEndLoaded();
                } else {
                    this.ThemeLoader.asyncImagesEndLoaded();
                }
                return;
            }
            var _id = this.images_loading[0];
            var oImage = new CImageLoad(_id);
            oImage.Status = ImageLoadStatus.Loading;
            oImage.Image = new Image();
            oThis.map_image_index[oImage.src] = oImage;
            oImage.Image.onload = function () {
                oImage.Status = ImageLoadStatus.Complete;
                if (oThis.bIsLoadDocumentFirst === true) {
                    oThis.Api.OpenDocumentProgress.CurrentImage++;
                    oThis.Api.SendOpenProgress();
                }
                oThis.images_loading.shift();
                oThis._LoadImages();
            };
            oImage.Image.onerror = function () {
                oImage.Status = ImageLoadStatus.Complete;
                oImage.Image = null;
                if (oThis.bIsLoadDocumentFirst === true) {
                    oThis.Api.OpenDocumentProgress.CurrentImage++;
                    oThis.Api.SendOpenProgress();
                }
                oThis.images_loading.shift();
                oThis._LoadImages();
            };
            oImage.Image.src = oImage.src;
        };
        this.LoadImage = function (src, Type) {
            var _image = this.map_image_index[src];
            if (undefined != _image) {
                return _image;
            }
            this.Api.asyncImageStartLoaded();
            var oImage = new CImageLoad(src);
            oImage.Type = Type;
            oImage.Image = new Image();
            oImage.Status = ImageLoadStatus.Loading;
            oThis.map_image_index[oImage.src] = oImage;
            oImage.Image.onload = function () {
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoaded(oImage);
            };
            oImage.Image.onerror = function () {
                oImage.Image = null;
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoaded(oImage);
            };
            oImage.Image.src = oImage.src;
            return null;
        };
        this.LoadImageAsync = function (i) {
            var _id = oThis.images_loading[i];
            var oImage = new CImageLoad(_id);
            oImage.Status = ImageLoadStatus.Loading;
            oImage.Image = new Image();
            oThis.map_image_index[oImage.src] = oImage;
            oImage.Image.onload = function () {
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoadedBackground(oImage);
            };
            oImage.Image.onerror = function () {
                oImage.Status = ImageLoadStatus.Complete;
                oImage.Image = null;
                oThis.Api.asyncImageEndLoadedBackground(oImage);
            };
            oImage.Image.src = oImage.src;
        };
    }
    function CEmbeddedCutFontsLoader() {
        this.Api = null;
        this.font_infos = [];
        this.font_files = [];
        this.map_name_cutindex = null;
        this.CurrentFindFileParse = -1;
        this.Url = "";
        this.bIsCutFontsUse = false;
        var oThis = this;
        this.load_cut_fonts = function () {
            var scriptElem = document.createElement("script");
            if (scriptElem.readyState && false) {
                scriptElem.onreadystatechange = function () {
                    if (this.readyState == "complete" || this.readyState == "loaded") {
                        scriptElem.onreadystatechange = null;
                        setTimeout(oThis._callback_script_load, 0);
                    }
                };
            }
            scriptElem.onload = scriptElem.onerror = oThis._callback_font_load;
            scriptElem.setAttribute("src", this.Url);
            scriptElem.setAttribute("type", "text/javascript");
            document.getElementsByTagName("head")[0].appendChild(scriptElem);
            this.Api.asyncFontsDocumentStartLoaded();
        };
        this._callback_font_load = function () {
            if (undefined === embedded_fonts) {
                return;
            }
            oThis.CurrentFindFileParse = 0;
            setTimeout(oThis.parse_font, 10);
        },
        this.parse_font = function () {
            var __font_data_idx = g_fonts_streams.length;
            g_fonts_streams[__font_data_idx] = CreateFontData2(embedded_fonts[oThis.CurrentFindFileParse], undefined);
            embedded_fonts[oThis.CurrentFindFileParse] = "";
            oThis.font_files[oThis.CurrentFindFileParse].SetStreamIndex(__font_data_idx);
            oThis.font_files[oThis.CurrentFindFileParse].Status = 0;
            oThis.CurrentFindFileParse++;
            if (oThis.CurrentFindFileParse >= oThis.font_files.length) {
                oThis.Api.asyncFontsDocumentEndLoaded();
                return;
            }
            setTimeout(oThis.parse_font, 10);
        };
        this.init_cut_fonts = function (_fonts) {
            this.map_name_cutindex = {};
            var _len = _fonts.length;
            for (var i = 0; i < _len; i++) {
                var _font = _fonts[i];
                var _info = this.map_name_cutindex[_font.Name];
                if (_info === undefined) {
                    _info = new CFontInfo(_font.Name, "", FONT_TYPE_ADDITIONAL_CUT, -1, -1, -1, -1, -1, -1, -1, -1);
                    this.map_name_cutindex[_font.Name] = _info;
                }
                switch (_font.Style) {
                case 0:
                    _info.indexR = _font.IndexCut;
                    _info.faceIndexR = 0;
                    break;
                case 1:
                    _info.indexB = _font.IndexCut;
                    _info.faceIndexB = 0;
                    break;
                case 2:
                    _info.indexI = _font.IndexCut;
                    _info.faceIndexI = 0;
                    break;
                case 3:
                    _info.indexBI = _font.IndexCut;
                    _info.faceIndexBI = 0;
                    break;
                default:
                    break;
                }
                this.font_files[i] = new CFontFileLoader("embedded_cut" + i);
            }
        };
    }
    function CGlobalFontLoader() {
        this.fonts_streams = new Array();
        this.fontFilesPath = "";
        this.fontFiles = window.g_font_files;
        this.fontInfos = window.g_font_infos;
        this.map_font_index = window.g_map_font_index;
        this.embeddedFilesPath = "";
        this.embeddedFontFiles = new Array();
        this.embeddedFontInfos = new Array();
        this.ThemeLoader = null;
        this.Api = null;
        this.fonts_loading = new Array();
        this.fonts_loading_after_style = new Array();
        this.bIsLoadDocumentFirst = false;
        this.currentInfoLoaded = null;
        this.embedded_cut_manager = new CEmbeddedCutFontsLoader();
        this.put_Api = function (_api) {
            this.Api = _api;
            this.embedded_cut_manager.Api = _api;
        };
        this.LoadEmbeddedFonts = function (url, _fonts) {
            this.embeddedFilesPath = url;
            var _count = _fonts.length;
            if (0 == _count) {
                return;
            }
            this.embeddedFontInfos = new Array(_count);
            var map_files = {};
            for (var i = 0; i < _count; i++) {
                map_files[_fonts[i].id] = _fonts[i].id;
            }
            var index = 0;
            for (var i in map_files) {
                this.embeddedFontFiles[index] = new CFontFileLoader(map_files[i]);
                this.embeddedFontFiles[index].CanUseOriginalFormat = false;
                this.embeddedFontFiles[index].IsNeedAddJSToFontPath = false;
                map_files[i] = index++;
            }
            for (var i = 0; i < _count; i++) {
                var lStyle = 0;
                if (0 == lStyle) {
                    this.embeddedFontInfos[i] = new CFontInfo(_fonts[i].name, "", FONT_TYPE_EMBEDDED, map_files[_fonts[i].id], 0, -1, -1, -1, -1, -1, -1);
                } else {
                    if (2 == lStyle) {
                        this.embeddedFontInfos[i] = new CFontInfo(_fonts[i].name, "", FONT_TYPE_EMBEDDED, -1, -1, map_files[_fonts[i].id], _fonts[i].faceindex, -1, -1, -1, -1);
                    } else {
                        if (1 == lStyle) {
                            this.embeddedFontInfos[i] = new CFontInfo(_fonts[i].name, "", FONT_TYPE_EMBEDDED, -1, -1, -1, -1, map_files[_fonts[i].id], _fonts[i].faceindex, -1, -1);
                        } else {
                            this.embeddedFontInfos[i] = new CFontInfo(_fonts[i].name, "", FONT_TYPE_EMBEDDED, -1, -1, -1, -1, -1, -1, map_files[_fonts[i].id], _fonts[i].faceindex);
                        }
                    }
                }
            }
            var _count_infos_ = this.fontInfos.length;
            for (var i = 0; i < _count; i++) {
                this.map_font_index[_fonts[i].name] = i + _count_infos_;
                this.fontInfos[i + _count_infos_] = this.embeddedFontInfos[i];
            }
        };
        this.SetStandartFonts = function () {
            var standarts = window.standarts;
            if (undefined == standarts) {
                standarts = [];
                for (var i = 0; i < window.g_font_infos.length; i++) {
                    standarts.push(window.g_font_infos[i].Name);
                }
            }
            var _count = standarts.length;
            var _infos = this.fontInfos;
            var _map = this.map_font_index;
            for (var i = 0; i < _count; i++) {
                _infos[_map[standarts[i]]].Type = FONT_TYPE_STANDART;
            }
        };
        this.CheckFontsPaste = function (_fonts) {
            for (var i in _fonts) {
                var info_ind = this.map_font_index[_fonts[i]];
                if (info_ind != undefined) {
                    this.fonts_loading[this.fonts_loading.length] = this.fontInfos[info_ind];
                }
            }
            this.Api.asyncFontsDocumentStartLoaded();
            this._LoadFonts();
        };
        this.AddLoadFonts = function (info, need_styles) {
            this.fonts_loading[this.fonts_loading.length] = info;
            this.fonts_loading[this.fonts_loading.length - 1].NeedStyles = (need_styles == undefined) ? 15 : need_styles;
        };
        this.LoadDocumentFonts = function (_fonts, is_default) {
            if (this.embedded_cut_manager.bIsCutFontsUse) {
                return this.embedded_cut_manager.load_cut_fonts();
            }
            var gui_fonts = new Array();
            var gui_count = 0;
            for (var i = 0; i < this.fontInfos.length; i++) {
                var info = this.fontInfos[i];
                if (FONT_TYPE_STANDART == info.Type) {
                    var __font = new CFont(info.Name, "", info.Type, info.Thumbnail);
                    gui_fonts[gui_count++] = __font;
                }
            }
            for (var i in _fonts) {
                if (_fonts[i].Type != FONT_TYPE_EMBEDDED) {
                    var info = this.fontInfos[this.map_font_index[_fonts[i].name]];
                    this.AddLoadFonts(info, _fonts[i].NeedStyles);
                    if (info.Type == FONT_TYPE_ADDITIONAL) {
                        var __font = new CFont(info.Name, "", info.Type, info.Thumbnail);
                        gui_fonts[gui_count++] = __font;
                    }
                } else {
                    var ind = -1;
                    for (var j = 0; j < this.embeddedFontInfos.length; j++) {
                        if (this.embeddedFontInfos[j].Name == _fonts[i].name) {
                            this.AddLoadFonts(this.embeddedFontInfos[j], 0);
                            break;
                        }
                    }
                }
            }
            this.Api.sync_InitEditorFonts(gui_fonts);
            if (this.Api.IsNeedDefaultFonts()) {
                this.AddLoadFonts(this.fontInfos[this.map_font_index["Arial"]], 15);
                this.AddLoadFonts(this.fontInfos[this.map_font_index["Symbol"]], 15);
                this.AddLoadFonts(this.fontInfos[this.map_font_index["Wingdings"]], 15);
                this.AddLoadFonts(this.fontInfos[this.map_font_index["Courier New"]], 15);
                this.AddLoadFonts(this.fontInfos[this.map_font_index["Times New Roman"]], 15);
            }
            this.Api.asyncFontsDocumentStartLoaded();
            this.bIsLoadDocumentFirst = true;
            this._LoadFonts();
        };
        this.LoadDocumentFonts2 = function (_fonts) {
            for (var i in _fonts) {
                var info = this.fontInfos[this.map_font_index[_fonts[i].name]];
                this.AddLoadFonts(info, 15);
            }
            if (null == this.ThemeLoader) {
                this.Api.asyncFontsDocumentStartLoaded();
            } else {
                this.ThemeLoader.asyncFontsStartLoaded();
            }
            this._LoadFonts();
        };
        var oThis = this;
        this._LoadFonts = function () {
            if (0 == this.fonts_loading.length) {
                if (null == this.ThemeLoader) {
                    this.Api.asyncFontsDocumentEndLoaded();
                } else {
                    this.ThemeLoader.asyncFontsEndLoaded();
                }
                if (this.bIsLoadDocumentFirst === true) {
                    var _count = this.fonts_loading_after_style.length;
                    for (var i = 0; i < _count; i++) {
                        var _info = this.fonts_loading_after_style[i];
                        _info.NeedStyles = 15;
                        _info.CheckFontLoadStyles(this);
                    }
                    this.fonts_loading_after_style.splice(0, this.fonts_loading_after_style.length);
                    this.bIsLoadDocumentFirst = false;
                }
                return;
            }
            var fontinfo = this.fonts_loading[0];
            var IsNeed = fontinfo.CheckFontLoadStyles(this);
            if (IsNeed) {
                setTimeout(oThis._check_loaded, 50);
            } else {
                if (this.bIsLoadDocumentFirst === true) {
                    this.Api.OpenDocumentProgress.CurrentFont++;
                    this.Api.SendOpenProgress();
                }
                this.fonts_loading_after_style[this.fonts_loading_after_style.length] = this.fonts_loading[0];
                this.fonts_loading.shift();
                this._LoadFonts();
            }
        };
        this._check_loaded = function () {
            var IsNeed = false;
            if (0 == oThis.fonts_loading.length) {
                oThis._LoadFonts();
                return;
            }
            var current = oThis.fonts_loading[0];
            var IsNeed = current.CheckFontLoadStyles(oThis);
            if (true === IsNeed) {
                setTimeout(oThis._check_loaded, 50);
            } else {
                if (oThis.bIsLoadDocumentFirst === true) {
                    oThis.Api.OpenDocumentProgress.CurrentFont++;
                    oThis.Api.SendOpenProgress();
                }
                oThis.fonts_loading_after_style[oThis.fonts_loading_after_style.length] = oThis.fonts_loading[0];
                oThis.fonts_loading.shift();
                oThis._LoadFonts();
            }
        };
        this.LoadFont = function (fontinfo) {
            this.currentInfoLoaded = fontinfo;
            this.currentInfoLoaded = fontinfo;
            this.currentInfoLoaded.NeedStyles = 15;
            var IsNeed = this.currentInfoLoaded.CheckFontLoadStyles(this);
            if (IsNeed) {
                this.Api.asyncFontStartLoaded();
                setTimeout(this.check_loaded, 20);
                return true;
            } else {
                this.currentInfoLoaded = null;
                return false;
            }
        };
        this.check_loaded = function () {
            var current = oThis.currentInfoLoaded;
            if (null == current) {
                return;
            }
            var IsNeed = current.CheckFontLoadStyles(oThis);
            if (IsNeed) {
                setTimeout(oThis.check_loaded, 50);
            } else {
                oThis.Api.asyncFontEndLoaded(oThis.currentInfoLoaded);
                oThis.currentInfoLoaded = null;
            }
        };
        this.LoadFontsFromServer = function (_fonts) {
            var _count = _fonts.length;
            for (var i = 0; i < _count; i++) {
                var _info_ind = this.map_font_index[_fonts[i]];
                if (undefined !== _info_ind) {
                    var _info = this.fontInfos[_info_ind];
                    _info.LoadFontsFromServer(this);
                }
            }
        };
    }
    CGlobalFontLoader.prototype.SetStreamIndexEmb = function (font_index, stream_index) {
        this.embeddedFontFiles[font_index].SetStreamIndex(stream_index);
    };
    function CGlobalScriptLoader() {
        this.Status = -1;
        this.callback = null;
        this.oCallBackThis = null;
        var oThis = this;
        this.CheckLoaded = function () {
            return (0 == oThis.Status || 1 == oThis.Status);
        };
        this.LoadScriptAsync = function (url, _callback, _callback_this) {
            this.callback = _callback;
            this.oCallBackThis = _callback_this;
            if (-1 != this.Status) {
                return true;
            }
            this.Status = 2;
            var scriptElem = document.createElement("script");
            if (scriptElem.readyState && false) {
                scriptElem.onreadystatechange = function () {
                    if (this.readyState == "complete" || this.readyState == "loaded") {
                        scriptElem.onreadystatechange = null;
                        setTimeout(oThis._callback_script_load, 0);
                    }
                };
            }
            scriptElem.onload = scriptElem.onerror = oThis._callback_script_load;
            scriptElem.setAttribute("src", url);
            scriptElem.setAttribute("type", "text/javascript");
            document.getElementsByTagName("head")[0].appendChild(scriptElem);
            return false;
        };
        this._callback_script_load = function () {
            if (oThis.Status != 3) {
                oThis.Status = 1;
            }
            if (null != oThis.callback) {
                oThis.callback(oThis.oCallBackThis);
                oThis.callback = null;
            }
        };
    }
    window.g_font_loader = new CGlobalFontLoader();
    window.g_image_loader = new CGlobalImageLoader();
    window.g_script_loader = new CGlobalScriptLoader();
    window.g_script_loader2 = new CGlobalScriptLoader();
    window.g_flow_anchor = new Image();
    window.g_flow_anchor.asc_complete = false;
    window.g_flow_anchor.onload = function () {
        window.g_flow_anchor.asc_complete = true;
    };
    window.g_flow_anchor.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB90FEQkoAWe6v2gAAABoSURBVDjLzZRBDsAgCAQd0v9/eXpqokaxrWlSjgLL7kJELTsRWRIQ8BUAoIpKBhJlM8g8uCarfMbgJwCrVWX+HE8MGw1rJKyaRzVRP96R0jONFcVVrjmku2bWMrY9mJ5yz2YGzu5/cAJM80IX4Fh6ugAAAABJRU5ErkJggg==";
    window["CGlobalFontLoader"] = CGlobalFontLoader;
    CGlobalFontLoader.prototype["SetStreamIndexEmb"] = CGlobalFontLoader.prototype.SetStreamIndexEmb;
})(window.document);