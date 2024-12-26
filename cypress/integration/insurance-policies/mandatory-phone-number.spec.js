/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Insurance Police', () => {
    beforeEach(() => {
        cy.visit('insurance/policies')
        cy.intercept('**/api/**', ).as('fetchData')
    })

    it('Mandatory Phone Add', () => {
        cy.wait('@fetchData')
        cy.get('[data-cy=addInsurancePolicy]').click({force: true})
    })

    it('Mandatory Phone Edit', () => {
        cy.wait('@fetchData')
        cy.get('[data-cy=addInsurancePolicy]').click({force: true})
    })
})