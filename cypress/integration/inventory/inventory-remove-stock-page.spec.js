beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('[ Inventory ] Remove Stock Add Error Alert', () => {
    it('Remove Stock Add Error Alert', () => {
        cy.visit('inventory/detail/148dcf66-8e5c-41a7-812f-c796f22909df')
        cy.intercept('GET', '**/inventory/*').as('fetchInventory')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchInventory").then(() => {
            cy.get('[data-cy=moreMenu]').click({force: true})
            cy.get('.dropdown-menu.show').within(() => {
                cy.get('.dropdown-item').last().click({force: true})
            })

            // cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
            cy.get('form').within( () => {
                cy.get('select[name=location_guid]').select('31b42b1b-9807-4c6f-bf83-8790ef8bc772', {force: true})
                cy.get('input[name=quantity]').type('2200', {force: true})
                cy.get('textarea[name=description]').type('Remove', {force: true})
                cy.get('input[name=include_file]').check({force: true})
                cy.get('button.btn-primary > span.indicator-label').click({force: true})
                cy.intercept('PUT', '**/inventory/*/remove-stock*').as('removeStock')
            })
        })
    })
})
