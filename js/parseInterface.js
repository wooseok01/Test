function parseInterface(objectId){
    Parse.$ = jQuery
    Parse.initialize('bynou4r1SUrprnR5BQ0IXUn3DBDgBFZr4VQsmuzz',
                     'Ax9RtVUOJccuyMb0E6w2RE5V5VuxP5IGd1chbCU6')

    var _extractYTId = function (url) {
        if (!url || url.indexOf('youtu') < 0) return null
        url = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/.exec(url)
        return url && url[1]
    }

    var getRecordMetaData = function (cb) {
        var id = {}
        var json = {
            objectId: objectId
        }
        var classObject = {
            record:      Parse.Object.extend('Record'),
            alleysVideo: Parse.Object.extend('AlleysVideo'),
            subtitle:    Parse.Object.extend('Subtitle'),
            user:        Parse.Object.extend('User')
        }

        if (!objectId) {
            cb(new Error('Invalid objectId(' + objectId + ')'))
            return
        }

        async.waterfall([
            function (callback){
                var query = new Parse.Query(classObject.record)

                query.equalTo('objectId', objectId)
                query.select('objectId', 'alleysVideo', 'description', 'subtitle', 'youtubeUrl',
                             'photo', 'title', 'owner','pdf')

                query.find({
                    success: function (object) {
                        if (!object[0]) {
                            callback(new Error('record('+objectId+') not found'))
                            return
                        }

                        id.alleysId = object[0].get('alleysVideo').id
                        id.subtitleId = object[0].get('subtitle').id
                        id.ownerId = object[0].get('owner').id

                        if (!id.alleysId || !id.subtitleId || !id.ownerId) {
                            callback(new Error('record('+objectId+') is invalid'))
                            return
                        }

                        json.title = object[0].get('title')
                        json.description = object[0].get('description')
                        json.pdfUrl = object[0].get('pdf') && object[0].get('pdf')._url

                        callback(null)
                    },
                    error: function (err) {
                        callback(err)
                    }
                })
            }
        ],
        function (err) {
            async.parallel([
                function (callback) {
                    var query = new Parse.Query(classObject.alleysVideo)

                    query.equalTo('objectId', id.alleysId)
                    query.select('youtubeUrl')
                    query.find({
                        success: function (object) {
                            if (!object[0]) {
                                callback(new Error('alleysVideo('+id.alleysId+') not found'))
                                return
                            }

                            json.youtubeUrl = object[0].get('youtubeUrl')
                            json.youtubeId = _extractYTId(json.youtubeUrl)
                            if (!json.youtubeId) {
                                callback(new Error('invalid youtubeUrl('+json.youtubeUrl+
                                                   ') from alleysVideo('+id.alleysId+')'))
                                return
                            }
                            callback(null)
                        },
                        error: function (err) {
                            callback(err)
                        }
                    })
                },
                function (callback) {
                    var query = new Parse.Query(classObject.subtitle)

                    query.equalTo('objectId', id.subtitleId)
                    query.select('alleys', 'youtube')
                    query.find({
                        success: function (object) {
                            var url

                            if (!object[0]) {
                                callback(new Error('subtitle('+id.subtitleId+') not found'))
                                return
                            }

                            url = object[0].get('alleys')._url

                            if (!url) {
                                callback(new Error('invalid alleys._url('+url+') from subtitle('+id.subtitleId+')'))
                                return
                            }

                            $.ajax({
                                url:      object[0].get('alleys')._url,
                                dataType: 'json',
                                success: function (data) {
                                    json.subtitle = data
                                    callback(null)
                                },
                                error: function (err) {
                                    callback(err)
                                }
                            })
                        },
                        error: function (err) {
                            callback(err)
                        }
                    })
                },
                function (callback) {
                    var query = new Parse.Query(classObject.user)

                    query.select('objectId', 'name', 'photo')
                    query.equalTo('objectId', id.ownerId)
                    query.find({
                        success: function (object) {
                            var url

                            if (!object[0]) {
                                callback(new Error('user('+id.ownerId+') not found'))
                                return
                            }

                            json.username = object[0].get('name')
                            json.photo = object[0].get('photo') && object[0].get('photo')._url
                            callback(null)
                        },
                        error: function (err) {
                            callback(err)
                        }
                    })
                }
            ],
            function (err) {
                cb(err, json)
            })
        })
    }

    return {
        getRecordMetaData : getRecordMetaData
    }
}

// end of parseInterface.js
