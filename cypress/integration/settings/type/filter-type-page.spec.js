beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
  })

describe('[ Type ] Filter Type Page', () => {
    it('Filter Type', () => {
        cy.visit('setup/settings/type')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        // cy.intercept('GET', '**/setting/type*').as('fetchPolicies')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('.mb-6 > :nth-child(2) > :nth-child(1) > .btn').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('form').within( () => {
            cy.get('select[name=category]').select('ee73165e-d1c7-4e6b-93bf-d5bf3ad5687c', {force: true})
            cy.get('input[name=name]').type('Type : ' + Date.now())
            cy.get('button.btn-primary > span.indicator-label').click()
            cy.intercept('POST', "**/setting/type*").as('newType')
        })

        cy.get('[data-cy=filter] > .dropdown > .dropdown-toggle').click({force: true})
        cy.get('#column-0').click({force: true})
        cy.get('[data-cy=filter] > .dropdown > .dropdown-toggle').click({force: true})
        cy.get('.bg-white > .dropdown-toggle').click({force: true})
    })
})
