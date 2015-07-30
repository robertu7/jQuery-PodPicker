/*!
 * Pod Picker (jQuery Plugin) - A Podcast Timeline Generator
 * https://github.com/RoberMac/jQuery-PodPicker
 *
 * Copyright (c) 2015 RoberTu <robertu0717@gmail.com>
 * @license MIT
 * @version v0.1.1
 */


// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

"use strict";


/**
 * Determines if a value is `undefined / string / boolean / array / object / hex color / timeString`
 *
 * @param {Any} value - The value need to be determined
 * @return {Boolean}
 */
var isUndefined  = value => typeof value === 'undefined',
    isElement    = value => value && (value.jquery && value.length > 0 || value.nodeType),
    isString     = value => typeof value === 'string',
    isBoolean    = value => typeof value === 'boolean',
    isArray      = value => value.constructor === Array,
    isHexColor   = value => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value),
    isTimeString = value => /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(value);


/**
 * Error Messages
 *
 */
var ERROR_MSG = {
    // `items` parameter
    items_param: 'Pod Picker: `items` parameter is required',
    items_type: 'Pod Picker: `items` parameter must be an array',
    items_empty: 'Pod Picker: `items` parameter cannot be an empty array',
    // `options` parameter
    options_audioElem_type: 'Pod Picker: `options.audioElem` must be a DOM Element or jQuery Object',
    options_timelineColor_type: 'Pod Picker: `options.timelineColor` must be a string',
    options_isShowStartTime_type: 'Pod Picker: `options.isShowStartTime` must be a boolean',
    options_timelineColor_type_value: 'Pod Picker: `options.timelineColor` must be a hex color',
    // others
    audioFile_format: 'Pod Picker: does not support MP3 file format',
    start_format: 'Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format'
}


/**
 * Convert time string to seconds
 *
 * @param {String} [timeString] - A time string 
 * @return {Number} seconds
 */
var convertTime = (timeString) => {
    // Check time string
    !isTimeString(timeString) && $.error(ERROR_MSG.start_format)

    var timeArray = timeString.split(':'),
        len = timeArray.length;

    switch (len){
        case 1: 
            return timeArray[0] * 1
            break;
        case 2:
            return timeArray[0] * 60 + timeArray[1] * 1
            break;
        case 3:
            return timeArray[0] * 60 * 60 + timeArray[1] * 60 + timeArray[2] * 1
            break;
        default:
            $.error(ERROR_MSG.start_format)
    }
}




/**
 * Create Pod Picker
 *
 * @param {Array}  [items]   - Data Items
 * @param {Object} [options] - Options
 *   - `audioElem`      : {(DOM Element | jQuery Object)} - The Target Audio
 *   - `timelineColor`  : {String}  - The Timeline Section color
 *   - `isShowStartTime`: {Boolean} - To determine if need to show the Section Start Time
 */
