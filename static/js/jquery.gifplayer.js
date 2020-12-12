/* 
 * Gifplayer v0.1.5
 * Customizable jquery plugin to play and stop animated gifs. Similar to 9gag's
 * (c)2014 Rub�n Torres - rubentdlh@gmail.com
 * Released under the MIT license
 */

(function ($) {

    function GifPlayer(preview, options) {
        this.previewElement = preview;
        this.spinnerElement = $("<div class = 'spinner'></div>");
        this.options = options;
        this.gifLoaded = false;
    }

    GifPlayer.prototype = {

        activate: function () {
            this.wrap();
            this.addSpinner();
            this.addControl();
            this.addEvents();
        },

        wrap: function () {
            this.wrapper = this.previewElement.wrap("<div class='gifplayer-wrapper'></div>").parent();
            this.wrapper.css('width', this.previewElement.width());
            this.previewElement.addClass('gifplayer');
            this.previewElement.css('cursor', 'pointer');
        },

        getGifSrc: function () {
            var size = "-" + this.previewElement.width() + 'x' + this.previewElement.height();
            var linkHref = this.previewElement.attr('src').replace(size, '').replace('.png', '.gif');
            return linkHref;
        },

        addControl: function () {
            this.playElement = $("<ins class='play-gif'>动态</ins>");
            this.wrapper.append(this.playElement);
        },

        addEvents: function () {
            var gp = this;
            if (gp.options.autoLoad) {
                gp.playElement.hide();
                gp.spinnerElement.show();
                gp.loadGif();
            }
            gp.playElement.on('click', function (e) {
                $(this).hide();
                gp.spinnerElement.show();
                gp.loadGif();
                e.preventDefault();
                e.stopPropagation();
            });
            gp.previewElement.on('click', function (e) {
                if (gp.playElement.is(':visible')) {
                    gp.playElement.hide();
                    gp.spinnerElement.show();
                    gp.loadGif();
                }
                e.preventDefault();
                e.stopPropagation();
            });
            gp.spinnerElement.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },

        loadGif: function () {
            if (!this.gifLoaded) {
                this.enableAbort();
            }
            var gifSrc = this.getGifSrc();
            var gifWidth = this.previewElement.width();
            var gifHeight = this.previewElement.height();
            this.gifElement = $("<img src='" + gifSrc + "' width='100%' height='auto'/>");
            var gp = this;
            this.gifElement.load(function () {
                gp.gifLoaded = true;
                gp.resetEvents();
                $(".gifplayer-wrapper").css("width", "auto");
                $(this).css('cursor', 'pointer');
                $(this).css('top', '0');
                $(this).css('left', '0');
                gp.previewElement.hide();
                gp.wrapper.append(gp.gifElement);
                gp.spinnerElement.hide();

                $(this).click(function (e) {
                    $(".gifplayer-wrapper").css("width", "200px");
                    $(this).remove();
                    gp.previewElement.show();
                    gp.playElement.show();
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

        },

        enableAbort: function () {
            var gp = this;
            this.previewElement.click(function (e) {
                gp.abortLoading(e);
            });
            this.spinnerElement.click(function (e) {
                gp.abortLoading(e);
            });
        },

        abortLoading: function (e) {
            this.spinnerElement.hide();
            this.playElement.show();
            e.preventDefault();
            e.stopPropagation();
            this.gifElement.off('load').on('load', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            });
            this.resetEvents();
        },

        resetEvents: function () {
            this.previewElement.off('click');
            this.playElement.off('click');
            this.spinnerElement.off('click');
            this.addEvents();
        },

        addSpinner: function () {
            this.wrapper.append(this.spinnerElement);
            this.spinnerElement.hide();
        }

    };

    $.fn.gifplayer = function (options) {
        return this.each(function () {
            options = $.extend({}, $.fn.gifplayer.defaults, options);
            var gifplayer = new GifPlayer($(this), options);
            gifplayer.activate();
        });
    };

    $.fn.gifplayer.defaults = {
        label: 'gif',
        autoLoad: false
    };

})(jQuery);