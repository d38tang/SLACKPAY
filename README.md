# U of T Hacks Slack Bot

Backend endpoints at https://slack-pay-api.herokuapp.com/:

Get transaction history with for user with id of 219 = GET /history?id=219

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
    receiverId: "24,
    amount: "7.00"
  }
  ```
