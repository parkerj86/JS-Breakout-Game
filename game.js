
	<script>

		var canvas = document.getElementById("myCanvas");
		var levelBox = document.getElementById("level");
		var livesBox = document.getElementById("lives");
		var currentLevel = 1;
		var ctx = canvas.getContext("2d");
		var ballPosX = canvas.width/4;
		var ballPosY = canvas.height-350;
		var dx = 0;
		var dy = 1;
		var ballRadius = 7;
		var ballBounceRadius = 25;
		var paddleHeight = 5;
		var paddleWidth = 90;
		var paddlePosY = canvas.height-20;
		var paddlePosX = 400;
		var rightPressed = false;
		var leftPressed = false;
		var score = 0;
		var scoreboard = document.getElementById('scoreboard');
		var nextLevel = false;
		var test = "it works";
		var counter = 10;
		var lives = 3;

	//BLOCK VARIABLES
		var blockTotal = 21;
		var blockRowCount = 7;
		var blockColumnCount = 3;
		var blockWidth = 90;
		var blockHeight = 15;
		var blockPadding = 10;
		var blockOffSetTop = 50;
		var blockOffSetLeft = 90;
		var blocks = [];
	
	//BLOCK ROW/COLUMN COUNTER	Sets initial coordinates
		var coordinateLoop = function (){
			for (c=0; c<blockColumnCount; c++)	{
				blocks[c] = [];
				for (r=0; r<blockRowCount; r++)	{
					blocks[c][r] = {
						x: 0,
						y: 0,
						status: 1
					};
				}
			}
		};
		coordinateLoop();

	//BLOCK MAKER FUNCTION
		function drawBlocks() {
			for (c=0; c<blockColumnCount; c++)	{
				for (r=0; r<blockRowCount; r++) {
					if (blocks[c][r].status === 1)	{
						var blockX = (r*(blockWidth+blockPadding) + blockOffSetLeft);
						var blockY = (c*(blockHeight+blockPadding) + blockOffSetTop);
						blocks [c][r].x = blockX;
						blocks [c][r].y = blockY;
						ctx.beginPath();
						ctx.rect(blockX, blockY, blockWidth, blockHeight);
						ctx.fillStyle = "blue";
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}

	//BALL FUNCTION
		function drawBall()	{
			ctx.beginPath();
			ctx.arc(ballPosX, ballPosY, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
		}

	//PADDLE FUNCTION
		function drawPaddle()	{
			ctx.beginPath();
			ctx.rect(paddlePosX, paddlePosY, paddleWidth, paddleHeight);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath;
			
		}

	//DRAW CANVAS FUNCTION
		function draw()	{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			scoreboard.innerHTML = score;
			drawBlocks();
			drawPaddle();
			drawBall();
			collisionDetect();
			ballPosX += dx;
			ballPosY += dy;
		//LOGIC FOR BOUNCING BALL
			if(ballPosX + dx > canvas.width-ballRadius || ballPosX + dx < ballRadius) {
        		dx = -dx;
    		}
		    if(ballPosY + dy < ballRadius) {
		        dy = -dy;
		    }
    		else if(ballPosY + dy > canvas.height-ballBounceRadius) {
    			if(ballPosX > paddlePosX && ballPosX < paddlePosX + paddleWidth) {
    				var ballPaddleDiff = ballPosX-paddlePosX;
    				if (ballPaddleDiff>36.75 && ballPaddleDiff<53.25)	{
    					dx = 0;
    					dy = 1.2;
    				}
    				if (ballPaddleDiff>53.25 && ballPaddleDiff<64)	{
    					dx = .8;
    					dy = 1;
    				}
    				if (ballPaddleDiff>64 && ballPaddleDiff<75)	{
    					dx = 1;
    					dy = 1;
    				}
    				if (ballPaddleDiff>75 && ballPaddleDiff<90) {
    					dx = 1.5;
    					dy = 1;
    				}
    				if (ballPaddleDiff<36.75 && ballPaddleDiff>24.5)	{
    					dx = -.8;
    					dy = 1;
    				}
    				if (ballPaddleDiff<24.5 && ballPaddleDiff>14.5)	{
    					dx = -1.2;
    					dy = 1;
    				}
    				if (ballPaddleDiff<14.5)	{
    					dy = 1;
    					dx = -1.5;
    				}
    			}
	       		if(ballPosX > paddlePosX && ballPosX < paddlePosX + paddleWidth) {
	            	dy = -dy;
	       		}	else 	{
	       			dy = -dy;
		          	lives -= 1;
		          	livesBox.innerHTML = ("lives " + lives);
		           	if (lives === -1)	{
		           		livesBox.innerHTML = ("lives " + 0);
		           		alert("GAMEOVER!!");
		           		document.location.reload();
		           	}
	        	}
    		}
    	//LOGIC FOR MOVING PADDLE
		    if(rightPressed && paddlePosX < canvas.width-paddleWidth) {
		        paddlePosX += 5;
		    }
		    else if(leftPressed && paddlePosX > 0) {
		        paddlePosX -= 5;
		    }
		    ballPosX += dx;
		    ballPosY += dy;
			}	

	//EVENT HANDLER FOR PADDLE KEYS
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		function keyDownHandler(keypressed)	{
			if (keypressed.keyCode === 39)	{
				rightPressed = true;
			}
			else if (keypressed.keyCode === 37)	{
				leftPressed = true;
			}
		}

		function keyUpHandler(keypressed)	{
			if (keypressed.keyCode === 39)	{
				rightPressed = false;
			}
			else if (keypressed.keyCode === 37)	{
				leftPressed = false;
			}
		}

		//COLLISION
		function collisionDetect()	{
			for (c=0; c<blockColumnCount; c++)	{
				for (r=0; r<blockRowCount; r++)	{
					var b = blocks [c][r];
					if (b.status === 1)	{
						if (ballPosX > b.x && ballPosX < b.x + blockWidth && ballPosY > b.y && ballPosY < b.y + blockHeight) {
							dy = -dy;
							b.status = 0;
							score += 5;
							blockTotal -= 1;
							if (blockTotal === 0)	{
								setTimeout(function gameWinner() {
								var r = confirm('You Won!! Continue on to the next level!');
								if (r == false)	{
									alert("Goodbye! Thanks for playing!")
								}
								}, 10);
								nextLevel = true;
								currentLevel += 1;
								levelHandler();
							}
						}
					}
				}
			}
		}	

	//TAKES PLAYER TO NEXT LEVEL AND RESTORES SOME VARIABLES
		function levelHandler()	{
			if (nextLevel) {
				draw();
				ballPosX = canvas.width/2;
				ballPosY = canvas.height-30;
				paddlePosY = canvas.height-20;
				paddlePosX = 400;
				coordinateLoop();
				blockTotal = 21;
				counter += 40;
				levelBox.innerHTML = ('Level ' + currentLevel);
				startGame();
			}	
		}

	function startGame() {
		gameMenu.style.display = 'none';
		var intervalFunction = function() {
			clearInterval(interval);
			var interval = setInterval(draw, counter);
		}
		intervalFunction();
	}

	drawBlocks();
	drawPaddle();
	drawBall();

	</script>
