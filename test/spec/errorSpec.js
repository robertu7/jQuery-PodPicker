describe('[Pod Picker]', function() {
 
    var items = [
        {"start":    "00:00", "title": "INTRODUCTION"},
        {"start":    "07:07", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"},
        {"start":    "18:55", "title": "PICASSO AND BRAQUE 1907-12"},
        {"start":    "40:11", "title": "ICASSO, BRAQUE AND GRIS 1912-14"},
        {"start": "01:22:32", "title": "THE INFLUENCE OF CUBISM IN FRANCE 1910-14"},
        {"start": "02:04:50", "title": "CONCLUSION"}
    ]

    $('body').append('<audio></audio><div id="pp_target"></div>')

    afterEach(function() {
        $('#pp_target').removePodPicker()
    });


    /**
     * `items` parameter
     *
     */
    // `items` is `Undefined`
    it('should throw an error when the `items` is `Undefined`', function() {
        expect(function (){
            $('#pp_target').createPodPicker()
        }).toThrowError('Pod Picker: `items` parameter is required');
    });
    // `items` is not a `Array`
    it('should throw an error when the `items` is not a `Array`', function() {
        expect(function (){
            $('#pp_target').createPodPicker({})
        }).toThrowError('Pod Picker: `items` parameter must be an array')

        $('#pp_target').removePodPicker()

        expect(function (){
            $('#pp_target').createPodPicker('')
        }).toThrowError('Pod Picker: `items` parameter must be an array')
    });
    // `items` is a empty `Array`
    it('should throw an error when the `items` is a empty `Array`', function() {
        expect(function (){
            $('#pp_target').createPodPicker([])
        }).toThrowError('Pod Picker: `items` parameter cannot be an empty array')
    });
    // `items` item `start` time string is wrong format
    it('should throw an error when the `items` item `start` time string is wrong format', function() {
        expect(function (){
            var wrongStartTimeStringItems = [
                {"start": "00:00", "title": "INTRODUCTION"},
                {"start": "07:61", "title": "THE HISTORY AND CHRONOLOGY OF CUBISM"}
            ]
            $('#pp_target').createPodPicker(wrongStartTimeStringItems)
        }).toThrowError('Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format')
    });


    /**
     * `options` parameter
     *
     */
    // `options.audioElem` is not a string
    it('should throw an error when the `options.audioElem` must be a DOM Element or jQuery Object', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items, {
                audioElem: []
            })
        }).toThrowError('Pod Picker: `options.audioElem` must be a DOM Element or jQuery Object')

        $('#pp_target').removePodPicker()

        expect(function (){
            $('#pp_target').createPodPicker(items, {
                audioElem: 'pp_target'
            })
        }).toThrowError('Pod Picker: `options.audioElem` must be a DOM Element or jQuery Object')

        $('#pp_target').removePodPicker()

        expect(function (){
            $('#pp_target').createPodPicker(items, {
                audioElem: document.getElementById('pp_non-target')
            })
        }).toThrowError('Pod Picker: `options.audioElem` must be a DOM Element or jQuery Object')
    });
    // `options.timelineColor` is not a string'
    it('should throw an error when the `options.timelineColor` is not a string', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items, {
                timelineColor: ['#CECECF', '#000', '#FFF']
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a string')
    });
    // `options.isShowStartTime` is not a boolean
    it('should throw an error when the `options.isShowStartTime` is not a boolean', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items, {
                isShowStartTime: 'true'
            })
        }).toThrowError('Pod Picker: `options.isShowStartTime` must be a boolean')

        $('#pp_target').removePodPicker()

        expect(function (){
            $('#pp_target').createPodPicker(items, {
                isShowStartTime: ['true']
            })
        }).toThrowError('Pod Picker: `options.isShowStartTime` must be a boolean')
    });
    // `options.timelineColor` is not a hex color'
    it('should throw an error when the `options.timelineColor` is not a hex color', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items, {
                timelineColor: '#0000'
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a hex color')

        $('#pp_target').removePodPicker()

        expect(function (){
            $('#pp_target').createPodPicker(items, {
                timelineColor: 'red'
            })
        }).toThrowError('Pod Picker: `options.timelineColor` must be a hex color')
    });


    /**
     * Pod Picker create repeatedly
     *
     */
    it('should throw an error if Pod Picker has been created', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items)
        }).not.toThrowError();

        expect(function (){
            $('#pp_target').createPodPicker(items)
        }).toThrowError('Pod Picker already exists');
    });


     /**
      * Pod Picker remove on the wrong jQuery Object
      *
      */
    it('should throw an error if Pod Picker remove on the wrong jQuery Object', function() {
        expect(function (){
            $('#pp_target').createPodPicker(items)
        }).not.toThrowError();

        expect(function (){
            $().removePodPicker(items)
        }).toThrowError('Pod Picker: Did you mean `$("#pp_target").removePodPicker()` ?');
    });
});