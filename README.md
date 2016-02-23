# tic tac toe

## Hosted on github pages

  [Andrew Palmer - Tic Tac Toe](http://apalmer0.github.io/tictactoe/index.html)

## Mockup

  ![Mockup](assets/images/mockup.JPG?raw=true)

## About

-   This project is a basic tic-tac-toe game, with a few extra bells and
    whistles. First, there's a sign in page, which is modeled after a lot of the
    bootstrap signin pages that i've seen on other sites and wanted to mimic.
    This includes the little 3-column section down below the hero image. The
    content isn't really relevant - I was just going for the structure. Signing
    in and loggin in both seem pretty intuititve, with buttons that pull up
    modals for either scenario. Once logged in, those buttons are replaced by
    buttons that are only needed for logged-in users.

    The logged in experience allows users to play a simple game as much as they
    want, with a tracker for wins from both X and O, as well as ties. There's
    even a stupid little progress bar to visualize the share of wins from each
    player (or ties). From the navbar you can create a multiplayer game
    ('deathmatch'), which creates a new game and shows the user the id they need
    to share with their counterpart, who can enter that number by clicking the
    'join deathmatch' button. This only allows for one multiplayer game at a
    time, which seems unfortunate. Finally, you can see a list of all old games
    (finished and unfinished) and choose to select to see that game on the
    board. From here the only option is to end the game and start
    a new one, which is pretty useless.

-   Things I would do with more time:

    -   Refactor my code. There's a good bit of duplication, and the code is
        admittedly pretty hard to follow in places.
    -   Improve user authentication; technically right now, a user could just
        alter the HTML in order to view the content of the page. Obviously with
        a game like this it's not a big deal, but if authentication
        actually mattered this would be a huge issue.
    -   There's a few instances I have trouble replicating in which a button
        has to be clicked twice in order to work. I don't know what's causing it
        and I haven't had a chance to track it down yet.
    -   It'd be cool if users could play more than one game against each other
        without having to go through the hoops of creating a new game and
        sharing the id with their partner. I'm not sure how you'd do that using
        the system we have in place now.

## User stories

-   A <role>, when <condition>, can <action>, which will <effect>
-   A user, when visiting the page, can log in, which will render the game board
-   A user, when signing up, can provide a username and password, which will
    save the user
-   A user, when looking at the gameboard, can click a square, which will mark
    the square and save the move.
-   A user, when linking three squares with the user's designated shape, will
    win the game.
-   The losing player, when a winning move is made, will play first in the next
    game
    winning situations
      0,0; 0,1; 0,2 top row
      1,0; 1,1; 1,2 middle row
      2,0; 2,1, 2,2 bottom row

      0,0; 1,0; 2,0 left column
      0,1; 1,1; 2,1 middle column
      0,2; 1,2; 2,2 right column

      0,0; 1,1; 2,2 topleft-bottomright
      0,2; 1,1; 2,0 topright-bottomleft

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
