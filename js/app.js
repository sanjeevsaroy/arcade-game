/*
*
* Character Selection
*
*/
let selectedCharacter = $('.character.selected');

// Allow the player to select their desired character
$('.character').click(function() {
    var elem = $(this);

    if (!elem.hasClass('selected')) {
      // Change the selected character
      selectedCharacter.removeClass('selected');
      elem.addClass('selected');

      // Load the new character image
      selectedCharacter = elem;
      var resource = elem.attr('src');
      player.sprite = resource;
    }
});


/*
*
* Game Board
*
*/
let xStartingPositions = [0, 101, 202, 303, 404];
let yStartingPositions = [53, 136, 219];

// Generate a random position on the y-axis for an enemy
var getRandomYPosition = function() {
    return yStartingPositions[Math.floor(Math.random() * yStartingPositions.length)];
};

// Enemies our player must avoid
var Enemy = function(yPosition) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = (yPosition !== undefined) ? yPosition : getRandomYPosition();
    this.speed = getRandomSpeed();
};

// Generate a random number for the enemy's speed
var getRandomSpeed = function() {
    return Math.floor(Math.random() * 500) + 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Reset the enemy position if outside the board ans assign new speed
    if (this.x <= 707) {
      this.x += (this.speed * dt);
    }
    else {
      this.x = -101;
      this.speed = getRandomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 385;
    this.hasCollided = false;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {
  // Reset the scores and the player position if they've collided with the enemy
  if (player.hasCollided) {
    setWins(0);
    setGems(0);

    this.x = 202;
    this.y = 385;
    player.hasCollided = false;
  }

  // If the player has reached the water, they've won
  if (player.y === -30) {
    console.log("You've won!");

    setWins(++currentWins);

    this.x = 202;
    this.y = 385;
  }
}

// Carry out the input if the character won't go off the board
Player.prototype.handleInput = function(keypress) {

    switch (keypress) {

      case 'left':
        if (this.x !== 0) {
          this.x -= 101;
        }
        break;

      case 'up':
        if (this.y !== -30) {
          this.y -= 83;
        }
        break;

      case 'right':
        if (this.x !== 404) {
          this.x += 101;
        }
        break;

      case 'down':
        if (this.y !== 385) {
          this.y += 83;
        }
        break;
    }
};

// A Gem class that the user can collect as an additional challenge
var Gem = function() {
    this.sprite = 'images/Gem Orange.png'
    this.setRandomPosition();
}

// Position the gem anywhere on the board
Gem.prototype.setRandomPosition = function() {
    this.x = xStartingPositions[Math.floor(Math.random() * xStartingPositions.length)];
    this.y = yStartingPositions[Math.floor(Math.random() * yStartingPositions.length)];
}

// If collected, move to a new random position
Gem.prototype.update = function() {
    if (player.x === gem.x && player.y === gem.y) {
      setGems(++currentGems);
      gem.setRandomPosition();
    }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*
*
* Game Scores
*
*/
let currentWins = 0;
let currentGems = 0;
let totalWins = 0;
let totalGems = 0;

// Set the wins of the game
var setWins = function(num) {
  currentWins = num;
  $('.current-wins').text(currentWins);

  // Set a new high score if beaten
  if (currentWins > totalWins) {
    totalWins = currentWins;
    $('.highest-wins').text(totalWins);
  }
}

// Set the gems collected
var setGems = function(num) {
  currentGems = num;
  $('.current-gems').text(currentGems);

  // Set a new high score if beaten
  if (currentGems > totalGems) {
    totalGems = currentGems;
    $('.highest-gems').text(totalGems);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Assign the first 3 enemies to each row on the board, then randomise
// Place the player object in a variable called player
// Place the gem object in a variable called gem
let allEnemies = [];
for (var i = 0; i < 5; i++) {
    var yPosition = (i < yStartingPositions.length) ? yStartingPositions[i] : getRandomYPosition();
    var enemy = new Enemy(yPosition);
    allEnemies.push(enemy);
}

let player = new Player();
let gem = new Gem();
