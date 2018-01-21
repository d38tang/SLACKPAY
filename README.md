# U of T Hacks Slack Bot

Backend endpoints at https://slack-pay-api.herokuapp.com/:

Get transaction history with id = GET /history?id=<userid>

Add user = POST /adduser
```
  body {
    name: "Testing",
    id: "12"
  }
  ```
  
Add transaction = POST /addtransaction
```
  body {
    senderId: "12",
    transactionId: "24,
    amount: "7.00"
  }
  ```
