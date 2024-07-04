
# Contest Reminder Discord Bot

This repository contains code for building a Discord Bot which keeps you updated on upcoming programming contests and sets reminders for specific contests chosen by you.

## Features

- Fetches upcoming programming contests from Clist API
- Displays a list of upcoming contests
- Allows users to set reminders for specific contests
- Sends reminder notifications 30 minutes before the contest starts

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/contest-reminder-bot.git
    cd contest-reminder-bot
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory with the following content:

    ```env
    DISCORD_TOKEN=your_discord_bot_token
    CLIST_API_KEY=your_clist_api_key
    CLIST_USERNAME=your_clist_username
    ```

4. **Run the bot**:

    ```bash
    node index.js
    ```

## Usage

1. **Invite the bot to your Discord server**:
   - Use the OAuth2 URL generator from the Discord Developer Portal to invite the bot with the necessary permissions (`MESSAGE_READ`, `MESSAGE_WRITE`).

2. **Commands**:
   - `!contests`: Fetches and displays a list of upcoming programming contests.
   - Reply with the numbers of the contests you want to set reminders for, separated by commas (e.g., `1,3,5`).

### Example

1. **Fetch upcoming contests**:
   - User: `!contests`
   - Bot:
     ```
     Upcoming Contests:
     **1**. Event: ProjectEuler+
     Host: hackerrank.com
     URL: https://hackerrank.com/contests/projecteuler
     Start: 2014-07-07T15:38:00
     End: 2024-07-30T18:30:00

     **2**. Event: Szkolne Mistrzostwa W Programowaniu
     Host: spoj.com
     URL: https://www.spoj.com/SMWP/
     Start: 2016-03-19T00:00:00
     End: 2025-01-01T00:00:00

     ... more contests ...

     Reply with the numbers of the contests you want to set reminders for, separated by commas (e.g., 1,3,5).
     ```

2. **Set reminders**:
   - User: `1,3,5`
   - Bot: `Reminders set for contests: ProjectEuler+, LQDNTDIV1, WEEK17_2 DYNAMIC`

## Contributing

Feel free to submit issues and pull requests to contribute to the project.


