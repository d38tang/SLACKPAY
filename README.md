# U of T Hacks Slack Bot

Backend endpoints:

Get transaction history with id = GET /history?id=

Add user = POST /adduser 
  body {
    name:
    id: 
  }
  
Add transaction = POST /addtransaction
  body {
    senderId:
    transactionId:
    amount:
  }
