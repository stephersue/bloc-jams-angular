(function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};

          var currentAlbum = Fixtures.getAlbum();


          /**
           * @desc Buzz object audio file
           * @type {Object}
           */
          var currentBuzzObject = null;

          /**
           * @function
           * @desc Stops currently playing song and loads new audio file as currentBuzzObject
           * @param {Object} song
           */
          var setSong = function(song) {
              if (currentBuzzObject) {
                  stopSong();
              }

              currentBuzzObject = new buzz.sound(song.audioUrl, {
                  formats: ['mp3'],
                  preload: true
              });

              currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                  SongPlayer.currentTime = currentBuzzObject.getTime();
                });
              });

              currentBuzzObject.bind('ended', function() {
                $rootScope.$apply(function() {
                    SongPlayer.next();
                });
              });

              SongPlayer.currentSong = song;
           };

           /**
            * @function stopSong
            * @desc Stops currently playing song and sets song playing to null
            * @param {Object} song
            */
           var stopSong = function() {
              currentBuzzObject.stop();
              SongPlayer.currentSong.playing = null;
           }

           /**
           *   @function getSongIndex
           *   @desc gets the song index so we can then manipulate it for next and previous buttons
           *   @param {Object} song
           */
           var getSongIndex = function(song) {
                return currentAlbum.songs.indexOf(song);
            };

           /**
           * @desc Current Buzz object audio file
           * @type {Object}
           */
           SongPlayer.currentSong = null;

           /**
           * @desc Current playback time (in seconds) of currently playing song
           * @type {Number}
           */
           SongPlayer.currentTime = null;

           /**
           * @desc Current playback volume of currently playing song
           * @type {Number}
           */
           SongPlayer.volume = 60;

           /**
           * @function playSong
           * @desc Plays the currentBuzzObject and sets the property of the song Object to true
           * @param {Object} song
           */
           var playSong = function(song){
              currentBuzzObject.play();
              song.playing = true;
            }


          /**
          * @function SongPlayer.play
          * @desc Public method that takes a song object parameter. If the buzz object Song is not the same as the current
          * then a new song will load and play. If the buzz object Song is the same, and if it is paused, then the song will play.
          * @param {Object} song
          */

          SongPlayer.play = function(song) {
              song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {
                  setSong(song);
                  playSong(song);
              } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                  playSong(song);
                }
              }
          };

          /**
          * @function SongPlayer.pause
          * @desc Public method. Takes a song object parameter. Pauses the currently playing Buzz Object
          * and sets the song's 'playing' attribute to false.
          * @param {Object} song
          */
          SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
          };

          /**
          *   @function SongPlayer.previous
          *   @desc skips backward to previous song, stops playing music if song #1
          */
          SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };

          /**
          *   @function SongPlayer.next
          *   @desc skips forward to next song, stops playing music if last song
          */
          SongPlayer.next = function() {
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex++;

              if (currentSongIndex > Object.keys(currentAlbum).length) {
                  stopSong();
              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }
          };

          /**
          * @function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */
          SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
              currentBuzzObject.setTime(time);
            }
          };


          /**
          * @function setVolume
          * @desc Set current volume of currently playing song
          */
          SongPlayer.setVolume = function (volume) {
 			        if (currentBuzzObject) {
 				           currentBuzzObject.setVolume(volume);
 			        }
 			        SongPlayer.volume = volume;
 		      };

          return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
