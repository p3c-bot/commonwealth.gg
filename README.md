# p3c-bot.github.io
P3C Interface. Make sure you have Saturn Wallet installed. This can be run locally if necessary.

1. ```npm install -g live-server```
2. Run ```live-server``` from this directory.
3. Navigate to `localhost:8080/use.html`.

# Want to create a fork with a permanent Masternode?
A Masternode entitles you to 33% of the 10% community fee on buying/selling/reinvesting. You can create a **custom** branded site that funnels all ETC through your Masternode.

1. Fork this repository.
 ![fork](/doc-assets/fork.png)

1. Go to `/lib/masternode.js`
1. Replace the address in `var permanentMasternode = "0x0000000000000000000000000000000000000000"` with your crop address. This can be found for your account on the main p3c.io wallet in the reflink box. 
![crop](/doc-assets/crop.png)
1. Replace `img/logo.svg` and title in `/use.html`.
1. Replace the custom color scheme in `/css/custom.css`.
1. Turn on Github pages by going to the settings of the new forked repository.

![replace](/doc-assets/turnon.png)

You're done!

# Development tips
- I use http://remix.ethereum.org/ to deploy smart contracts
- ETC only uses 0.4.21 or below compilers.
- For a dapp fork, Copy and paste source code into Remix and then deploy.

For frontend:
- Use [farmer.html](p3c.io/farmer.html) as a template with jquery, very simple but works.
- Use [Farm](https://github.com/p3c-bot/p3c-bot.github.io/blob/master/lib/farmer.js) to understand how to connect web3 with javascript
