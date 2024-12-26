beforeEach(cy.login)
describe('Billing, Confirm Your Plan Details. Testing...', () => {
  beforeEach(() => {
    cy.visit('/billing')
    cy.intercept('**/api/**').as('getData')
  })
  it('Confirm Your Plan Details...', () => {
    cy.wait('@getData')
    cy.get('form').within(() => {
      cy.get('.col-md-8 > :nth-child(1) > .card-body > .row > :nth-child(1) > .form-control[name=first_name]')
        .type('Check', {force : true})
      cy.get(':nth-child(1) > .card-body > .row > :nth-child(2) .form-control[name=last_name]')
        .type('Cypress', {force : true})
      cy.get(':nth-child(1) > .card-body > .row > :nth-child(3)')
      cy.get(':nth-child(5) > .input-group > .form-control').type('+62883647722', {force : true})
      // cy.get('.css-16r5znb-control > .css-1yjo0db-ValueContainer')
      cy.get('.col-md-8 > :nth-child(2) > .card-body > .row > :nth-child(2) .form-control').type('- Address', {force : true})
      cy.get(':nth-child(2) > .card-body > .row > :nth-child(3) > .form-control').type('Cobaa', {force : true})
      cy.get(':nth-child(2) > .card-body > .row > :nth-child(4) > .form-control').type('- Test', {force : true})
      cy.get(':nth-child(2) > .card-body > .row > :nth-child(5) > .form-control').type('- Bdg', {force : true})
      cy.get('.row > :nth-child(6)')
      // cy.get('.row > :nth-child(6) .form-control')
      //   .clear().type('40558', {force : true})
      // cy.get('.card-detail').within(() => {
      //     cy.get('input[name="card_name"]').type('nomnom', {force : true})
      //     cy.get('.col-lg-7 > .input-group > .form-control').type('4242424242424242', {force : true})
      //     cy.get('.col-lg-5 > .row > :nth-child(1) > .input-group > input#calender').type('0530', {force: true})
      //     cy.get(':nth-child(2) > .input-group > .form-control').type('314', {force : true})
      // })
    })

    // cy.get('.col-md > .btn').contains('Subscribe').click({force : true})
    // cy.get('.indicator-progress').should('be.visible');
    // cy.intercept('POST, **/setting/owner/subscription').as('SaveBilling')
  })  
})

describe('Case by Tickets', () => {
  beforeEach(() => {
    cy.visit('/billing')
    cy.intercept('**/geo/country').as('getCountry')
  })
  it('SEN-132 Objects are not valid as a React child', () => {
    cy.wait('@getCountry').its('response.statusCode').should('eq', 200)
  })
})