const fs = require('fs');
const path = require('path');
const Imap = require('imap');
const dotenv = require('dotenv');
const {
  WebhookClient
} = require('discord.js');

dotenv.config();

const MailParser = require('mailparser').simpleParser;

const processedEmailsFile = path.join(__dirname, 'processedEmails.json');

async function fetchAndSendEmails(imapConfig) {

  let processedEmails = [];

  try {
    const fileContent = fs.readFileSync(processedEmailsFile, 'utf8');
    processedEmails = JSON.parse(fileContent);
  } catch (err) {
    console.error('Error loading processed emails:', err.message);
  }

  const imap = new Imap(imapConfig);

  imap.once('ready', () => {

    imap.openBox('INBOX', true, (err) => {
      if (err) throw err;

      imap.search(['ALL'], (searchErr, results) => {
        if (searchErr) throw searchErr;

        if (results.length === 0) {
          imap.end();
          return;
        }

        //console.log('Fetched Email IDs:', results);

        processedEmails = processedEmails.filter((emailId) => results.includes(emailId));

        results.forEach((mailId) => {
          if (processedEmails.includes(mailId)) {
            return;
          }

          const fetch = imap.fetch([mailId], {
            bodies: ''
          });

          fetch.on('message', (msg) => {
            msg.once('body', (stream) => {
              let buffer = '';

              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.once('end', () => {
                MailParser(buffer, async (err, parsed) => {
                  if (err) throw err;

                  const sender = `📧 New mail from: ${parsed.from.text} 📧`;
                  const subject = parsed.subject;
                  const mailDescription = parsed.text;

                  const maxEmbedDescriptionLength = 2048;
                  const embeds = [];
                  let remainingDescription = mailDescription;

                  while (remainingDescription.length > 0) {
                    const splitDescription = remainingDescription.substring(0, maxEmbedDescriptionLength);
                    remainingDescription = remainingDescription.substring(maxEmbedDescriptionLength);

                    const title = embeds.length === 0 ? `❓ Subject: ${subject}` : `❓ Subject: ${subject} - Part ${embeds.length + 1}`;

                    embeds.push({
                      title,
                      description: splitDescription,
                      color: 0x0000ff,
                      author: {
                        name: sender,
                      },
                    });
                  }

                  const webhook = new WebhookClient({
                    id: process.env.WEBHOOKID,
                    token: process.env.WEBHOOKTOKEN
                  });
                  webhook.send({
                    content: '',
                    embeds,
                  });

                  webhook.destroy();
                  processedEmails.push(mailId);
                  fs.writeFileSync(processedEmailsFile, JSON.stringify(processedEmails), 'utf8');
                });
              });
            });
          });
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error(err);
  });

  imap.connect();
}

module.exports = {
  fetchAndSendEmails
};