$.fn.createPodPicker = function (items, options) {


    // Check if Pod Picker has been created
    if ($.fn._PodPicker.isCreated){
        $.error('Pod Picker already exists')
    } else {
        $.fn._PodPicker.isCreated = true
        $.fn._PodPicker.selector  = this.selector
    }


    /** 
     * Set Internal Variables
     *
     */
    this.data({
        _preTime      : 0,
        _itemsIndex   : 0,
        _seekingIndex : 0,
        _startTimeSet : []
    })


   /**
     * Set Items
     *
     */
    // Check items parameter
    isUndefined(items)
        ? $.error(ERROR_MSG.items_param)
        : isArray(items)
            ? items.length <= 0 && $.error(ERROR_MSG.items_empty)
            : $.error(ERROR_MSG.items_type)
    // Sort items array by item object
    items = items.sort(function (pre, next){
        var pre  = convertTime(pre.start),
            next = convertTime(next.start);
        if (pre > next){
            return 1;
        } else if (pre < next){
            return -1;
        } else {
            return 0;
        }
    })


    /** 
     * Set Options
     *
     */
    var options = $.extend({}, {
        audioElem      : $('audio').get()[0],
        timelineColor  : '#CECECF',
        isShowStartTime: false
    }, options);
    // Check option: 'audioElem'
    isElement(options.audioElem)
        ? options.audioElem = $(options.audioElem).get()[0]
        : $.error(ERROR_MSG.options_audioElem_type)
    // Check option: 'timelineColor'
    isString(options.timelineColor)
        ? isHexColor(options.timelineColor)
            ? null
            : $.error(ERROR_MSG.options_timelineColor_type_value)
        : $.error(ERROR_MSG.options_timelineColor_type)
    // Check option: 'isShowStartTime'
    !isBoolean(options.isShowStartTime) && $.error(ERROR_MSG.options_isShowStartTime_type)


    /** 
     * Create Timeline
     *
     */
    var that = this;
    var currentSrcInterval = setInterval(function (){
        var currentSrc = options.audioElem.currentSrc
        if (currentSrc){
            clearInterval(currentSrcInterval)
            currentSrc.match(/\.mp3/i)
                ? $.error(ERROR_MSG.audioFile_format)
                // then create timeline
                : _createTimeline()
        }
    }, 10)
    // Create timeline
    function _createTimeline(){
        var fragment = '<div id="pp-timeline"><ul style="color:' + options.timelineColor + '">';
        $.each(items, function (i, item){
            var start = convertTime(item.start),
                title = options.isShowStartTime
                            ? item.start + ' - ' + item.title
                            : item.title;
            fragment += '<li class="pp-item"><span>' + title + '</span></li>'
            // Extract all `item` start time and then push it to `that.data('_startTimeSet`')
            that.data('_startTimeSet').push(start)
        })
        fragment += '</ul><span id="pp-pointer"></span></div>'
        that.append(fragment)

        // then bind events
        _bindEvents()
    }


    /**
     * Bind Events
     *
     */
    function _bindEvents(){
        $('.pp-item span').click(function (){
            options.audioElem.play()
            options.audioElem.currentTime = that.data('_startTimeSet')[$(this).parent().index()]
            that.data('_seekingIndex', window.setTimeout(function (){
                $('#pp-pointer').addClass('seeking')
            }, 500))
        })
        $(options.audioElem)
        .bind('timeupdate', function (){
            var currentTime   = options.audioElem.currentTime,
                _startTimeSet = that.data('_startTimeSet'),
                len           = _startTimeSet.length;

            if (Math.abs(that.data('_preTime') - currentTime) > 1){
                // user-triggered
                $.each(_startTimeSet, function (i){
                    _startTimeSet[i + 1] // the last one 
                        ? currentTime >= _startTimeSet[i] && currentTime <= _startTimeSet[i + 1]
                            ? _setPointerPosition(i + 1)
                            : null
                        : currentTime >= _startTimeSet[i]
                            ? _setPointerPosition(i + 1)
                            : null
                })
            } else {
                // auto-triggered
                $.each(_startTimeSet, function (i){
                    currentTime > _startTimeSet[i] - 1 
                     && currentTime <= _startTimeSet[i] + 1 
                     && that.data('_itemsIndex') !== i + 1
                        ? _setPointerPosition(i + 1)
                        : null
                })
            }

            that.data('_preTime', currentTime)
        })
        .bind('seeking', function (){
            options.audioElem.pause()
        })
        .bind('seeked', function (){
            window.clearTimeout(that.data('_seekingIndex'))
            options.audioElem.play()
            $('#pp-pointer').removeClass('seeking')
        })
    }
    // Set or Reset timeline pointer position
    function _setPointerPosition (index){

        // Store current item(Section) index
        var item = $('.pp-item');
        that.data('_itemsIndex', index)

        // Set timeline section style
        item.eq(index - 1).children().addClass('currentSection')
        $.each(item, function (i){
            i !== index - 1
                ? item.eq(i).children().removeClass('currentSection')
                : null
        })

        // Set timeline pointer position
        var item_h = item.height();
        $('#pp-pointer').css('top', (index * item_h - item_h / 2 - 6) + 'px')
    }



    return this;
}


/**
 * Remove Pod Picker
 * 
 * throw error if Pod Picker has not been created or the selected element is not correct
 */
$.fn.removePodPicker = function (){

    if($.fn._PodPicker.selector && $.fn._PodPicker.selector !== this.selector){
        var msg = 'Pod Picker: Did you mean `$("' 
                    + $.fn._PodPicker.selector 
                    + '").removePodPicker()` ?';
        $.error(msg)
    } else if (!$.fn._PodPicker.selector){
        $.error('Pod Picker: has not been created')
    }

    // Remove timeline
    $('#pp-timeline').remove()

    // Unbind Events
    $('.pp-item').unbind()
    $('audio').unbind()

    // Reset status
    $.fn._PodPicker.isCreated = false

    return this;
}


/**
 * Store Internal Data
 *
 */
$.fn._PodPicker = {
    isCreated: false,
    selector : ''
}

}));