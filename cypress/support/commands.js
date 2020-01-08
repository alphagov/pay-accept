import {authenticator} from 'otplib'
import base32Encode from 'base32-encode'

const loginIfRequired = function loginIfRequired() {
  cy.visit('https://selfservice.pymnt.uk')
  cy.location().then(loc => {
    if (loc.href.includes('login')) {
      cy.get('#username').type(Cypress.env('USERNAME'))
      cy.get('#password').type(Cypress.env('PASSWORD'))
      cy.contains('Continue').click()
      cy.url().should('include', '/otp-login')
      cy.get('#sms_code').type(authenticator.generate(base32Encode(Buffer.from(Cypress.env('OTP_SECRET')), 'RFC4648')))
      cy.contains('Continue').click()
    }
  })
}

Cypress.Commands.add("login", loginIfRequired)

Cypress.Commands.add("createApiKey", () => {
  if (!Cypress.env('API_KEY')) {
    loginIfRequired()
    cy.get('#navigation-menu-settings').click()
    cy.get('#navigation-menu-api-keys').click()
    cy.get('.generate-key').click()
    cy.get('#description').type('key description')
    cy.get('#generate-button').click()
    cy.get('#token').then(div => {
      Cypress.env('API_KEY', div.text())
    })
  }
})
