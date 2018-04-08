Cryptogateway
---

Crypto-powered Website Paywalls

Prototype Built for the the Crypto 4 Your Thoughts hackathon.

### Concept

Cryptogateway is a free website plugin which wraps any of your desired content around a custom-priced cryptocurrency paywall.

For each customer, an account will automatically be generated which will store any funds sent to you by your website visitors. Each customer will be mapped to a unique address which is used to verify whether they have paid for website access or not. Once the user has paid, he or she will automatically be granted access to the content.

Steps for install:
<ol>
    <li>Create account on Cryptogateway.com - registering your domain name.
    <li>Install dependencies within <i>Paywall.js</i></li>
    <li>Wrap your sensitive website content with the Paywall.js component (adding the appropriate payment options).</li>

</ol>

### Structure
* <b>/cryptogateway</b>: website
* <b>/server</b>: Lotion/Cosmos server - used for tracking IP address visits

### Dev Notes

Starting the website.<br/>

From the */cryptogateway* folder:
<pre>
yarn && yarn start
</pre>

Starting the server.
From the */server* folder:
<pre>
yarn && node server.js
</pre>