
// signup.spec.js
const { test, expect } = require('@playwright/test');
const MailSlurp = require('mailslurp-client').MailSlurp;
const {CodeJutelocator} = require('../locator/Locator');
const {data}  = require('../Data/data')

// Initialize MailSlurp with your API key
const mailslurp = new MailSlurp({apiKey: "2886a2ec06cd27cf938855fa0ba98af018be4f06f45851a781d0e66e88df81ec"});
test('Signup flow with email verification', async ({ page }) => {
  // Step 1: Create a new temporary email address
  const inbox = await mailslurp.createInbox();
  const tempEmail = inbox.emailAddress;
  console.log(`Temporary email created: ${tempEmail}`);

  // Step 2: Navigate to the signup page
  await page.goto('/coadjute');
  await page.waitForLoadState();

  // Step 3: Start the sign-up process
  await page.click(CodeJutelocator.signUpBtn); 

  // Step 4: Fill in the form with valid details
  await page.fill(CodeJutelocator.emailAddress, tempEmail);
  await page.click(CodeJutelocator.continueBtn);
  await page.fill(CodeJutelocator.password,data.password ); 
  await page.click(CodeJutelocator.continueBtn);

  // Step 5: Submit the form

  // Step 6: Verify that a confirmation message appears on the page
  await page.waitForSelector(CodeJutelocator.verifyMail); 

//   // Step 7: Wait for the email to arrive (up to 60 seconds)
  console.log('Waiting for the verification email...');
  const email = await mailslurp.waitForLatestEmail(inbox.id, 60000);  // 60 seconds timeout
  console.log('Verification email received!');

   // Step 8: Extract the verification link from the email content
  const verificationLink = /https?:\/\/[^\s]+/.exec(email.body || '')?.[0];
  expect(verificationLink).not.toBeNull();  // Make sure we got a valid link
  console.log(`Verification link: ${verificationLink}`);



});
