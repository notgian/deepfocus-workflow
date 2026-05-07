function setTimer(time) {
    const acceptedTimes = [20, 30, 50]

    if (!acceptedTimes.find(x => x == time))
        return console.log(`Cannot set time to ${time}. Valid times: ${acceptedTimes.join(', ')}`)

    const setTimeElms = {
        20: document.querySelector('.set-time-20'),
        30: document.querySelector('.set-time-30'),
        50: document.querySelector('.set-time-50') 
    }

    for (let key of Object.keys(setTimeElms)) {
        if (key == time) {
            setTimeElms[time].classList.add('active');
        } else {
            setTimeElms[key].classList.remove('active');
        }
    }

    const timer = document.querySelector('.timer-display')
    timer.setAttribute('data-selected-time', time)
    timer.setAttribute('data-timer-minutes', time)
    timer.setAttribute('data-timer-seconds', 0)
    timer.setAttribute('data-timer-paused', false)
    updateTimerDisplay()
}

function timerStartStop() {
    const controls = document.querySelector('.timer-controls');
    const timerState = controls.getAttribute('data-timer');
    const startStop = document.querySelector('.timer-start-stop');

    // Start the timer
    if (timerState == 'start') {
        timerStart();
        controls.setAttribute('data-timer', 'stop');
        startStop.innerHTML = '<i class="fa-solid fa-stop"></i>Stop'
    } 
    // Stop the timer
    else {
        timerStop();
        controls.setAttribute('data-timer', 'start');
        startStop.innerHTML = '<i class="fa-solid fa-play"></i>Start'
    }
}

function timerStart() {
    const timer = document.querySelector('.timer-display')
    const controls = document.querySelector('.timer-controls');
    
    if (timer.getAttribute('data-timer-paused') == 'true')
        toggleTimerPause();
    disableSetTimer();

    const timerInterval = window.setInterval(() => {
        let paused = timer.getAttribute('data-timer-paused')
        let minutes = Number(timer.getAttribute('data-timer-minutes'))
        let seconds = Number(timer.getAttribute('data-timer-seconds'))

        let timerState = controls.getAttribute('data-timer');

        if (paused == 'true')
            return

        // timer ended
        if (timerState == 'start') {
            clearInterval(timerInterval)
            return
        }
        // end timer
        else if (seconds == 0 && minutes == 0) {
            timerStartStop()
            clearInterval(timerInterval)
            alert('Focus timer up!')
            return
        } 
        // calculate new time
        else if (seconds == 0) {
            seconds = 59;
            minutes -= 1;
        } else {
            seconds -= 1;
        }

        // update timer
        timer.setAttribute('data-timer-minutes', minutes)
        timer.setAttribute('data-timer-seconds', seconds)
        updateTimerDisplay()
    }, 1)
}

function timerStop() {
    const timer = document.querySelector('.timer-display')
    if (timer.getAttribute('data-timer-paused') == 'true')
        toggleTimerPause();

    enableSetTimer();
    const newMins = timer.getAttribute('data-selected-time')
    timer.setAttribute('data-timer-minutes', newMins)
    timer.setAttribute('data-timer-seconds', 0)
    updateTimerDisplay()
}

function toggleTimerPause() {
    // <button class="timer-buttons btn-outline timer-pause">
    const timer = document.querySelector('.timer-display');
    const paused = timer.getAttribute('data-timer-paused');

    const timerPause = document.querySelector('.timer-pause');

    if (paused == 'true') {
        timerPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pause'
        timer.setAttribute('data-timer-paused', 'false');
    } else {
        timerPause.innerHTML = '<i class="fa-solid fa-pause"></i> Unpause'
        timer.setAttribute('data-timer-paused', 'true');
    }

    console.log(timer.getAttribute('data-timer-paused'))
}

function updateTimerDisplay() {
    const timer = document.querySelector('.timer-display')

    const minutes = timer.getAttribute('data-timer-minutes')
    const seconds = timer.getAttribute('data-timer-seconds')

    const timerText = timer.querySelector('.time-text')
    timerText.querySelector('h2').innerText = `${minutes.padStart(2,0)}:${seconds.padStart(2,0)}`
}


function disableSetTimer(time) {
    document.querySelector('.set-time-20').disabled = true;
    document.querySelector('.set-time-30').disabled = true;
    document.querySelector('.set-time-50').disabled = true;
}

function enableSetTimer(time) {
    document.querySelector('.set-time-20').disabled = false;
    document.querySelector('.set-time-30').disabled = false;
    document.querySelector('.set-time-50').disabled = false;
}
