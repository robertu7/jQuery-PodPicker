# jQuery-[PodPicker](https://robermac.github.io/PodPicker)

*A Podcast Timeline Generator*

## Install
  - NPM: `npm install jquery.podpicker`
  - Bower: `bower install jquery.podpicker`
  - [jsDelivr](http://www.jsdelivr.com/#!jquery.podpicker)

## Usage
#### Getting Started
- Include the scripts and style sheets in the \<head\> section
```html
<head>
    ...
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.podpicker/latest/PodPicker.min.css">
    <script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.podpicker/latest/jquery.podpicker.min.js"></script>
</head>
```

- Create a \<div\> wrapper which will contain the Pod Picker Timeline
```html
<div id="pp-wrapper"></div>
```

- Initialization the Pod Picker
```html
<script type="text/javascript">
   $('#pp-wrapper').createPodPicker([{'start': '00:00', 'title': 'INTRODUCTION'}])
</script>
```

### Methods
- `createPodPicker(items, options)`  
  - `items` is an *`Array`* containing items. (The properties of an item are described in section **Data Format**)
  - `options` is an **optional** *`Object`* containing a name-value map with options. (described in section **Options**)

- `removePodPicker()`

  
#### Data Format
The timeline must be provided with data items, which contain the properties `start` and `title`
  - `start` is the current Section Start Time
    - type: *`String`*
    - format: 'hh:mm:ss', 'mm:ss' or 'ss'
  - `title` is the current Section Title
    - type: *`String`*

For example:
```
  var items = [
    {"start":    "00:00", "title": "INTRODUCTION"},
    {"start":    "07:07", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"},
    {"start":    "18:55", "title": "PICASSO AND BRAQUE 1907-12"},
    {"start":    "40:11", "title": "ICASSO, BRAQUE AND GRIS 1912-14"},
    {"start": "01:22:32", "title": "THE INFLUENCE OF CUBISM IN FRANCE 1910-14"},
    {"start": "02:04:50", "title": "CONCLUSION"}
  ]
```

#### Options
The following options are available.
  - `audioElem` is the audio element to interact with
    - type: *`DOM Element` | `jQuery Object`*
    - format: the default value is the first \<audio\> element of DOM
  - `timelineColor` is the timeline Section Title color
    - type: *`String`*
    - format: hex color (the default value is `#CECECF`)
  - `isShowStartTime` is to determine whether you need to show start time in front of the Section Title
    - type: *`Boolean`*
    - format: `true` or `false` (the default value is `false`)

For example:
```
  $('#pp-wrapper').createPodPicker(items, {
      "audioElem"      : $('#podcast_audio'),
      "timelineColor"  : "#F9441A",
      "isShowStartTime": true
  })
```

## Troubleshoot
#### Audio File Format
If audio file format is MP3, it's hard to accurate positioning to a specified time.

We recommend using the [AAC](https://www.wikiwand.com/en/Advanced_Audio_Coding) (.m4a) and [Ogg](https://www.wikiwand.com/en/Ogg) (.ogg) audio file format

For more details, see: [\[1\]](http://forums.codescript.in/javascript/html5-audio-currenttime-attribute-inaccurate-27606.html) and [\[2\]](https://jsfiddle.net/yp3o8cyw/2/)

For example:
```
  <audio id="podcast_audio" controls>
      <source src="your_audio_file.ogg" type="audio/ogg"> // for Chrome, Firefox 3.6+, Opera 10+
      <source src="your_audio_file.m4a" type="audio/mp4"> // for Safari, IE 9.0+
  </audio>
```
For more details, see [\[1\]](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility)

##### Audio Converter
  - Convert to AAC: [Music Converter](https://itunes.apple.com/cn/app/music-converter/id468990728?l=en&mt=12)
  - Convert to Ogg: [Total Video Converter Lite](https://itunes.apple.com/cn/app/total-video-converter-lite/id520374433?l=en&mt=12)
  - Other options: [CloudConvert](https://cloudconvert.com)

## License
[MIT](https://github.com/RoberMac/PodPicker/blob/master/LICENSE)