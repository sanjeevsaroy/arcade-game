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
let wins = 0;
let yStartingPositions = [53, 136, 219];
let xStartingPositions = [0, 101, 202, 303, 404];

// Generate a random starting position for an enemy
var getRandomStartingPosition = function() {
    let x = -101;
    let y = yStartingPositions[Math.floor(Math.random() * yStartingPositions.length)];

    return {
      x: x,
      y: y
    };
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    let startingPosition = getRandomStartingPosition();
    this.x = startingPosition.x;
    this.y = startingPosition.y;
    this.speed = Math.floor(Math.random() * 500) + 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Reset the enemy position if outside the board
    if (this.x <= 505) {
      this.x += (this.speed * dt);
    }
    else {
      this.x = -101;
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
  // Reset the player position if they've collided with the enemy
  if (player.hasCollided) {
    // Reset the wins
    setWins(0);

    // Reset the player position
    this.x = 202;
    this.y = 385;
    player.hasCollided = false;
  }

  // If the player has reached the water, they've won
  if (player.y === -30) {
    console.log("You've won!");

    // Increment the wins
    setWins(++wins);

    // Reset the player position
    this.x = 202;
    this.y = 385;
  }
}

// Set the wins of the game
var setWins = function(num) {
  wins = num;
  $('.wins').text(wins);
}

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

// Gems that the user can collect
var Gem = function() {
    this.sprite = 'images/Gem Orange.png'
    this.setRandomPosition();
}

// Move the gem to a random position
Gem.prototype.setRandomPosition = function() {
    this.x = xStartingPositions[Math.floor(Math.random() * xStartingPositions.length)];
    this.y = yStartingPositions[Math.floor(Math.random() * yStartingPositions.length)];
}

Gem.prototype.update = function() {
    // Remove the gem if the player collides with it
    if (player.x === gem.x && player.y === gem.y) {
      gem.setRandomPosition();
    }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (var i = 0; i < 4; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

let player = new Player();
let gem = new Gem();


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
