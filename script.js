document.addEventListener('DOMContentLoaded', () => {
    const player1TimerEl = document.getElementById('player1-timer');
    const player2TimerEl = document.getElementById('player2-timer');
    const player1TimeDisplay = player1TimerEl.querySelector('.time-display');
    const player2TimeDisplay = player2TimerEl.querySelector('.time-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timeButtons = document.querySelectorAll('.time-btn'); // 시간 선택 버튼들

    let initialTime = 10 * 60; // 기본 10분 (초 단위), 이제 이 변수가 변경됩니다.
    let player1Time = initialTime;
    let player2Time = initialTime;
    let currentPlayer = null;
    let timerInterval = null;
    let isPaused = true;

    // 시간을 MM:SS 형식으로 포맷하는 함수
    function formatTime(seconds) {
        if (seconds < 0) seconds = 0; // 음수가 되는 것을 방지
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // 화면에 시간을 업데이트하고 시간 초과를 처리하는 함수
    function updateDisplay() {
        player1TimeDisplay.textContent = formatTime(player1Time);
        player2TimeDisplay.textContent = formatTime(player2Time);

        // 플레이어 1 시간 초과 처리
        if (player1Time <= 0) {
            player1TimerEl.classList.add('time-up');
            player1TimeDisplay.textContent = "00:00"; // 정확히 00:00 표시
            // P1 시간이 0이 되고, P2 시간이 0이 아니면 게임 종료 처리
            if (player2Time > 0 && timerInterval !== null) { // timerInterval이 활성화되어 있을 때만
                pauseTimer(); // 타이머 정지
                startPauseBtn.textContent = "종료";
                startPauseBtn.disabled = true; // 버튼 비활성화
            }
        } else {
            player1TimerEl.classList.remove('time-up');
        }

        // 플레이어 2 시간 초과 처리
        if (player2Time <= 0) {
            player2TimerEl.classList.add('time-up');
            player2TimeDisplay.textContent = "00:00"; // 정확히 00:00 표시
            // P2 시간이 0이 되고, P1 시간이 0이 아니면 게임 종료 처리
            if (player1Time > 0 && timerInterval !== null) { // timerInterval이 활성화되어 있을 때만
                pauseTimer(); // 타이머 정지
                startPauseBtn.textContent = "종료";
                startPauseBtn.disabled = true; // 버튼 비활성화
            }
        } else {
            player2TimerEl.classList.remove('time-up');
        }

        // 두 플레이어 모두 0초가 되면 완전히 종료 처리
        if (player1Time <= 0 && player2Time <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            isPaused = true;
            startPauseBtn.textContent = "종료";
            startPauseBtn.disabled = true;
        }
    }

    // 타이머 시작 함수
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        isPaused = false;
        startPauseBtn.textContent = "일시정지";
        startPauseBtn.disabled = false;

        if (!currentPlayer) return;

        timerInterval = setInterval(() => {
            if (currentPlayer === 'player1' && player1Time > 0) {
                player1Time--;
            } else if (currentPlayer === 'player2' && player2Time > 0) {
                player2Time--;
            }
            updateDisplay();
        }, 1000);
    }

    // 타이머 일시정지 함수
    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        startPauseBtn.textContent = "계속";
    }

    // 턴 전환 함수
    function switchTurn(nextPlayer) {
        // 이미 게임이 종료되었거나 버튼이 비활성화된 상태에서는 턴 전환 안함
        if (player1Time <= 0 || player2Time <= 0 || startPauseBtn.disabled) {
             return;
        }

        // 일시정지 상태에서 '계속' 버튼이 아닌 타이머 영역 클릭으로 턴 전환을 막음
        if (isPaused && timerInterval === null && startPauseBtn.textContent === "계속") {
            return;
        }

        // 현재 턴인 플레이어의 타이머 영역을 다시 클릭해도 턴이 바뀌지 않도록 방지
        if (currentPlayer === nextPlayer && !isPaused) {
            return;
        }

        currentPlayer = nextPlayer;

        // 활성 플레이어 시각적 표시 업데이트
        if (currentPlayer === 'player1') {
            player1TimerEl.classList.add('active');
            player2TimerEl.classList.remove('active');
        } else {
            player2TimerEl.classList.add('active');
            player1TimerEl.classList.remove('active');
        }

        // 턴 전환과 동시에 해당 플레이어의 타이머를 시작 (단, 이미 종료된 상태가 아니라면)
        if (player1Time > 0 && player2Time > 0) {
            startTimer();
        }
    }

    // 타이머 초기화 함수 (재설정 버튼 및 시간 선택 버튼에서 사용)
    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        player1Time = initialTime; // 선택된 initialTime으로 초기화
        player2Time = initialTime; // 선택된 initialTime으로 초기화
        currentPlayer = null;
        startPauseBtn.textContent = "시작";
        startPauseBtn.disabled = false;
        player1TimerEl.classList.remove('active', 'time-up');
        player2TimerEl.classList.remove('active', 'time-up');
        updateDisplay();
    }

    // 초기 설정: 페이지 로드 시 초기 시간 표시 및 10분 버튼 선택 상태로
    updateDisplay();
    // 초기 10분 버튼을 선택된 상태로 만듭니다. (data-time="600"은 10분)
    const initialSelectedButton = document.querySelector('.time-btn[data-time="600"]');
    if (initialSelectedButton) {
        initialSelectedButton.classList.add('selected');
    }


    // --- 이벤트 리스너 ---

    // 시작/일시정지 버튼 클릭 이벤트
    startPauseBtn.addEventListener('click', () => {
        if (isPaused) {
            if (!currentPlayer) { // 게임이 처음 시작될 때
                switchTurn('player1');
            } else { // 일시정지 후 '계속'을 눌렀을 때
                startTimer();
            }
        } else { // 타이머 실행 중일 때 (일시정지)
            pauseTimer();
        }
    });

    // 재설정 버튼 클릭 이벤트
    resetBtn.addEventListener('click', resetTimer);

    // 플레이어 타이머 영역 클릭 이벤트
    player1TimerEl.addEventListener('click', () => switchTurn('player2'));
    player2TimerEl.addEventListener('click', () => switchTurn('player1'));

    // 시간 선택 버튼 클릭 이벤트
    timeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // 게임이 진행 중일 때는 시간 변경을 막습니다.
            if (!isPaused && timerInterval !== null) {
                alert('게임이 진행 중일 때는 시간을 변경할 수 없습니다. 재설정 후 변경해주세요.');
                return;
            }

            // 모든 버튼에서 'selected' 클래스 제거
            timeButtons.forEach(btn => btn.classList.remove('selected'));
            // 클릭된 버튼에 'selected' 클래스 추가
            event.target.classList.add('selected');

            // data-time 속성에서 시간(초)을 가져와 initialTime에 설정
            initialTime = parseInt(event.target.dataset.time, 10);
            resetTimer(); // 시간 변경 후 타이머 재설정
        });
    });
});