document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const movesCount = document.getElementById('moves-count');
    const matchesCount = document.getElementById('matches-count');
    const restartBtn = document.getElementById('restart-btn');

    const emojis = ['🐶', '🐱', '🐼', '🐨', '🦊', '🦁', '🐯', '🐸'];
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let isProcessing = false;

    function createCard(emoji) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Memory card');
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = emoji;
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = '❓';
        
        card.appendChild(front);
        card.appendChild(back);
        
        return card;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeGame() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        moves = 0;
        matches = 0;
        isProcessing = false;
        
        movesCount.textContent = moves;
        matchesCount.textContent = matches;

        // Create pairs of emojis
        const gameEmojis = [...emojis, ...emojis];
        shuffleArray(gameEmojis);

        gameEmojis.forEach((emoji, index) => {
            const card = createCard(emoji);
            cards.push(card);
            gameBoard.appendChild(card);

            card.addEventListener('click', () => handleCardClick(index));
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(index);
                }
            });
        });
    }

    async function handleCardClick(index) {
        const card = cards[index];
        
        if (isProcessing || 
            flippedCards.includes(card) || 
            card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            isProcessing = true;
            moves++;
            movesCount.textContent = moves;

            const [card1, card2] = flippedCards;
            const emoji1 = card1.querySelector('.card-front').textContent;
            const emoji2 = card2.querySelector('.card-front').textContent;

            if (emoji1 === emoji2) {
                matches++;
                matchesCount.textContent = matches;
                card1.classList.add('matched');
                card2.classList.add('matched');
                flippedCards = [];
                isProcessing = false;

                if (matches === emojis.length) {
                    setTimeout(() => {
                        alert(`Congratulations! You won in ${moves} moves!`);
                    }, 500);
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                isProcessing = false;
            }
        }
    }

    restartBtn.addEventListener('click', initializeGame);

    // Initialize the game
    initializeGame();
});
