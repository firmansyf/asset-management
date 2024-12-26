beforeEach(cy.login)
describe('Add Edit Contact, Testing...', () => {
    it('Add, Testing...', () => {
        cy.visit('user-management/contact')
        cy.intercept('GET', '**/help-desk/**').as('fetchContact')
        cy.get('[data-cy=addContact]').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')    
        cy.get('form').within(() => {
                cy.get('input[name=name]').type('Testing', {force : true})
                cy.get('input[name=title]').type('dev',{force : true})
                cy.get('input[name=email]').type('cypress@example.com', {force : true})
                cy.get('input[name=phone_number]').type('88738449100', {force : true})
                cy.get('.modal-body > :nth-child(3)')
                cy.get('input[name=facebook]').type('cypress.io', {force : true})
                cy.get('input[name=twitter]').type('cypress.ok', {force : true})
            cy.get('.modal-footer').within(() => {
                cy.get('button[type=submit] > .indicator-label').contains('Add').click({force: true})
            })
         cy.intercept('POST', '**/help-desk/*').as('addContact')
        // })
      })
    })

    it('Edit, Testing...', () => {
        cy.visit('user-management/contact')
        cy.intercept('GET', '**/help-desk/**').as('fetchContact')
        cy.get(':nth-child(1) > .text-center > .d-flex > [data-cy=editTable]').click({force : true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('form').within(() => {
                cy.get('input[name=name]').clear().type('Test 1')
                cy.get('input[name=title]').clear().type('dev')
                cy.get('input[name=email]').clear().type('example@example.com')
                cy.get('input[name=phone_number]').clear().type('1111-0900')
                cy.get('.modal-body > :nth-child(3)')
                cy.get('input[name=facebook]').clear().type('Test.cypress.io')
                cy.get('input[name=twitter]').type('cypress.ok')
            cy.get('.modal-footer').within(() => {
                cy.get('button[type=submit] > .indicator-label').contains('Save').click({force: true})
            })
         cy.intercept('PUT', '**/help-desk/*').as('addContact')
       })
    })
})