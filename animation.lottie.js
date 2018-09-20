ScrollMagic.Scene.extend(function () {
    var Scene = this,
        _lottie;

    var log = function () {
        if (Scene._log) { // not available, when main source minified
            Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
            Scene._log.apply(this, arguments);
        }
    };

    // set listeners
    Scene.on("progress.plugin_lottie", function () {
        updateLottieProgress();
    });
    Scene.on("destroy.plugin_lottie", function (e) {
        Scene.removeLottie(e.reset);
    });

    /**
     * Update the lottie progress to current position.
     * @private
     */
    var updateLottieProgress = function () {
        if (_lottie) {
            var
            progress = Scene.progress(),
                state = Scene.state();
            if (_lottie.loop && _lottie.autoplay === true) {
                // infinite loop, so not in relation to progress
                if (state === 'DURING' && _lottie.isPaused) {
                    _lottie.play();
                } else if (state !== 'DURING' && !_lottie.isPaused) {
                    _lottie.pause();
                }
            } else if (progress != _lottie.currentFrame ) { // do we even need to update the progress?
                // no infinite loop - so should we just play or go to a specific point in time?
                if (Scene.duration() === 0) {
                    // play the animation
                    if (progress > 0) { // play from 0 to 1
                        _lottie.play();
                    } else { // play from 1 to 0
                        _lottie.setDirection(-1).play();
                    }
                } else {
                    if( progress < 1){
                        // go to a specific point in time
                        _lottie.goToAndStop(progress*_lottie.totalFrames, true);
                    }
                }
            }
        }
    };


    Scene.setLottie = function (LottieObject, duration, params) {
        LottieObject.stop();
        if (arguments.length > 1) {
            if (arguments.length < 3) {
                params = duration;
                duration = 1;
            }
        }
        if (_lottie) { // kill old tween?
            Scene.removeLottie();
        }
        _lottie = LottieObject;

        log(3, "added lottie");

        updateLottieProgress();
        return Scene;
    };

    Scene.removeLottie = function (reset) {
        if (_lottie) {
            if (reset) {
                _lottie.goToAndStop(20, true).pause();
            }
            _lottie.destroy();
            _lottie = undefined;
            log(3, "removed _lottie (reset: " + (reset ? "true" : "false") + ")");
        }
        return Scene;
    };
});
