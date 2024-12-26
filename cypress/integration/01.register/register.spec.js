/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment';
beforeEach(() => {
  let baseUrl = Cypress.config('baseUrl')
  let protocol = baseUrl?.split('//')[0] + '//'
  let host = baseUrl?.split('.')[1]
  cy.visit(protocol + 'secure.' + host)
})
describe('Registration & Activation Email', () => {
    it('Test Registration Page', () => {
        cy.get('div').find('img[alt*="Logo"]')
        cy.get('form#kt_login_signup_form').within(() => {
            cy.get('.first-name').find('input[name*="firstname"]').type('Test', {force:true})
            cy.get('.last-name').find('input[name*="lastname"]').type('Testing', {force:true})
            cy.get('.email').find('input[name*="email"]').type('dida.nurdiansyah@assetdata.io', {force:true})
            cy.get('.company-name').find('input[name*="companyName"]').type('Anbu'+moment().format('DDMMYYYYHHmmss'))
            // cy.get('.company-size').find('select[name*="companySize"]').select('6-10 employees')
            cy.get('.site').find('input[name*="fqdn"]').type(`test`+moment().format('DDMMYYYYHHmmss'))
            cy.get('.plan-id')
            .click({force:true})
            .find('input#registerPlan')
            .type('Advance{enter}', {force: true})
            cy.get('.the-checkbox').find('input[type=checkbox]').click({force: true})
            cy.get('.submit').find('button[type=submit]').contains('Register Now').click({force: true})
            cy.intercept('GET', '**/tenant/*', {statusCode : 200}).as('api')
            cy.wait(5000)
            // cy.get('.w-lg-700px > :nth-child(1) > :nth-child(2) > :nth-child(1)').contains("You're all set.").should('exist')
            // cy.contains("Please check your email to activate your account.").should('exist')
        })
    })

    it('Test Validation Registration Page', () => {
        cy.contains('Create an Account').should('exist')
    })
})
 describe('Case By Tickets', () => {
   it('FE-2280 standardize register form', () => {
     cy.get('#react-select-2-placeholder:first').should('have.css', 'font-weight').and('match', /500/)
   })
 })
