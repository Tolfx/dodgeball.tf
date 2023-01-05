import HeaderTemplate from "./Header.template";

export default (amount = 2.5) => {
  // @ts-ignore
  return `<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
        background-color: #1A1D20;
        color: #F1FFFF;
      }
  
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
      }
  
      #stripe {
        background-color: #1A1D20;
        color: #F1FFFF;
        border: 1px solid #F1FFFF;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
      }
  
      #paypal {
        background-color: #1A1D20;
        color: #F1FFFF;
        border: 1px solid #F1FFFF;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
      }
  
      #steam {
        background-color: #1A1D20;
        color: #F1FFFF;
        border: 1px solid #F1FFFF;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
      }
  
      a {
        text-decoration: none;
        color: #F1FFFF;
      }
    </style>
  </head>
  
  <body>
    <div>
      ${HeaderTemplate()}
      <div style="text-align:center;">
        <h1>Select payment method</h1>
        <h2>! Please confirm your amount before checking out !</h2>
        <h2 id="title">Title: Supporter</h2>
        <label for="amount">Custom amount:</label>
        <input type="number" name="amount" id="amount" value="${amount}">
        <div class="container">
          <!-- Have stripe card -->
          <div id="stripe">
            <a id="click-stripe">
              Pay with credit card
            </a>
          </div>
        </div>
      </div>
    </div>
  
    <script>
      const clickStripe = document.getElementById('click-stripe');
  
      document.getElementById('amount').onchange = () => {
        const amount = document.getElementById('amount').value;
        if (parseInt(amount) >= 25)
          document.getElementById('title').innerHTML = 'Title: Patron';
        else
          document.getElementById('title').innerHTML = 'Title: Supporter';

        if (parseInt(amount) < 2.5)
          document.getElementById('amount').value = 2.5;
      };
  
      clickStripe.addEventListener('click', () => {
        const amount = document.getElementById('amount').value;
        window.location.href = '/donator/stripe?amount=' + amount;
      });
    </script>
  </body>
  
  </html>`;
};
