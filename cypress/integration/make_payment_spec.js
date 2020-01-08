describe('Make a payment', () => {
  let nextUrl

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session', 'frontend_state', 'frontend_state_2')
  })

  before(() => {
    cy.createApiKey()
  })

  after(() => {
    cy.clearCookies()
  })

  it('Creates a payment', () => {
    cy.request({
      url: 'https://publicapi.pymnt.uk/v1/payments',
      method: 'POST',
      body: {
        amount: 100,
        description: 'Payment description',
        reference: 'Payment reference',
        return_url: 'https://www.pymnt.uk'
      },
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${Cypress.env('API_KEY')}`
      }
    }).then(response => {
      nextUrl = response.body._links.next_url.href
    })
  })

  it("Submits card details", () => {
    cy.visit(nextUrl)
    cy.get('#card-no').type('4242424242424242')
    cy.get('#expiry-month').type('10')
    cy.get('#expiry-year').type('50')
    cy.get('#cardholder-name').type('Bilbo Baggins')
    cy.get('#cvc').type('123')
    cy.get('#address-line-1').type('Bag End')
    cy.get('#address-city').type('Hobbiton')
    cy.get('#address-postcode').type('E12 6EL')
    cy.get('#email').type('bilbo@example.com')
    cy.get('#submit-card-details').click()
  })

  it("Confirms payment", () => {
    cy.get('#confirm').click()
  })
})