# TradeWars

## Description

TradeWars (Working Title) is a trading simulation application that aims to provide a gamified experience for users to trade stocks in games.

## Features

- Create games with a set amount of funds for each player.
- Game modifiers that create interesting parameters for players to trade by.
- Historical data trading where players can trade in different eras (1980s to present)
- Dashboard containing stock analysis tools.
- Trading AIs with distinct trading personalities to play against.
- Trading behaviors from player groups to simulate distinct market patterns.
- Federated user authentication for easy registration.

## Objectives

- Create a completely functional stock trading game and host it in the cloud.
- Separate concerns for testing, development, and production workflows.
- Automate development using a CI/CD workflow (Jenkins, Terraform, Docker... etcetera).
- Continue adding features using the CI/CD workflow.

## Libraries

- **Backend Framework:** Express.js
- **Language** TypeScript
- **Database ORM:** Sequelize
- **Testing Framework:** Mocha
- **Assertion Library:** Chai
- **Testing HTTP Client:** Supertest
- **Database:** PostgreSQL
- **Runtime:** Node.js
- **Package Manager:** npm
- **Environment Management:** dotenv
- **Middleware:** CORS, body-parser, express-validator
- **Development Tools:** Nodemon
- **Front-end** Next.js
- **UI Components** Shadcn
- **CSS Framework** Tailwind
- **Linter** ESLint

## Instructions

### Script usage

#### Database seeding

Running this command will seed the database:
```
npm run db:seed -- --userCount 20 --gameCount 20 --tradeCountMin 20 --tradeCountMax 20 --output 1
```
- TODO

## Tests

### gameRoutes

#### Game Tests

- [x] should return a list of all games
- [x] should create a new game
- [x] should return a game by ID
- [x] should update a game
- [x] should delete a game
- [x] should add a player to a game
- [x] should create a game, add players and list players
- [x] should not add a player to a full game
- [x] should not add the same player twice to a game
- [x] should create a game, add players and create trades
- [x] should declare a winner for a game
- [x] should attempt to make a trade with insufficient funds
- [ ] should return 401 if not authenticated for creating game
- [ ] should return 403 if not authorized to update game
- [ ] should return 404 when deleting non-existent game
- [ ] should handle query parameters for filtering games
- [ ] should validate game ID format
- [ ] should return 409 for duplicate game creation
- [ ] should handle pagination for getting all games
- [ ] should return 422 for missing required fields when updating

#### Trade Tests

- [ ] should list trades of a player in a game
- [ ] should make a trade selling stocks owned by player
- [ ] should attemt to make a trade with insufficient stock quantity
- [ ] should fail a trade for a stock that does not exist

### userRoutes

- [x] should get all users
- [x] should create a new user
- [x] should get a user by ID
- [x] should update a user
- [x] should delete a user
